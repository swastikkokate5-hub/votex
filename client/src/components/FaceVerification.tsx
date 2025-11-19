import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import VerificationProgress from "./VerificationProgress";
import CameraMonitor from "./CameraMonitor";
import { CheckCircle, XCircle, Camera, ArrowRight } from "lucide-react";

interface VoterData {
  voterId: string;
  name: string;
  age: number;
  address: string;
  photoUrl?: string;
}

interface FaceVerificationProps {
  voter: VoterData;
  onVerified: (matchScore: number) => void;
  onRejected: () => void;
  onBack: () => void;
}

export default function FaceVerification({ voter, onVerified, onRejected, onBack }: FaceVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [spoofDetected, setSpoofDetected] = useState(false);

  const steps = [
    { label: "Officer Login", status: "completed" as const },
    { label: "Voter ID", status: "completed" as const },
    { label: "Face Verify", status: "current" as const },
    { label: "Fingerprint", status: "pending" as const },
    { label: "Vote", status: "pending" as const },
  ];

  const startVerification = () => {
    setIsVerifying(true);
    setMatchScore(0);
    setIsVerified(null);

    // Simulate AI face matching
    const interval = setInterval(() => {
      setMatchScore((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      // Simulate match result (90% success rate)
      const score = Math.random() > 0.1 ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 40) + 30;
      setMatchScore(score);
      const verified = score >= 75;
      setIsVerified(verified);
      setSpoofDetected(!verified && Math.random() > 0.5);
      setIsVerifying(false);
    }, 2500);
  };

  useEffect(() => {
    startVerification();
  }, []);

  const handleContinue = () => {
    if (isVerified && matchScore >= 75) {
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
            {isVerifying && (
              <p className="text-sm text-center text-muted-foreground mt-4">
                AI analyzing face...
              </p>
            )}
          </div>

          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Face Verification</CardTitle>
                <CardDescription>AI-powered biometric authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-muted rounded-md">
                  <div className="w-24 h-24 bg-background rounded-md flex items-center justify-center overflow-hidden">
                    {voter.photoUrl ? (
                      <img src={voter.photoUrl} alt={voter.name} className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{voter.name}</h3>
                    <p className="text-sm text-muted-foreground">Voter ID: {voter.voterId}</p>
                    <p className="text-sm text-muted-foreground">Age: {voter.age}</p>
                    <p className="text-sm text-muted-foreground">{voter.address}</p>
                  </div>
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
                              <p className="font-semibold text-chart-2">Face Verified</p>
                              <p className="text-sm text-muted-foreground">Identity confirmed successfully</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6 text-destructive" />
                            <div className="flex-1">
                              <p className="font-semibold text-destructive">Verification Failed</p>
                              <p className="text-sm text-muted-foreground">
                                {spoofDetected ? "Spoof attempt detected" : "Face does not match records"}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Spoof Detection</p>
                      <Badge variant={spoofDetected ? "destructive" : "outline"} className="mt-1">
                        {spoofDetected ? "Detected" : "Clear"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <Badge variant="outline" className="mt-1">
                        {matchScore >= 85 ? "High" : matchScore >= 75 ? "Medium" : "Low"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-4">
              <Button variant="outline" onClick={onBack} disabled={isVerifying} data-testid="button-back">
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
                  disabled={isVerifying || !isVerified}
                  data-testid="button-continue"
                  className="h-12 px-6"
                >
                  Continue to Fingerprint
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
