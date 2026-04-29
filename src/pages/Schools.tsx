import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useSchools } from '../hooks/useSchools';
import StatusBadge from '../components/ui/StatusBadge';
import Pagination from '../components/ui/Pagination';
import CreateSchoolModal from '../components/ui/CreateSchoolModal';
import { SUBSCRIPTION_STATUSES } from '../lib/constants';
import type { SubscriptionStatus } from '../types';

const PAGE_SIZE = 20;

export default function Schools() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<SubscriptionStatus | ''>('');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);

  const { data: schools, isLoading } = useSchools();

  const filtered = useMemo(() => {
    if (!schools) return [];
    return schools.filter(s => {
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.slug.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !status || s.subscriptionStatus === status;
      return matchSearch && matchStatus;
    });
  }, [schools, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Schools</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add School
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or slug..."
          value={search}
          onChange={e => handleFilterChange(() => setSearch(e.target.value))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
        />
        <select
          value={status}
          onChange={e => handleFilterChange(() => setStatus(e.target.value as SubscriptionStatus | ''))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All statuses</option>
          {SUBSCRIPTION_STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        {(search || status) && (
          <button
            onClick={() => handleFilterChange(() => { setSearch(''); setStatus(''); })}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">School</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Expires</th>
              <th className="px-4 py-3 text-right">Annual Fee</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">Loading...</td>
              </tr>
            )}
            {!isLoading && paged.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">No schools found.</td>
              </tr>
            )}
            {paged.map(school => (
              <tr
                key={school.id}
                className="cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => navigate(`/schools/${school.id}`)}
              >
                <td className="px-4 py-3 font-medium text-slate-900">{school.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{school.slug}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={school.subscriptionStatus} />
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {school.subscriptionExpiresAt
                    ? new Date(school.subscriptionExpiresAt * 1000).toLocaleDateString()
                    : <span className="text-slate-400 italic">No expiry</span>
                  }
                </td>
                <td className="px-4 py-3 text-right text-slate-700">
                  Rs. {school.annualFee.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/schools/${school.id}`); }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Manage →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <CreateSchoolModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
