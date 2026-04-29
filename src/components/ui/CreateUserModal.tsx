import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateUser } from '../../hooks/useUsers';
import { useSchools } from '../../hooks/useSchools';
import type { CreateUserPayload, UserRole } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultSchoolId?: number;
}

export default function CreateUserModal({ isOpen, onClose, defaultSchoolId }: Props) {
  const [form, setForm] = useState<CreateUserPayload>({
    username: '',
    password: '',
    role: defaultSchoolId ? 'admin' : 'admin',
    schoolId: defaultSchoolId,
  });
  const create = useCreateUser();
  const { data: schools } = useSchools();

  if (!isOpen) return null;

  const set = <K extends keyof CreateUserPayload>(key: K, value: CreateUserPayload[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateUserPayload = { ...form };
    if (payload.role === 'super_admin') delete payload.schoolId;
    await create.mutateAsync(payload);
    setForm({ username: '', password: '', role: 'admin', schoolId: defaultSchoolId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Create User</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username *</label>
            <input
              required
              value={form.username}
              onChange={e => set('username', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="school_admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role *</label>
            <select
              value={form.role}
              onChange={e => {
                const role = e.target.value as UserRole;
                setForm(f => ({ ...f, role, schoolId: role === 'admin' ? defaultSchoolId : undefined }));
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">School Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {form.role === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">School *</label>
              <select
                required
                value={form.schoolId ?? ''}
                onChange={e => set('schoolId', Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select school...</option>
                {schools?.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {create.isError && (
            <p className="text-sm text-red-600">{(create.error as Error).message}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={create.isPending}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {create.isPending ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
