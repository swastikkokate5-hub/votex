import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import VerificationProgress from "./VerificationProgress";
import CameraMonitor from "./CameraMonitor";
import { CheckCircle, Lock } from "lucide-react";
import lotusSymbol from "@assets/generated_images/Lotus_party_symbol_b11ff4ad.png";
import handSymbol from "@assets/generated_images/Hand_party_symbol_941e22b1.png";
import elephantSymbol from "@assets/generated_images/Elephant_party_symbol_a39e6dc0.png";
import wheelSymbol from "@assets/generated_images/Wheel_party_symbol_4c666b74.png";

interface Candidate {
  id: string;
  name: string;
  partyName: string;
  partySymbol: string;
}

interface CandidateSelectionProps {
  candidates: Candidate[];
  onSubmit: (candidateId: string) => void;
  onBack: () => void;
}

const symbolImages: Record<string, string> = {
  lotus: lotusSymbol,
  hand: handSymbol,
  elephant: elephantSymbol,
  wheel: wheelSymbol,
};

export default function CandidateSelection({ candidates, onSubmit, onBack }: CandidateSelectionProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const steps = [
    { label: "Officer Login", status: "completed" as const },
    { label: "Voter ID", status: "completed" as const },
    { label: "Face Verify", status: "completed" as const },
    { label: "Fingerprint", status: "completed" as const },
    { label: "Vote", status: "current" as const },
  ];

  const handleCandidateSelect = (candidateId: string) => {
    if (!isLocked) {
      setSelectedCandidate(candidateId);
      setIsLocked(true);
      setShowConfirmDialog(true);
    }
  };

  const handleConfirm = () => {
    if (selectedCandidate) {
      onSubmit(selectedCandidate);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setIsLocked(false);
    setSelectedCandidate(null);
  };

  const getSymbolImage = (symbol: string) => {
    return symbolImages[symbol.toLowerCase()] || lotusSymbol;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="py-4">
          <VerificationProgress steps={steps} />
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 space-y-4">
            <CameraMonitor isActive={true} size="large" />
            {isLocked && (
              <Card className="bg-chart-4/10 border-chart-4">
                <CardContent className="p-4 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-chart-4" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Selection Locked</p>
                    <p className="text-xs text-muted-foreground">Confirm to submit vote</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Select Your Candidate</CardTitle>
                <CardDescription>Choose one candidate to cast your vote</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {candidates.map((candidate) => {
                    const isSelected = selectedCandidate === candidate.id;
                    const isDisabled = isLocked && !isSelected;

                    return (
                      <Card
                        key={candidate.id}
                        className={`cursor-pointer transition-all hover-elevate ${
                          isSelected
                            ? "border-primary ring-2 ring-primary"
                            : isDisabled
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleCandidateSelect(candidate.id)}
                        data-testid={`candidate-${candidate.id}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center gap-4">
                            <div className="relative">
                              <img
                                src={getSymbolImage(candidate.partySymbol)}
                                alt={candidate.partyName}
                                className="w-24 h-24 object-contain"
                              />
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                                  <CheckCircle className="w-6 h-6 text-primary-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{candidate.name}</h3>
                              <Badge variant="outline" className="mt-2">
                                {candidate.partyName}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {isLocked && (
                  <div className="p-4 bg-primary/10 rounded-md border border-primary">
                    <p className="text-sm font-medium text-center">
                      You have selected:{" "}
                      <span className="font-bold">
                        {candidates.find((c) => c.id === selectedCandidate)?.name}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between gap-4">
              <Button variant="outline" onClick={onBack} disabled={isLocked} data-testid="button-back">
                Back
              </Button>
            </div>
          </div>
        </div>

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
              <AlertDialogDescription>
                You have selected{" "}
                <span className="font-semibold">
                  {candidates.find((c) => c.id === selectedCandidate)?.name}
                </span>{" "}
                from <span className="font-semibold">
                  {candidates.find((c) => c.id === selectedCandidate)?.partyName}
                </span>.
                <br />
                <br />
                This action cannot be undone. Are you sure you want to submit your vote?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel} data-testid="button-cancel-vote">
                Change Selection
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm} data-testid="button-confirm-vote">
                Confirm & Submit Vote
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
