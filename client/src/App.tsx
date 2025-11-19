import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import OfficerLogin from "@/components/OfficerLogin";
import OfficerDashboard from "@/components/OfficerDashboard";
import VoterIdentification from "@/components/VoterIdentification";
import FaceVerification from "@/components/FaceVerification";
import FingerprintVerification from "@/components/FingerprintVerification";
import CandidateSelection from "@/components/CandidateSelection";
import VoteSuccess from "@/components/VoteSuccess";
import NotFound from "@/pages/not-found";

type AppState = "login" | "dashboard" | "identification" | "face" | "fingerprint" | "vote" | "success";

interface Officer {
  id: string;
  officerId: string;
  name: string;
  boothId: string;
}

interface VoterData {
  id: string;
  voterId: string;
  name: string;
  age: number;
  address: string;
  hasVoted: boolean;
}

interface Candidate {
  id: string;
  name: string;
  partyName: string;
  partySymbol: string;
}

function MainApp() {
  const { toast } = useToast();
  const [appState, setAppState] = useState<AppState>("login");
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [currentVoter, setCurrentVoter] = useState<VoterData | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [faceScore, setFaceScore] = useState(0);
  const [fingerprintScore, setFingerprintScore] = useState(0);
  const [stats, setStats] = useState({ totalVerified: 0, pending: 0, suspicious: 0 });
  const [activity, setActivity] = useState<any[]>([]);

  const fetchDashboardData = async (boothId: string) => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch(`/api/dashboard/stats?boothId=${boothId}`),
        fetch(`/api/dashboard/activity?boothId=${boothId}`),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setActivity(activityData.activity);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  const handleLogin = async (officerId: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officerId, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Login Failed",
          description: error.error || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();
      setOfficer(data.officer);
      await fetchDashboardData(data.officer.boothId);
      setAppState("dashboard");

      toast({
        title: "Login Successful",
        description: `Welcome, ${data.officer.name}`,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setOfficer(null);
    setCurrentVoter(null);
    setSelectedCandidate(null);
    setAppState("login");
  };

  const handleStartVerification = async () => {
    if (!officer) return;

    try {
      const response = await fetch(`/api/candidates?boothId=${officer.boothId}`);
      if (response.ok) {
        const data = await response.json();
        setCandidates(data.candidates);
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    }

    setAppState("identification");
  };

  const handleVoterIdentified = async (voterId: string) => {
    if (!officer) return;

    try {
      const response = await fetch(`/api/voters/${voterId}`);

      if (!response.ok) {
        toast({
          title: "Voter Not Found",
          description: "Invalid Voter ID or voter not registered in this booth",
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();
      
      if (data.voter.hasVoted) {
        toast({
          title: "Already Voted",
          description: "This voter has already cast their vote",
          variant: "destructive",
        });

        await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "Duplicate Vote Attempt",
            voterId,
            officerId: officer.officerId,
            boothId: officer.boothId,
            details: "Voter already voted",
          }),
        });

        return;
      }

      setCurrentVoter(data.voter);
      setAppState("face");

      await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Voter Identified",
          voterId,
          officerId: officer.officerId,
          boothId: officer.boothId,
        }),
      });
    } catch (error) {
      console.error("Voter identification error:", error);
      toast({
        title: "Error",
        description: "Failed to verify voter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFaceVerified = async (matchScore: number) => {
    if (!officer || !currentVoter) return;

    setFaceScore(matchScore);
    setAppState("fingerprint");

    await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "Face Verified",
        voterId: currentVoter.voterId,
        officerId: officer.officerId,
        boothId: officer.boothId,
        details: `Match score: ${matchScore}%`,
      }),
    });
  };

  const handleFaceRejected = async () => {
    if (!officer || !currentVoter) return;

    await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "Face Verification Failed",
        voterId: currentVoter.voterId,
        officerId: officer.officerId,
        boothId: officer.boothId,
        details: "Face did not match",
      }),
    });

    toast({
      title: "Verification Failed",
      description: "Face verification failed. Voter rejected.",
      variant: "destructive",
    });

    setCurrentVoter(null);
    setAppState("dashboard");
    if (officer) await fetchDashboardData(officer.boothId);
  };

  const handleFingerprintVerified = async (matchScore: number) => {
    if (!officer || !currentVoter) return;

    setFingerprintScore(matchScore);
    setAppState("vote");

    await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "Fingerprint Verified",
        voterId: currentVoter.voterId,
        officerId: officer.officerId,
        boothId: officer.boothId,
        details: `Match score: ${matchScore}%`,
      }),
    });
  };

  const handleFingerprintRejected = async () => {
    if (!officer || !currentVoter) return;

    await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "Fingerprint Verification Failed",
        voterId: currentVoter.voterId,
        officerId: officer.officerId,
        boothId: officer.boothId,
        details: "Fingerprint did not match",
      }),
    });

    toast({
      title: "Verification Failed",
      description: "Fingerprint verification failed. Voter rejected.",
      variant: "destructive",
    });

    setCurrentVoter(null);
    setAppState("dashboard");
    if (officer) await fetchDashboardData(officer.boothId);
  };

  const handleVoteSubmitted = async (candidateId: string) => {
    if (!officer || !currentVoter) return;

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voterId: currentVoter.voterId,
          candidateId,
          officerId: officer.officerId,
          boothId: officer.boothId,
          faceMatchScore: faceScore,
          fingerprintMatchScore: fingerprintScore,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Vote Submission Failed",
          description: error.error || "Failed to submit vote",
          variant: "destructive",
        });
        return;
      }

      const candidate = candidates.find((c) => c.id === candidateId);
      setSelectedCandidate(candidate || null);
      setAppState("success");

      toast({
        title: "Vote Submitted",
        description: "Vote has been securely recorded",
      });
    } catch (error) {
      console.error("Vote submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReturnToDashboard = async () => {
    setCurrentVoter(null);
    setSelectedCandidate(null);
    setFaceScore(0);
    setFingerprintScore(0);
    setAppState("dashboard");
    if (officer) await fetchDashboardData(officer.boothId);
  };

  const handleBackToDashboard = () => {
    setCurrentVoter(null);
    setAppState("dashboard");
  };

  return (
    <Switch>
      <Route path="/">
        {appState === "login" && <OfficerLogin onLogin={handleLogin} />}
        {appState === "dashboard" && officer && (
          <OfficerDashboard
            officerName={officer.name}
            boothId={officer.boothId}
            stats={stats}
            recentActivity={activity}
            onStartVerification={handleStartVerification}
            onLogout={handleLogout}
          />
        )}
        {appState === "identification" && (
          <VoterIdentification
            onSubmit={handleVoterIdentified}
            onBack={handleBackToDashboard}
          />
        )}
        {appState === "face" && currentVoter && (
          <FaceVerification
            voter={currentVoter}
            onVerified={handleFaceVerified}
            onRejected={handleFaceRejected}
            onBack={handleBackToDashboard}
          />
        )}
        {appState === "fingerprint" && currentVoter && (
          <FingerprintVerification
            voterName={currentVoter.name}
            onVerified={handleFingerprintVerified}
            onRejected={handleFingerprintRejected}
            onBack={() => setAppState("face")}
          />
        )}
        {appState === "vote" && (
          <CandidateSelection
            candidates={candidates}
            onSubmit={handleVoteSubmitted}
            onBack={() => setAppState("fingerprint")}
          />
        )}
        {appState === "success" && currentVoter && selectedCandidate && (
          <VoteSuccess
            voterId={currentVoter.voterId}
            candidateName={`${selectedCandidate.name} - ${selectedCandidate.partyName}`}
            boothId={officer?.boothId || ""}
            timestamp={new Date().toLocaleString()}
            onReturnToDashboard={handleReturnToDashboard}
          />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MainApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
