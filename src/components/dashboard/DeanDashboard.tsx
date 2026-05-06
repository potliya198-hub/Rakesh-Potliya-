"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Activity, FileText, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { summarizeDailyHostelActivity, SummarizeDailyHostelActivityOutput } from "@/ai/flows/summarize-daily-hostel-activity";
import { MOCK_ENTRIES, Entry } from "@/lib/mock-data";

export function DeanDashboard() {
  const [entries, setEntries] = useState<Entry[]>(MOCK_ENTRIES);
  const [summary, setSummary] = useState<SummarizeDailyHostelActivityOutput | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [filter, setFilter] = useState("");

  const filteredEntries = entries.filter(e => 
    e.name.toLowerCase().includes(filter.toLowerCase()) || 
    e.roll.toLowerCase().includes(filter.toLowerCase())
  );

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const result = await summarizeDailyHostelActivity({
        date: new Date().toISOString().split('T')[0],
        entries: entries.map(e => ({
          ...e,
          uid: e.uid,
          name: e.name,
          roll: e.roll,
          hostel: e.hostel,
          room: e.room,
          type: e.type,
          photoURL: e.photoURL,
          location: e.location,
          timestamp: e.timestamp,
          time: e.time,
          date: e.date,
          visitorName: e.visitorName,
          visitorPhone: e.visitorPhone,
          reason: e.reason,
          hostStudentName: e.hostStudentName
        }))
      });
      setSummary(result);
    } catch (err) {
      console.error("Summary error", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Dean's Overview</h1>
          <p className="text-muted-foreground">Real-time Hostel Activity Monitoring</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Today's Date</p>
            <p className="text-sm font-semibold">{new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-lg bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" /> AI Insight Summary
              </CardTitle>
              <CardDescription>Daily automated activity analysis</CardDescription>
            </div>
            {loadingSummary && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
          </CardHeader>
          <CardContent className="space-y-4">
            {summary ? (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-[10px] text-primary uppercase font-bold">Check-Ins</p>
                    <p className="text-2xl font-black">{summary.totalCheckIns}</p>
                  </div>
                  <div className="p-3 bg-accent/5 rounded-xl border border-accent/10">
                    <p className="text-[10px] text-accent uppercase font-bold">Check-Outs</p>
                    <p className="text-2xl font-black">{summary.totalCheckOuts}</p>
                  </div>
                  <div className="p-3 bg-orange-500/5 rounded-xl border border-orange-500/10">
                    <p className="text-[10px] text-orange-600 uppercase font-bold">Visitors</p>
                    <p className="text-2xl font-black">{summary.totalVisitorEntries}</p>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl text-sm leading-relaxed border italic">
                  "{summary.summaryText}"
                </div>
                {summary.unusualPatterns !== "None found." && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex gap-2 border border-red-100">
                    <Activity className="w-4 h-4 shrink-0" />
                    <span><strong>Anomaly Alert:</strong> {summary.unusualPatterns}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground text-sm italic">
                {loadingSummary ? "Generating AI analysis..." : "No analysis available yet."}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search roll or name..." 
                className="pl-10 h-10 rounded-xl" 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="p-4 bg-primary text-white rounded-xl shadow-md cursor-pointer hover:bg-primary/90 transition-all">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <div>
                  <p className="font-bold text-sm">Download Report</p>
                  <p className="text-[10px] opacity-80">Export full daily activity log</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg bg-white">
        <CardHeader className="pb-2">
          <CardTitle>Activity Ledger</CardTitle>
          <CardDescription>All check-ins, check-outs, and visitors recorded today</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Hostel/Room</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Evidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-xs">{entry.time}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{entry.name}</span>
                        <span className="text-[10px] text-muted-foreground">{entry.roll}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize text-sm">{entry.hostel} • {entry.room}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${
                        entry.type === 'in' ? 'border-accent text-accent' : 
                        entry.type === 'out' ? 'border-primary text-primary' : 
                        'border-orange-500 text-orange-500'
                      } text-[10px]`}>
                        {entry.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <img src={entry.photoURL} className="w-10 h-10 rounded-lg object-cover border" alt="evidence" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
