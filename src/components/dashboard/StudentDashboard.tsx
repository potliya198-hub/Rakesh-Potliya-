"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogOut, LogIn, Users, History, MapPin, Clock } from "lucide-react";
import { SelfieCapture } from "@/components/camera/SelfieCapture";
import { MOCK_ENTRIES, Student, Entry } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export function StudentDashboard({ user }: { user: Student }) {
  const [entries, setEntries] = useState<Entry[]>(MOCK_ENTRIES.filter(e => e.uid === user.uid));
  const [activeView, setActiveView] = useState<'status' | 'visitor'>('status');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAction = (type: 'in' | 'out' | 'visitor') => {
    if (!capturedPhoto) {
      toast({ title: "Selfie Required", description: "Please capture a verified selfie first.", variant: "destructive" });
      return;
    }

    const newEntry: Entry = {
      id: Math.random().toString(36).substr(2, 9),
      uid: user.uid,
      name: user.name,
      roll: user.roll,
      hostel: user.hostel,
      room: user.room,
      type,
      photoURL: capturedPhoto,
      location: { lat: 26.9124, lng: 75.7873 },
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      ...(type === 'visitor' ? {
        visitorName: "Guest",
        visitorPhone: "+910000000000",
        reason: "Personal",
        hostStudentName: user.name
      } : {})
    };

    setEntries([newEntry, ...entries]);
    setCapturedPhoto(null);
    toast({ title: "Success", description: `Record saved: ${type.toUpperCase()}` });
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-border/50">
        <div>
          <h1 className="text-xl font-bold text-primary">HMS</h1>
          <p className="text-xs text-muted-foreground">{user.name} • {user.roll}</p>
        </div>
        <Badge variant={user.status === 'in' ? 'default' : 'secondary'} className="bg-accent/10 text-accent border-accent/20">
          {user.status.toUpperCase()}
        </Badge>
      </header>

      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/50 border border-border/50 p-1 rounded-xl">
          <TabsTrigger value="actions" className="rounded-lg">Actions</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg">History</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-4 pt-4">
          <Card className="border-none shadow-md overflow-hidden bg-white/80 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Location Verified
              </CardTitle>
              <CardDescription className="text-xs">You are within hostel premises</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SelfieCapture onCapture={setCapturedPhoto} label="Capture Selfie for Entry/Exit" />
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button 
                  disabled={!capturedPhoto}
                  onClick={() => handleAction('in')}
                  className="bg-accent hover:bg-accent/90 text-white h-12 rounded-xl flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> In
                </Button>
                <Button 
                  disabled={!capturedPhoto}
                  onClick={() => handleAction('out')}
                  className="bg-primary hover:bg-primary/90 h-12 rounded-xl flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Out
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  disabled={!capturedPhoto}
                  onClick={() => handleAction('visitor')}
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-dashed flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" /> Visitor Entry
                </Button>
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                  Visitor entry requires a joint selfie
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <Card className="border-none shadow-md bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> Recent Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-2">
                {entries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border/40 hover:border-primary/20 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      <img src={entry.photoURL} alt="log" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className={`text-[10px] h-5 ${
                          entry.type === 'in' ? 'border-accent text-accent' : 
                          entry.type === 'out' ? 'border-primary text-primary' : 
                          'border-orange-500 text-orange-500'
                        }`}>
                          {entry.type.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {entry.time}
                        </span>
                      </div>
                      <p className="text-xs font-medium mt-1 truncate">
                        {entry.type === 'visitor' ? `Visitor: ${entry.visitorName}` : entry.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
