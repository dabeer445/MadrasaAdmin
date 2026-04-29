import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
        />
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value as UserRole | ''); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All roles</option>
          <option value="admin">School Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">School</th>
              <th className="px-4 py-3 text-left">User ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr><td colSpan={4} className="py-10 text-center text-slate-400">Loading...</td></tr>
            )}
            {!isLoading && paged.length === 0 && (
              <tr><td colSpan={4} className="py-10 text-center text-slate-400">No users found.</td></tr>
            )}
            {paged.map(user => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{user.username}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    user.role === 'super_admin'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {user.role === 'super_admin' ? 'Super Admin' : 'School Admin'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {user.schoolId ? (
                    <button
                      onClick={() => navigate(`/schools/${user.schoolId}`)}
                      className="text-blue-600 hover:underline"
                    >
                      {schoolMap.get(user.schoolId) ?? `School #${user.schoolId}`}
                    </button>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{user.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end">
          {/* simple prev/next for users since we rarely have many pages */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span>{page} / {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <CreateUserModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
