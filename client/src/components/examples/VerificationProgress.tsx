import VerificationProgress from '../VerificationProgress';

export default function VerificationProgressExample() {
  const steps = [
    { label: "Officer Login", status: "completed" as const },
    { label: "Voter ID", status: "completed" as const },
    { label: "Face Verify", status: "current" as const },
    { label: "Fingerprint", status: "pending" as const },
    { label: "Vote", status: "pending" as const },
  ];

  return <VerificationProgress steps={steps} />;
}
