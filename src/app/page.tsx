
"use client";

import React, { useState, use } from "react";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { DeanDashboard } from "@/components/dashboard/DeanDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { MOCK_STUDENTS, UserRole } from "@/lib/mock-data";
import { Phone, Lock, User, ShieldCheck, GraduationCap, Building2, Eye, EyeOff, MessageSquare } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIdentifier = identifier.trim();

    if (role === 'student') {
      if (!isOtpSent) {
        // Step 1: Send OTP
        const student = MOCK_STUDENTS.find(s => s.phone === cleanIdentifier);
        if (student) {
          setIsOtpSent(true);
          toast({
            title: "OTP Sent",
            description: "A verification code has been sent to " + cleanIdentifier,
          });
        } else {
          toast({
            title: "Error",
            description: "Phone number not registered in system. Use MOCK numbers like +917375923307",
            variant: "destructive"
          });
        }
      } else {
        // Step 2: Verify OTP
        if (otp === "123456") {
          setIsLoggedIn(true);
          toast({
            title: "Success",
            description: "Logged in successfully.",
          });
        } else {
          toast({
            title: "Verification Failed",
            description: "Invalid OTP. Please use 123456 for testing.",
            variant: "destructive"
          });
        }
      }
    } else {
      // Admin/Dean Login
      if (cleanIdentifier && password) {
        setIsLoggedIn(true);
      } else {
        toast({
          title: "Login Error",
          description: "Please enter valid credentials.",
          variant: "destructive"
        });
      }
    }
  };

  const resetRole = () => {
    setRole(null);
    setIsOtpSent(false);
    setOtp("");
    setIdentifier("");
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border/50 md:hidden z-50">
          <div className="flex justify-around p-3">
             <Button variant="ghost" size="icon" onClick={() => setIsLoggedIn(false)}><Lock className="w-5 h-5 text-muted-foreground" /></Button>
          </div>
        </nav>
        
        {role === 'student' && <StudentDashboard user={MOCK_STUDENTS.find(s => s.phone === identifier.trim()) || MOCK_STUDENTS[0]} />}
        {role === 'admin' && <AdminDashboard />}
        {role === 'dean' && <DeanDashboard />}
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center space-y-2">
        <div className="bg-primary/10 p-4 rounded-3xl inline-block mb-4">
          <Building2 className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-black text-primary tracking-tight">HMS</h1>
        <p className="text-muted-foreground max-w-xs mx-auto">Digital entry system for smart hostels. Safe. Verified. Real-time.</p>
      </div>

      {!role ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl animate-in fade-in zoom-in duration-500">
          <Card className="group cursor-pointer hover:shadow-2xl transition-all border-none hover:translate-y-[-4px]" onClick={() => setRole('student')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8" />
              </div>
              <CardTitle>Student</CardTitle>
              <CardDescription>Login with Phone OTP</CardDescription>
            </CardHeader>
          </Card>

          <Card className="group cursor-pointer hover:shadow-2xl transition-all border-none hover:translate-y-[-4px]" onClick={() => setRole('dean')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8" />
              </div>
              <CardTitle>Dean Sir</CardTitle>
              <CardDescription>View Real-time Data</CardDescription>
            </CardHeader>
          </Card>

          <Card className="group cursor-pointer hover:shadow-2xl transition-all border-none hover:translate-y-[-4px]" onClick={() => setRole('admin')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <CardTitle>Admin</CardTitle>
              <CardDescription>Manage Students & Logs</CardDescription>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <Card className="w-full max-w-md border-none shadow-2xl animate-in slide-in-from-bottom duration-300">
          <CardHeader>
            <Button variant="ghost" size="sm" className="w-fit mb-4" onClick={resetRole}>← Back</Button>
            <CardTitle className="text-2xl font-bold">Welcome, {role.toUpperCase()}</CardTitle>
            <CardDescription>
              {role === 'student' 
                ? (isOtpSent ? "Enter the 6-digit code sent to your phone" : "Enter your registered phone number")
                : "Enter your email credentials"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  {!isOtpSent ? (
                    <>
                      <Input 
                        placeholder={role === 'student' ? "+91 XXXXX XXXXX" : "admin@hostelflow.com"} 
                        className="pl-10 h-12 rounded-xl"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        disabled={isOtpSent}
                      />
                      {role === 'student' ? <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /> : <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />}
                    </>
                  ) : (
                    <>
                      <Input 
                        placeholder="Enter 6-digit OTP" 
                        className="pl-10 h-12 rounded-xl text-center tracking-[1em] font-bold"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </>
                  )}
                </div>
              </div>
              {role !== 'student' && (
                <div className="space-y-2">
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-10 pr-10 h-12 rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl font-bold">
                {role === 'student' ? (isOtpSent ? "Verify & Login" : "Send OTP") : "Login"}
              </Button>
              {isOtpSent && (
                <Button variant="link" className="w-full text-xs" onClick={() => setIsOtpSent(false)}>
                  Resend OTP / Change Number
                </Button>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
             <p className="text-xs text-muted-foreground">© 2024 HMS Management</p>
          </CardFooter>
        </Card>
      )}
      <Toaster />
    </div>
  );
}
