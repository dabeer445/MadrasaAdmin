import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, Users, DollarSign, TrendingDown, Plus } from 'lucide-react';
import { Button, Card, Skeleton } from '@heroui/react';
import { usePlatformStats } from '../hooks/useStats';
import { formatRs } from '../lib/format';
import StatCard from '../components/ui/StatCard';
import CreateSchoolModal from '../components/ui/CreateSchoolModal';
import CreateUserModal from '../components/ui/CreateUserModal';

export default function Dashboard() {
  const { data: stats, isLoading } = usePlatformStats();
  const navigate = useNavigate();
  const [showCreateSchool, setShowCreateSchool] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);

  return (
    <div className="space-y-8 fade-up">
      <div>
        <h1 className="page-title">Platform Overview</h1>
        <p className="text-sm text-zinc-500 mt-1">Live metrics across all tenant schools</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} className="card h-28 rounded-xl" />
          ))
        ) : (
          <>
            <div className="fade-up fade-up-1">
              <StatCard label="Total Schools" value={stats?.totalSchools ?? 0} icon={School} color="blue" onClick={() => navigate('/schools')} />
            </div>
            <div className="fade-up fade-up-2">
              <StatCard label="Total Students" value={stats?.totalStudents ?? 0} icon={Users} color="green" />
            </div>
            <div className="fade-up fade-up-3">
              <StatCard label="Total Payments" value={formatRs(stats?.totalPaymentsAmount ?? 0)} sub={`${(stats?.totalPayments ?? 0).toLocaleString()} transactions`} icon={DollarSign} color="indigo" />
            </div>
            <div className="fade-up fade-up-4">
              <StatCard label="Total Expenses" value={formatRs(stats?.totalExpensesAmount ?? 0)} sub={`${(stats?.totalExpenses ?? 0).toLocaleString()} records`} icon={TrendingDown} color="yellow" />
            </div>
          </>
        )}
      </div>

      {!isLoading && (
        <div className="fade-up fade-up-4">
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Quick actions</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm" onPress={() => setShowCreateSchool(true)}>
                <Plus className="w-3.5 h-3.5" />
                Add School
              </Button>
              <Button variant="primary" size="sm" onPress={() => setShowCreateUser(true)}>
                <Plus className="w-3.5 h-3.5" />
                Add User
              </Button>
              <Button variant="secondary" size="sm" onPress={() => navigate('/schools')}>
                <School className="w-3.5 h-3.5" />
                Manage Schools
              </Button>
              <Button variant="secondary" size="sm" onPress={() => navigate('/users')}>
                <Users className="w-3.5 h-3.5" />
                Manage Users
              </Button>
            </div>
          </Card>
        </div>
      )}

      <CreateSchoolModal isOpen={showCreateSchool} onClose={() => setShowCreateSchool(false)} />
      <CreateUserModal isOpen={showCreateUser} onClose={() => setShowCreateUser(false)} />
    </div>
  );
}
