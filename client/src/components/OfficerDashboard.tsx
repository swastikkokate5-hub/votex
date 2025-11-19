import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatsCard from "./StatsCard";
import { CheckCircle, AlertTriangle, Users, LogOut, Play } from "lucide-react";

interface OfficerDashboardProps {
  officerName: string;
  boothId: string;
  stats: {
    totalVerified: number;
    pending: number;
    suspicious: number;
  };
  recentActivity: Array<{
    id: string;
    voterId: string;
    voterName: string;
    action: string;
    status: "success" | "rejected" | "suspicious";
    timestamp: string;
  }>;
  onStartVerification: () => void;
  onLogout: () => void;
}

export default function OfficerDashboard({
  officerName,
  boothId,
  stats,
  recentActivity,
  onStartVerification,
  onLogout,
}: OfficerDashboardProps) {
  const statusColors = {
    success: "bg-chart-2/10 text-chart-2",
    rejected: "bg-destructive/10 text-destructive",
    suspicious: "bg-chart-4/10 text-chart-4",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">Officer Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {officerName} • Booth {boothId}
              </p>
            </div>
            <Button variant="outline" onClick={onLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={onStartVerification}
              className="h-16 px-8 text-lg"
              data-testid="button-start-verification"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Next Voter Verification
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
              title="Total Verified"
              value={stats.totalVerified}
              icon={CheckCircle}
              variant="success"
            />
            <StatsCard
              title="Pending"
              value={stats.pending}
              icon={Users}
              variant="default"
            />
            <StatsCard
              title="Suspicious Activity"
              value={stats.suspicious}
              icon={AlertTriangle}
              variant="danger"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest voter verification attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voter ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id} data-testid={`activity-${activity.id}`}>
                      <TableCell className="font-mono text-sm">{activity.voterId}</TableCell>
                      <TableCell>{activity.voterName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{activity.action}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[activity.status]}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{activity.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
