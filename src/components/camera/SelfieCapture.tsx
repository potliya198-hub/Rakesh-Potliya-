"use client";

import React, { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { provideSelfieQualityFeedback } from "@/ai/flows/provide-selfie-quality-feedback";
import { useToast } from "@/hooks/use-toast";

interface SelfieCaptureProps {
  onCapture: (dataUri: string) => void;
  label?: string;
}

export function SelfieCapture({ onCapture, label = "Take Selfie" }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 400, height: 400 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = 400;
        canvasRef.current.height = 400;
        context.drawImage(videoRef.current, 0, 0, 400, 400);
        const dataUri = canvasRef.current.toDataURL("image/jpeg");
        setPhoto(dataUri);
        stopCamera();
        verifySelfie(dataUri);
      }
    }
  };

  const verifySelfie = async (dataUri: string) => {
    setIsVerifying(true);
    try {
      const result = await provideSelfieQualityFeedback({ selfieDataUri: dataUri });
      if (result.isGoodQuality) {
        setIsVerified(true);
        onCapture(dataUri);
        toast({ title: "Selfie Verified", description: "Identity check passed." });
      } else {
        setPhoto(null);
        toast({ 
          title: "Quality Issue", 
          description: result.feedback || "Please retake the photo in better light.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({ title: "Verification Error", description: "AI service is currently unavailable.", variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const reset = () => {
    setPhoto(null);
    setIsVerified(false);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      <div className="relative w-full aspect-square bg-muted rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border-4 border-white">
        {!stream && !photo && (
          <Button onClick={startCamera} variant="secondary" className="gap-2">
            <Camera className="w-4 h-4" /> Start Camera
          </Button>
        )}
        
        {stream && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover mirror"
          />
        )}

        {photo && (
          <img src={photo} alt="Selfie" className="w-full h-full object-cover" />
        )}

        <canvas ref={canvasRef} className="hidden" />

        {isVerifying && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm font-medium">AI is verifying your selfie...</p>
          </div>
        )}

        {isVerified && (
          <div className="absolute top-2 right-2 bg-accent text-white p-1 rounded-full shadow-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="flex gap-2 w-full">
        {stream && (
          <Button onClick={capturePhoto} className="flex-1 gap-2 bg-primary hover:bg-primary/90">
            <Camera className="w-4 h-4" /> Capture Photo
          </Button>
        )}
        {photo && !isVerifying && (
          <Button onClick={reset} variant="outline" className="flex-1 gap-2">
            <RefreshCw className="w-4 h-4" /> Retake
          </Button>
        )}
      </div>
      
      {!photo && !stream && <p className="text-xs text-muted-foreground text-center">{label}</p>}
    </div>
  );
}
