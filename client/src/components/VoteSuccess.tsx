import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface VoteSuccessProps {
  voterId: string;
  candidateName: string;
  boothId: string;
  timestamp: string;
  onReturnToDashboard: () => void;
}

export default function VoteSuccess({
  voterId,
  candidateName,
  boothId,
  timestamp,
  onReturnToDashboard,
}: VoteSuccessProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-chart-2/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-chart-2" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Vote Submitted Successfully</CardTitle>
            <CardDescription className="text-base mt-2">
              Your vote has been securely recorded and the voter has been blocked
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-muted rounded-md space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Voter ID</p>
                <p className="font-mono font-semibold mt-1" data-testid="text-voter-id">{voterId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Booth ID</p>
                <p className="font-semibold mt-1" data-testid="text-booth-id">{boothId}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Selected Candidate</p>
              <p className="font-semibold mt-1" data-testid="text-candidate">{candidateName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Timestamp</p>
              <p className="font-mono text-sm mt-1" data-testid="text-timestamp">{timestamp}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-chart-2/10 rounded-md border border-chart-2">
            <CheckCircle className="w-6 h-6 text-chart-2" />
            <div className="flex-1">
              <p className="font-semibold text-chart-2">Voter Blocked</p>
              <p className="text-sm text-muted-foreground">
                This voter ID has been marked as voted and cannot vote again
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Badge variant="outline" className="flex-1 justify-center py-2">
              Camera Stopped
            </Badge>
            <Badge variant="outline" className="flex-1 justify-center py-2">
              Session Closed
            </Badge>
          </div>

          <Button
            onClick={onReturnToDashboard}
            className="w-full h-12 text-lg"
            data-testid="button-return-dashboard"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
