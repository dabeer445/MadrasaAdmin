import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Button, Table, Skeleton } from '@heroui/react';
import { useSchools } from '../hooks/useSchools';
import StatusBadge from '../components/ui/StatusBadge';
import PaginationControl from '../components/ui/Pagination';
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

  const handleFilterChange = (fn: () => void) => { fn(); setPage(1); };

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Schools</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isLoading ? '—' : `${filtered.length} ${status || 'total'}`}
          </p>
        </div>
        <Button variant="primary" onPress={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" />
          Add School
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search schools…"
            value={search}
            onChange={e => handleFilterChange(() => setSearch(e.target.value))}
            className="field pl-9 w-56"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          <select
            value={status}
            onChange={e => handleFilterChange(() => setStatus(e.target.value as SubscriptionStatus | ''))}
            className="field pl-9 pr-8 appearance-none cursor-pointer w-44"
          >
            <option value="">All statuses</option>
            {SUBSCRIPTION_STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        {(search || status) && (
          <Button variant="ghost" onPress={() => handleFilterChange(() => { setSearch(''); setStatus(''); })}>
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <Table variant="secondary">
        <Table.Content
          aria-label="Schools"
          selectionMode="none"
          onRowAction={(key) => navigate(`/schools/${key}`)}
          className="w-full text-sm"
        >
            <Table.Header>
              <Table.Column isRowHeader>School</Table.Column>
              <Table.Column>Slug</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Expires</Table.Column>
              <Table.Column>Annual Fee</Table.Column>
              <Table.Column> </Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="py-16 text-center text-zinc-600 text-sm">No schools found</div>
              )}
            >
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <Table.Row key={`sk-${i}`} id={`sk-${i}`}>
                      {[140, 80, 70, 80, 80, 30].map((w, j) => (
                        <Table.Cell key={j}>
                          <Skeleton className="h-4 rounded" style={{ width: w }} />
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))
                : paged.map(school => (
                    <Table.Row key={school.id} id={String(school.id)} className="cursor-pointer">
                      <Table.Cell>
                        <span className="font-medium text-zinc-100">{school.name}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-mono text-xs text-zinc-500">{school.slug}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge status={school.subscriptionStatus} />
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-zinc-500 text-xs">
                          {school.subscriptionExpiresAt
                            ? new Date(school.subscriptionExpiresAt * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                            : <span className="text-zinc-600 italic">No expiry</span>
                          }
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-mono text-xs text-zinc-400">Rs {school.annualFee.toLocaleString()}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-xs text-amber-500/70">→</span>
                      </Table.Cell>
                    </Table.Row>
                  ))
              }
            </Table.Body>
          </Table.Content>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-end">
          <PaginationControl currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <CreateSchoolModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
