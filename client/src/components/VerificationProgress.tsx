import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  status: "completed" | "current" | "pending";
}

interface VerificationProgressProps {
  steps: Step[];
}

export default function VerificationProgress({ steps }: VerificationProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                  step.status === "completed" && "bg-primary text-primary-foreground",
                  step.status === "current" && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  step.status === "pending" && "bg-muted text-muted-foreground"
                )}
                data-testid={`step-${index + 1}`}
              >
                {step.status === "completed" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <p className={cn(
                "mt-2 text-xs font-medium text-center",
                step.status === "current" ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mt-[-24px]",
                  steps[index + 1].status !== "pending" ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
