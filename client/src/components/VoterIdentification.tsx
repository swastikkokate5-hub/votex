import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import VerificationProgress from "./VerificationProgress";
import { QrCode, Search, ArrowRight } from "lucide-react";

interface VoterIdentificationProps {
  onSubmit: (voterId: string) => void;
  onBack: () => void;
}

export default function VoterIdentification({ onSubmit, onBack }: VoterIdentificationProps) {
  const [voterId, setVoterId] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const steps = [
    { label: "Officer Login", status: "completed" as const },
    { label: "Voter ID", status: "current" as const },
    { label: "Face Verify", status: "pending" as const },
    { label: "Fingerprint", status: "pending" as const },
    { label: "Vote", status: "pending" as const },
  ];

  const handleScan = () => {
    setIsScanning(true);
    // Simulate QR scan
    setTimeout(() => {
      setVoterId("VOT123456789");
      setIsScanning(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (voterId.trim()) {
      onSubmit(voterId);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="py-4">
          <VerificationProgress steps={steps} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Voter Identification</CardTitle>
            <CardDescription>Scan QR code or enter Voter ID manually</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Scan QR Code</h3>
                <Card className="bg-muted">
                  <CardContent className="p-8">
                    <div className="aspect-square bg-background rounded-md flex items-center justify-center">
                      {isScanning ? (
                        <div className="text-center">
                          <div className="animate-pulse">
                            <QrCode className="w-24 h-24 mx-auto text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-4">Scanning...</p>
                        </div>
                      ) : (
                        <QrCode className="w-24 h-24 text-muted-foreground" />
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="w-full h-12"
                  data-testid="button-scan-qr"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  {isScanning ? "Scanning..." : "Scan QR Code"}
                </Button>
              </div>

              <div className="flex items-center justify-center">
                <Separator orientation="vertical" className="hidden md:block h-64" />
                <div className="md:hidden w-full">
                  <Separator />
                  <p className="text-center text-sm text-muted-foreground my-4">OR</p>
                  <Separator />
                </div>
                <span className="hidden md:block text-sm text-muted-foreground mx-4">OR</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Manual Entry</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="voterId">Voter ID</Label>
                    <Input
                      id="voterId"
                      placeholder="Enter Voter ID"
                      value={voterId}
                      onChange={(e) => setVoterId(e.target.value)}
                      className="h-12"
                      data-testid="input-voter-id"
                    />
                  </div>
                  {voterId && (
                    <Badge variant="outline" className="text-sm">
                      <Search className="w-3 h-3 mr-2" />
                      {voterId}
                    </Badge>
                  )}
                  <Button
                    type="submit"
                    disabled={!voterId.trim()}
                    className="w-full h-12"
                    data-testid="button-submit-voter-id"
                  >
                    Verify Voter Identity
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-start">
          <Button variant="outline" onClick={onBack} data-testid="button-back">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
