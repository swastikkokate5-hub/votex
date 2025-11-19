import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
}

export default function StatsCard({ title, value, icon: Icon, variant = "default" }: StatsCardProps) {
  const variantColors = {
    default: "text-primary",
    success: "text-chart-2",
    warning: "text-chart-4",
    danger: "text-destructive",
  };

  return (
    <Card data-testid={`stats-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <div className={`p-3 rounded-md bg-muted ${variantColors[variant]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
