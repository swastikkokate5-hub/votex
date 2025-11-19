import StatsCard from '../StatsCard';
import { CheckCircle } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
      <StatsCard title="Total Verified" value={127} icon={CheckCircle} variant="success" />
      <StatsCard title="Pending" value={23} icon={CheckCircle} variant="warning" />
    </div>
  );
}
