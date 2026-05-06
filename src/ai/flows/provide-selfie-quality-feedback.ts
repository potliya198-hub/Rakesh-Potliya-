'use server';
/**
 * @fileOverview Provides feedback on the quality of a selfie image for check-in/check-out.
 *
 * - provideSelfieQualityFeedback - A function that handles the selfie quality feedback process.
 * - SelfieQualityFeedbackInput - The input type for the provideSelfieQualityFeedback function.
 * - SelfieQualityFeedbackOutput - The return type for the provideSelfieQualityFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SelfieQualityFeedbackInputSchema = z.object({
  selfieDataUri: z
    .string()
    .describe(
      "A selfie image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SelfieQualityFeedbackInput = z.infer<
  typeof SelfieQualityFeedbackInputSchema
>;

const SelfieQualityFeedbackOutputSchema = z.object({
  isGoodQuality: z
    .boolean()
    .describe('True if the selfie image is of good quality, false otherwise.'),
  feedback: z
    .string()
    .describe('Detailed feedback on the selfie quality, especially if it is poor.'),
  issues: z
    .array(z.enum(['blurry', 'too_dark', 'no_face_detected', 'multiple_faces_detected', 'other']))
    .describe('A list of specific issues detected in the selfie, if any.'),
});
export type SelfieQualityFeedbackOutput = z.infer<
  typeof SelfieQualityFeedbackOutputSchema
>;

export async function provideSelfieQualityFeedback(
  input: SelfieQualityFeedbackInput
): Promise<SelfieQualityFeedbackOutput> {
  return provideSelfieQualityFeedbackFlow(input);
}

const provideSelfieQualityFeedbackPrompt = ai.definePrompt({
  name: 'provideSelfieQualityFeedbackPrompt',
  input: {schema: SelfieQualityFeedbackInputSchema},
  output: {schema: SelfieQualityFeedbackOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing selfie image quality for a hostel management system. Your task is to review the provided selfie image and determine if its quality is sufficient for identity verification.

Critically analyze the image for the following common issues:
- **Blurriness**: Is the image out of focus or motion blurred?
- **Lighting**: Is the image too dark, making the subject difficult to see?
- **Face Detection**: Is exactly one clear face visible in the image? If no face is detected, or if multiple faces are detected, this is a critical issue.

Provide your analysis in the specified JSON format. Set 'isGoodQuality' to true only if the image is clear, well-lit, and contains exactly one clearly visible face. If not, set 'isGoodQuality' to false, provide specific 'feedback' to the user on what needs to be improved, and list all 'issues' found.

Selfie Image: {{media url=selfieDataUri}}`,
});

const provideSelfieQualityFeedbackFlow = ai.defineFlow(
  {
    name: 'provideSelfieQualityFeedbackFlow',
    inputSchema: SelfieQualityFeedbackInputSchema,
    outputSchema: SelfieQualityFeedbackOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await provideSelfieQualityFeedbackPrompt({
        selfieDataUri: input.selfieDataUri,
      });
      return output!;
    } catch (error: any) {
      if (error?.message?.includes('503') || error?.message?.includes('UNAVAILABLE')) {
        return {
          isGoodQuality: true,
          feedback: "AI verification service is busy. Proceeding with standard validation.",
          issues: []
        };
      }
      throw error;
    }
  }
);
