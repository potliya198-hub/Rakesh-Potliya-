'use server';
/**
 * @fileOverview A Genkit flow to summarize daily hostel activity for Dean.
 *
 * - summarizeDailyHostelActivity - A function that provides a daily summary of hostel activity.
 * - SummarizeDailyHostelActivityInput - The input type for the summarizeDailyHostelActivity function.
 * - SummarizeDailyHostelActivityOutput - The return type for the summarizeDailyHostelActivity function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EntrySchema = z.object({
  uid: z.string().describe('Student user ID'),
  name: z.string().describe('Student name'),
  roll: z.string().describe('Student roll number'),
  hostel: z.enum(['boys', 'girls']).describe('Hostel type'),
  room: z.string().describe('Room number'),
  type: z.enum(['in', 'out', 'visitor']).describe('Type of entry (in, out, or visitor)'),
  photoURL: z.string().url().describe('URL of the selfie photo'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).describe('GPS coordinates of the entry location'),
  timestamp: z.string().datetime().describe('ISO date string of the entry timestamp'),
  time: z.string().describe('Readable time of entry'),
  date: z.string().describe('Readable date of entry'),
  visitorName: z.string().optional().describe('Visitor name (if type is visitor)'),
  visitorPhone: z.string().optional().describe('Visitor phone (if type is visitor)'),
  reason: z.string().optional().describe('Reason for visitor entry (if type is visitor)'),
  hostStudentName: z.string().optional().describe('Name of the student hosting the visitor (if type is visitor)'),
});

const SummarizeDailyHostelActivityInputSchema = z.object({
  date: z.string().describe('The date for which to summarize activity (e.g., "2023-10-27")'),
  entries: z.array(EntrySchema).describe('A list of all entries for the specified date.'),
});
export type SummarizeDailyHostelActivityInput = z.infer<typeof SummarizeDailyHostelActivityInputSchema>;

const SummarizeDailyHostelActivityOutputSchema = z.object({
  totalCheckIns: z.number().describe('Total number of student check-ins for the day.'),
  totalCheckOuts: z.number().describe('Total number of student check-outs for the day.'),
  totalVisitorEntries: z.number().describe('Total number of visitor entries for the day.'),
  unusualPatterns: z.string().describe('Any detected unusual patterns or anomalies in the day\'s activity. If none, state "None found.".'),
  summaryText: z.string().describe('A concise, human-readable summary of the daily hostel activity.'),
});
export type SummarizeDailyHostelActivityOutput = z.infer<typeof SummarizeDailyHostelActivityOutputSchema>;

export async function summarizeDailyHostelActivity(input: SummarizeDailyHostelActivityInput): Promise<SummarizeDailyHostelActivityOutput> {
  return summarizeDailyHostelActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDailyHostelActivityPrompt',
  input: { schema: SummarizeDailyHostelActivityInputSchema },
  output: { schema: SummarizeDailyHostelActivityOutputSchema },
  prompt: `You are an AI assistant for a Hostel Management System. Your task is to analyze the daily activity data provided and generate a concise summary for the Dean.

Today's Date: {{{date}}}

Analyze the following entries to provide:
1. Total number of student check-ins (type: 'in').
2. Total number of student check-outs (type: 'out').
3. Total number of visitor entries (type: 'visitor').
4. Any unusual patterns or anomalies. This could include a significantly high number of entries/exits compared to typical days, entries with unusual timestamps (e.g., very late at night or very early morning without valid reason), or any other data that seems out of the ordinary.

Finally, provide a comprehensive summary text incorporating these metrics and observations.

Entries:
{{#each entries}}
- Type: {{this.type}}, Student: {{this.name}} (Roll: {{this.roll}}), Time: {{this.time}}, Location: ({{this.location.lat}}, {{this.location.lng}}){{#if this.visitorName}}, Visitor: {{this.visitorName}} (Reason: {{this.reason}}){{/if}}
{{/each}}

Focus on providing accurate counts and insightful observations regarding unusual patterns.`,
});

const summarizeDailyHostelActivityFlow = ai.defineFlow(
  {
    name: 'summarizeDailyHostelActivityFlow',
    inputSchema: SummarizeDailyHostelActivityInputSchema,
    outputSchema: SummarizeDailyHostelActivityOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (error: any) {
      if (error?.message?.includes('503') || error?.message?.includes('UNAVAILABLE')) {
        return {
          totalCheckIns: input.entries.filter(e => e.type === 'in').length,
          totalCheckOuts: input.entries.filter(e => e.type === 'out').length,
          totalVisitorEntries: input.entries.filter(e => e.type === 'visitor').length,
          unusualPatterns: "AI service busy. Manual pattern review recommended.",
          summaryText: "The AI summary service is currently experiencing high demand. Basic counts have been calculated from raw activity logs."
        };
      }
      throw error;
    }
  }
);
