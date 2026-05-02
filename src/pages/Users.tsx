import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button, Table, Skeleton, Chip } from '@heroui/react';
import { useUsers } from '../hooks/useUsers';
import { useSchools } from '../hooks/useSchools';
import CreateUserModal from '../components/ui/CreateUserModal';
import type { UserRole } from '../types';

const PAGE_SIZE = 20;

export default function Users() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);

  const { data: users, isLoading } = useUsers();
  const { data: schools } = useSchools();

  const schoolMap = useMemo(() => {
    const m = new Map<number, string>();
    schools?.forEach(s => m.set(s.id, s.name));
    return m;
  }, [schools]);

  const filtered = useMemo(() => {
    if (!users) return [];
    return users.filter(u => {
      const matchSearch = !search || u.username.toLowerCase().includes(search.toLowerCase());
      const matchRole = !roleFilter || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isLoading ? '—' : `${filtered.length} ${roleFilter ? roleFilter.replace('_', ' ') : 'total'}`}
          </p>
        </div>
        <Button variant="primary" onPress={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="field pl-9 w-56"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value as UserRole | ''); setPage(1); }}
          className="field w-44"
        >
          <option value="">All roles</option>
          <option value="admin">School Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        {(search || roleFilter) && (
          <Button variant="ghost" onPress={() => { setSearch(''); setRoleFilter(''); setPage(1); }}>
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <Table variant="secondary">
        <Table.Content aria-label="Users" selectionMode="none" className="w-full text-sm">
            <Table.Header>
              <Table.Column isRowHeader>Username</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>School</Table.Column>
              <Table.Column>ID</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="py-16 text-center text-zinc-600 text-sm">No users found</div>
              )}
            >
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <Table.Row key={`sk-${i}`} id={`sk-${i}`}>
                      {[120, 100, 120, 100].map((w, j) => (
                        <Table.Cell key={j}>
                          <Skeleton className="h-4 rounded" style={{ width: w }} />
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))
                : paged.map(user => (
                    <Table.Row key={user.id} id={user.id}>
                      <Table.Cell>
                        <span className="font-medium text-zinc-100">{user.username}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <Chip
                          color={user.role === 'super_admin' ? 'warning' : 'default'}
                          variant="soft"
                          size="sm"
                        >
                          {user.role === 'super_admin' ? 'Super Admin' : 'School Admin'}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        {user.schoolId ? (
                          <button
                            onClick={() => navigate(`/schools/${user.schoolId}`)}
                            className="text-amber-500/70 hover:text-amber-400 text-xs transition-colors"
                          >
                            {schoolMap.get(user.schoolId) ?? `School #${user.schoolId}`}
                          </button>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-mono text-[11px] text-zinc-600">{user.id}</span>
                      </Table.Cell>
                    </Table.Row>
                  ))
              }
            </Table.Body>
          </Table.Content>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 text-sm">
          <span className="text-zinc-600">{page} / {totalPages}</span>
          <Button variant="secondary" size="sm" isDisabled={page === 1} onPress={() => setPage(p => p - 1)}>Previous</Button>
          <Button variant="secondary" size="sm" isDisabled={page === totalPages} onPress={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}

      <CreateUserModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
