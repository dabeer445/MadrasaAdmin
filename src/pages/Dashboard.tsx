import { useNavigate } from 'react-router-dom';
import { School, Users, DollarSign, TrendingDown } from 'lucide-react';
import { usePlatformStats } from '../hooks/useStats';
import StatCard from '../components/ui/StatCard';

export default function Dashboard() {
  const { data: stats, isLoading } = usePlatformStats();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-28 animate-pulse bg-slate-50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Schools"
            value={stats?.totalSchools ?? 0}
            icon={School}
            color="blue"
            onClick={() => navigate('/schools')}
          />
          <StatCard
            label="Total Students"
            value={stats?.totalStudents ?? 0}
            icon={Users}
            color="green"
          />
          <StatCard
            label="Total Payments"
            value={`Rs. ${(stats?.totalPayments ?? 0).toLocaleString()}`}
            icon={DollarSign}
            color="indigo"
          />
          <StatCard
            label="Total Expenses"
            value={`Rs. ${(stats?.totalExpenses ?? 0).toLocaleString()}`}
            icon={TrendingDown}
            color="yellow"
          />
        </div>
      )}
    </div>
  );
}
