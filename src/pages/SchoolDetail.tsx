import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useSchool, useUpdateSchool } from '../hooks/useSchools';
import { useUsers } from '../hooks/useUsers';
import StatusBadge from '../components/ui/StatusBadge';
import CreateUserModal from '../components/ui/CreateUserModal';
import { SUBSCRIPTION_STATUSES, MONTH_OPTIONS } from '../lib/constants';
import type { School, SubscriptionStatus, UpdateSchoolPayload, User } from '../types';

const TABS = ['info', 'users', 'billing'] as const;
type Tab = typeof TABS[number];

export default function SchoolDetail() {
  const { schoolId, tab } = useParams<{ schoolId: string; tab?: string }>();
  const navigate = useNavigate();
  const id = Number(schoolId);

  const activeTab: Tab = TABS.includes(tab as Tab) ? (tab as Tab) : 'info';
  const setTab = (t: Tab) => navigate(`/schools/${id}/${t}`, { replace: true });

  const { data: school, isLoading } = useSchool(id);

  if (isLoading) return <div className="p-10 text-center text-slate-400">Loading...</div>;
  if (!school) return <div className="p-10 text-center text-red-500">School not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/schools')}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{school.name}</h1>
          <p className="text-sm font-mono text-slate-500">{school.slug}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={school.subscriptionStatus} />
        </div>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === t
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'info'    && <SchoolInfoTab school={school} />}
      {activeTab === 'users'   && <SchoolUsersTab schoolId={id} />}
      {activeTab === 'billing' && <SchoolBillingTab school={school} />}
    </div>
  );
}

// ─── Info Tab ─────────────────────────────────────────────────────────────────

function SchoolInfoTab({ school }: { school: School }) {
  const [form, setForm] = useState<UpdateSchoolPayload>({
    name: school.name,
    logoUrl: school.logoUrl,
    address: school.address,
    phone: school.phone,
    adminPhones: school.adminPhones,
    monthlyDueDate: school.monthlyDueDate,
    annualFeeMonth: school.annualFeeMonth,
    annualFee: school.annualFee,
    whatsappSessionId: school.whatsappSessionId,
    whatsappToken: school.whatsappToken,
  });
  // local string for the adminPhones tag input
  const [adminPhoneInput, setAdminPhoneInput] = useState('');
  const [showWhatsappSession, setShowWhatsappSession] = useState(false);
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const update = useUpdateSchool(school.id);

  const set = <K extends keyof UpdateSchoolPayload>(key: K, value: UpdateSchoolPayload[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await update.mutateAsync(form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="grid grid-cols-2 gap-4">

        {/* Row 1: Name + Slug */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">School Name</label>
          <input
            value={form.name ?? ''}
            onChange={e => set('name', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
          <input
            value={school.slug}
            disabled
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-400 cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1">Cannot be changed after creation.</p>
        </div>

        {/* Row 2: Address (full width) */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <input
            value={form.address ?? ''}
            onChange={e => set('address', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Row 3: Phone + Logo URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            value={form.phone ?? ''}
            onChange={e => set('phone', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
          <input
            type="url"
            value={form.logoUrl ?? ''}
            onChange={e => set('logoUrl', e.target.value || null)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/logo.png"
          />
        </div>

        {/* Row 4: Fee settings */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Due Date</label>
          <input
            type="number"
            min={1}
            max={28}
            value={form.monthlyDueDate ?? 10}
            onChange={e => set('monthlyDueDate', Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Annual Fee Month</label>
          <select
            value={form.annualFeeMonth ?? '05'}
            onChange={e => set('annualFeeMonth', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {MONTH_OPTIONS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Annual Fee (PKR)</label>
          <input
            type="number"
            min={0}
            value={form.annualFee ?? 0}
            onChange={e => set('annualFee', Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Row 5: Admin Phones (full width) */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Admin Phones</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {(form.adminPhones ?? []).map((p, i) => (
              <span key={i} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-0.5 text-sm text-slate-700">
                {p}
                <button
                  type="button"
                  onClick={() => set('adminPhones', (form.adminPhones ?? []).filter((_, j) => j !== i))}
                  className="text-slate-400 hover:text-red-500 leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="tel"
              value={adminPhoneInput}
              onChange={e => setAdminPhoneInput(e.target.value)}
              onKeyDown={e => {
                if ((e.key === 'Enter' || e.key === ',') && adminPhoneInput.trim()) {
                  e.preventDefault();
                  set('adminPhones', [...(form.adminPhones ?? []), adminPhoneInput.trim()]);
                  setAdminPhoneInput('');
                }
              }}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+92300000000 — press Enter to add"
            />
            <button
              type="button"
              onClick={() => {
                if (adminPhoneInput.trim()) {
                  set('adminPhones', [...(form.adminPhones ?? []), adminPhoneInput.trim()]);
                  setAdminPhoneInput('');
                }
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Add
            </button>
          </div>
        </div>

        {/* Row 6: WhatsApp Session ID + Token */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700">WhatsApp Session ID</label>
            <button
              type="button"
              onClick={() => setShowWhatsappSession(v => !v)}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              {showWhatsappSession ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showWhatsappSession ? 'Hide' : 'Reveal'}
            </button>
          </div>
          <input
            type={showWhatsappSession ? 'text' : 'password'}
            value={form.whatsappSessionId ?? ''}
            onChange={e => set('whatsappSessionId', e.target.value || null)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700">WhatsApp Token</label>
            <button
              type="button"
              onClick={() => setShowWhatsapp(v => !v)}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              {showWhatsapp ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showWhatsapp ? 'Hide' : 'Reveal'}
            </button>
          </div>
          <input
            type={showWhatsapp ? 'text' : 'password'}
            value={form.whatsappToken ?? ''}
            onChange={e => set('whatsappToken', e.target.value || null)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        {/* Footer */}
        <div className="col-span-2 flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={update.isPending}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {update.isPending ? 'Saving...' : 'Save changes'}
          </button>
          {update.isSuccess && <p className="text-sm text-green-600">Changes saved.</p>}
          {update.isError && <p className="text-sm text-red-600">{(update.error as Error).message}</p>}
        </div>

      </div>
    </form>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function SchoolUsersTab({ schoolId }: { schoolId: number }) {
  const { data: allUsers, isLoading } = useUsers();
  const [showCreate, setShowCreate] = useState(false);

  const users = allUsers?.filter(u => u.schoolId === schoolId) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{users.length} user{users.length !== 1 ? 's' : ''}</p>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">User ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr><td colSpan={3} className="py-8 text-center text-slate-400">Loading...</td></tr>
            )}
            {!isLoading && users.length === 0 && (
              <tr><td colSpan={3} className="py-8 text-center text-slate-400">No users for this school.</td></tr>
            )}
            {users.map((user: User) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{user.username}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{user.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateUserModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        defaultSchoolId={schoolId}
      />
    </div>
  );
}

// ─── Billing Tab ──────────────────────────────────────────────────────────────

function SchoolBillingTab({ school }: { school: School }) {
  const [status, setStatus] = useState<SubscriptionStatus>(school.subscriptionStatus);
  const [expiresAt, setExpiresAt] = useState<string>(
    school.subscriptionExpiresAt
      ? new Date(school.subscriptionExpiresAt * 1000).toISOString().split('T')[0]
      : ''
  );
  const update = useUpdateSchool(school.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await update.mutateAsync({
      subscriptionStatus: status,
      subscriptionExpiresAt: expiresAt ? Math.floor(new Date(expiresAt).getTime() / 1000) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Subscription Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value as SubscriptionStatus)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SUBSCRIPTION_STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Subscription Expiry
        </label>
        <input
          type="date"
          value={expiresAt}
          onChange={e => setExpiresAt(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-slate-400 mt-1">Leave empty to set no hard expiry.</p>
      </div>

      {update.isSuccess && (
        <p className="text-sm text-green-600">Subscription updated.</p>
      )}
      {update.isError && (
        <p className="text-sm text-red-600">{(update.error as Error).message}</p>
      )}

      <button
        type="submit"
        disabled={update.isPending}
        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {update.isPending ? 'Saving...' : 'Update subscription'}
      </button>
    </form>
  );
}
