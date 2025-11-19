import OfficerDashboard from '../OfficerDashboard';

export default function OfficerDashboardExample() {
  // todo: remove mock functionality
  const mockStats = {
    totalVerified: 127,
    pending: 23,
    suspicious: 2,
  };

  // todo: remove mock functionality
  const mockActivity = [
    {
      id: "1",
      voterId: "VOT123456",
      voterName: "Rajesh Kumar",
      action: "Vote Submitted",
      status: "success" as const,
      timestamp: "10:23 AM",
    },
    {
      id: "2",
      voterId: "VOT789012",
      voterName: "Priya Sharma",
      action: "Face Verification Failed",
      status: "rejected" as const,
      timestamp: "10:18 AM",
    },
    {
      id: "3",
      voterId: "VOT345678",
      voterName: "Amit Patel",
      action: "Multiple Attempts",
      status: "suspicious" as const,
      timestamp: "10:12 AM",
    },
  ];

  return (
    <OfficerDashboard
      officerName="Officer Ramesh Singh"
      boothId="BH-042"
      stats={mockStats}
      recentActivity={mockActivity}
      onStartVerification={() => console.log('Start verification clicked')}
      onLogout={() => console.log('Logout clicked')}
    />
  );
}
