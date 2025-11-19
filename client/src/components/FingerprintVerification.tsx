import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import VerificationProgress from "./VerificationProgress";
import CameraMonitor from "./CameraMonitor";
import { CheckCircle, XCircle, Fingerprint, ArrowRight } from "lucide-react";

interface FingerprintVerificationProps {
  voterName: string;
  onVerified: (matchScore: number) => void;
  onRejected: () => void;
  onBack: () => void;
}

export default function FingerprintVerification({
  voterName,
  onVerified,
  onRejected,
  onBack,
}: FingerprintVerificationProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const steps = [
    { label: "Officer Login", status: "completed" as const },
    { label: "Voter ID", status: "completed" as const },
    { label: "Face Verify", status: "completed" as const },
    { label: "Fingerprint", status: "current" as const },
    { label: "Vote", status: "pending" as const },
  ];

  const startScanning = () => {
    setIsScanning(true);
    setMatchScore(0);
    setIsVerified(null);

    // Simulate fingerprint scanning
    const interval = setInterval(() => {
      setMatchScore((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 12;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      // Simulate match result (95% success rate)
      const score = Math.random() > 0.05 ? Math.floor(Math.random() * 10) + 90 : Math.floor(Math.random() * 30) + 40;
      setMatchScore(score);
      setIsVerified(score >= 80);
      setIsScanning(false);
    }, 2000);
  };

  useEffect(() => {
    startScanning();
  }, []);

  const handleContinue = () => {
    if (isVerified && matchScore >= 80) {
      onVerified(matchScore);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="py-4">
          <VerificationProgress steps={steps} />
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2">
            <CameraMonitor isActive={true} size="large" />
          </div>

          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Fingerprint Verification</CardTitle>
                <CardDescription>Biometric fingerprint authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center p-8 bg-muted rounded-md">
                  <div className={`transition-all ${isScanning ? 'animate-pulse' : ''}`}>
                    <Fingerprint className={`w-32 h-32 ${isScanning ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-lg font-semibold">{voterName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isScanning ? "Please place your finger on the scanner..." : "Scan complete"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Match Score</span>
                      <span className="text-2xl font-bold">{matchScore}%</span>
                    </div>
                    <Progress value={matchScore} className="h-3" />
                  </div>

                  {isVerified !== null && (
                    <div className={`p-4 rounded-md ${isVerified ? 'bg-chart-2/10' : 'bg-destructive/10'}`}>
                      <div className="flex items-center gap-3">
                        {isVerified ? (
                          <>
                            <CheckCircle className="w-6 h-6 text-chart-2" />
                            <div className="flex-1">
                              <p className="font-semibold text-chart-2">Fingerprint Verified</p>
                              <p className="text-sm text-muted-foreground">Biometric match confirmed</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6 text-destructive" />
                            <div className="flex-1">
                              <p className="font-semibold text-destructive">Verification Failed</p>
                              <p className="text-sm text-muted-foreground">Fingerprint does not match records</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Quality</p>
                      <Badge variant="outline" className="mt-1">
                        {matchScore >= 90 ? "Excellent" : matchScore >= 80 ? "Good" : "Poor"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge variant={isVerified ? "default" : "destructive"} className="mt-1">
                        {isVerified === null ? "Scanning" : isVerified ? "Matched" : "Failed"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-4">
              <Button variant="outline" onClick={onBack} disabled={isScanning} data-testid="button-back">
                Back
              </Button>
              {isVerified === false ? (
                <Button variant="destructive" onClick={onRejected} data-testid="button-reject">
                  Reject Voter
                  <XCircle className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleContinue}
                  disabled={isScanning || !isVerified}
                  data-testid="button-continue"
                  className="h-12 px-6"
                >
                  Proceed to Voting
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
