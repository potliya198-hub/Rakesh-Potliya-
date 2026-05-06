"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, UserPlus, ShieldAlert, Phone, Building, Hash, Trash2 } from "lucide-react";
import { MOCK_STUDENTS, Student } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [newStudent, setNewStudent] = useState({
    name: "",
    roll: "",
    phone: "",
    hostel: "boys" as "boys" | "girls",
    room: ""
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.roll || !newStudent.phone) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    const student: Student = {
      ...newStudent,
      uid: Math.random().toString(36).substr(2, 9),
      status: 'in',
      createdAt: new Date().toISOString()
    };

    setStudents([student, ...students]);
    setNewStudent({ name: "", roll: "", phone: "", hostel: "boys", room: "" });
    setShowAddForm(false);
    toast({ title: "Student Added", description: `${student.name} can now login via OTP.` });
  };

  const removeStudent = (uid: string) => {
    setStudents(students.filter(s => s.uid !== uid));
    toast({ title: "Removed", description: "Student record archived." });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Admin Console</h1>
          <p className="text-muted-foreground">Management & Pre-Registration</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2 bg-accent hover:bg-accent/90">
          <UserPlus className="w-4 h-4" /> Add Student
        </Button>
      </header>

      {showAddForm && (
        <Card className="border-none shadow-xl bg-white animate-in slide-in-from-top duration-300">
          <CardHeader>
            <CardTitle>Pre-Register New Student</CardTitle>
            <CardDescription>Registered students can login using their phone number.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Full Name</label>
                <div className="relative">
                  <Input placeholder="Rakesh Kumar" className="pl-8" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                  <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Roll Number</label>
                <div className="relative">
                  <Input placeholder="2021CS001" className="pl-8" value={newStudent.roll} onChange={e => setNewStudent({...newStudent, roll: e.target.value})} />
                  <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Phone (OTP)</label>
                <div className="relative">
                  <Input placeholder="+917375923307" className="pl-8" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
                  <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Hostel</label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background" 
                  value={newStudent.hostel}
                  onChange={e => setNewStudent({...newStudent, hostel: e.target.value as any})}
                >
                  <option value="boys">Boys Hostel</option>
                  <option value="girls">Girls Hostel</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Room</label>
                <div className="relative">
                  <Input placeholder="101" className="pl-8" value={newStudent.room} onChange={e => setNewStudent({...newStudent, room: e.target.value})} />
                  <Building className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full bg-primary h-10 rounded-xl">Register Student</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 border-none shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" /> Stats Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-2xl">
              <p className="text-xs text-muted-foreground font-bold">TOTAL REGISTERED</p>
              <p className="text-3xl font-black text-primary">{students.length}</p>
            </div>
            <div className="p-4 bg-accent/5 rounded-2xl">
              <p className="text-xs text-accent font-bold">CURRENTLY IN</p>
              <p className="text-3xl font-black text-accent">{students.filter(s => s.status === 'in').length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-none shadow-md bg-white">
          <CardHeader>
            <CardTitle>Enrollment Directory</CardTitle>
            <CardDescription>Manage verified students and their residency status.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] px-2">
              <div className="space-y-3">
                {students.map(s => (
                  <div key={s.uid} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white border rounded-2xl hover:border-primary/30 transition-all gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{s.roll} • {s.hostel} • {s.room}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={s.status === 'in' ? 'bg-accent' : 'bg-primary'}>
                          {s.status.toUpperCase()}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">{s.phone}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeStudent(s.uid)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
