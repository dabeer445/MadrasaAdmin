import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Plus, Pencil } from 'lucide-react';
import { Button, Card, Tabs, Spinner, Skeleton, Chip, Table } from '@heroui/react';
import { useSchool, useUpdateSchool, useUploadLogo, useDeleteSchool } from '../hooks/useSchools';
import { useUsers } from '../hooks/useUsers';
import StatusBadge from '../components/ui/StatusBadge';
import CreateUserModal from '../components/ui/CreateUserModal';
import DeleteSchoolModal from '../components/ui/DeleteSchoolModal';
import { toastQueue } from '../lib/toast';
import { SUBSCRIPTION_STATUSES, MONTH_OPTIONS } from '../lib/constants';
import type { School, SubscriptionStatus, UpdateSchoolPayload, User } from '../types';
import type { FormEvent } from 'react';

const TABS = ['info', 'users', 'billing'] as const;
type Tab = typeof TABS[number];

export default function SchoolDetail() {
  const { schoolId, tab } = useParams<{ schoolId: string; tab?: string }>();
  const navigate = useNavigate();
  const id = Number(schoolId);

  const activeTab: Tab = TABS.includes(tab as Tab) ? (tab as Tab) : 'info';
  const setTab = (t: Tab) => navigate(`/schools/${id}/${t}`, { replace: true });

  const { data: school, isLoading } = useSchool(id);

  if (isLoading) return (
    <div className="space-y-6 fade-up">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <Skeleton className="h-4 w-64 rounded" />
      <Skeleton className="card h-64 rounded-xl" />
    </div>
  );
  if (!school) return (
    <div className="p-10 text-center text-zinc-600">School not found.</div>
  );

  return (
    <div className="space-y-6 fade-up">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/schools')}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Schools
        </button>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {school.logoUrl
              ? <img src={school.logoUrl} alt={school.name} className="h-10 w-10 rounded object-contain border border-zinc-700 shrink-0" />
              : <div className="h-10 w-10 rounded border border-zinc-700 bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-400 font-semibold text-sm">{school.name.charAt(0).toUpperCase()}</div>
            }
            <div>
              <h1 className="page-title">{school.name}</h1>
              <p className="font-mono text-xs text-zinc-500 mt-1">{school.slug}</p>
            </div>
          </div>
          <StatusBadge status={school.subscriptionStatus} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs selectedKey={activeTab} onSelectionChange={(key) => setTab(key as Tab)} variant="secondary">
        <Tabs.List>
          <Tabs.Tab id="info">Info</Tabs.Tab>
          <Tabs.Tab id="users">Users</Tabs.Tab>
          <Tabs.Tab id="billing">Billing</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="info" className="px-0"><SchoolInfoTab school={school} /></Tabs.Panel>
        <Tabs.Panel id="users" className="px-0"><SchoolUsersTab schoolId={id} /></Tabs.Panel>
        <Tabs.Panel id="billing" className="px-0"><SchoolBillingTab school={school} /></Tabs.Panel>
      </Tabs>
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
  const [adminPhoneInput, setAdminPhoneInput] = useState('');
  const [showWhatsappSession, setShowWhatsappSession] = useState(false);
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const update = useUpdateSchool(school.id);
  const uploadLogo = useUploadLogo();
  const deleteSchool = useDeleteSchool();
  const navigate = useNavigate();

  const set = <K extends keyof UpdateSchoolPayload>(key: K, value: UpdateSchoolPayload[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let updatedForm = form;
    if (logoFile) {
      const logoUrl = await uploadLogo.mutateAsync(logoFile);
      updatedForm = { ...form, logoUrl };
    }
    const payload = Object.fromEntries(
      Object.entries(updatedForm).filter(([, v]) => v !== null && v !== undefined)
    ) as UpdateSchoolPayload;
    await update.mutateAsync(payload);
  };

  const isPending = uploadLogo.isPending || update.isPending;

  const addPhone = () => {
    if (adminPhoneInput.trim()) {
      set('adminPhones', [...(form.adminPhones ?? []), adminPhoneInput.trim()]);
      setAdminPhoneInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Basic info */}
        <Card className="p-5 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Basic Info</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="field-label">School Name</label>
              <input value={form.name ?? ''} onChange={e => set('name', e.target.value)} className="field" />
            </div>
            <div className="col-span-2">
              <label className="field-label">Address</label>
              <input value={form.address ?? ''} onChange={e => set('address', e.target.value)} className="field" />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} className="field" />
            </div>
            <div>
              <label className="field-label">Logo</label>
              <div className="flex items-center gap-3">
                {(logoPreview ?? form.logoUrl)
                  ? <img src={logoPreview ?? form.logoUrl!} alt="logo" className="h-10 w-10 rounded object-contain border border-zinc-700 shrink-0" />
                  : <div className="h-10 w-10 rounded border border-zinc-700 bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-400 font-semibold text-sm">{school.name.charAt(0).toUpperCase()}</div>
                }
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 border border-zinc-700 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  {(logoPreview ?? form.logoUrl) ? 'Change' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Fee settings */}
        <Card className="p-5 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Fee Settings</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Monthly Due Date</label>
                <input type="number" min={1} max={28} value={form.monthlyDueDate ?? 10} onChange={e => set('monthlyDueDate', Number(e.target.value))} className="field" />
              </div>
              <div>
                <label className="field-label">Annual Fee Month</label>
                <div className="relative">
                  <select value={form.annualFeeMonth ?? '05'} onChange={e => set('annualFeeMonth', e.target.value)} className="field pr-8 cursor-pointer">
                    {MONTH_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="field-label">Annual Fee (PKR)</label>
              <input type="number" min={0} value={form.annualFee ?? 0} onChange={e => set('annualFee', Number(e.target.value))} className="field" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Admin phones */}
        <Card className="p-5 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Admin Phones</p>
          <div className="flex flex-wrap gap-2">
            {(form.adminPhones ?? []).map((p, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-600"
              >
                {p}
                <button
                  type="button"
                  onClick={() => set('adminPhones', (form.adminPhones ?? []).filter((_, j) => j !== i))}
                  className="ml-0.5 text-zinc-500 hover:text-rose-400 transition-colors"
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
              onKeyDown={e => { if ((e.key === 'Enter' || e.key === ',') && adminPhoneInput.trim()) { e.preventDefault(); addPhone(); } }}
              className="field flex-1"
              placeholder="+92300000000 — Enter to add"
            />
            <button type="button" onClick={addPhone} className="shrink-0 px-4 py-2 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-600 rounded-lg transition-colors">Add</button>
          </div>
        </Card>

        {/* WhatsApp */}
        <Card className="p-5 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">WhatsApp</p>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="field-label mb-0">Session ID</label>
                <Button type="button" variant="ghost" size="sm" onPress={() => setShowWhatsappSession(v => !v)} className="text-[11px] h-auto p-0 gap-1">
                  {showWhatsappSession ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showWhatsappSession ? 'Hide' : 'Reveal'}
                </Button>
              </div>
              <input type={showWhatsappSession ? 'text' : 'password'} value={form.whatsappSessionId ?? ''} onChange={e => set('whatsappSessionId', e.target.value || null)} className="field font-mono" placeholder="••••••••" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="field-label mb-0">Token</label>
                <Button type="button" variant="ghost" size="sm" onPress={() => setShowWhatsapp(v => !v)} className="text-[11px] h-auto p-0 gap-1">
                  {showWhatsapp ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showWhatsapp ? 'Hide' : 'Reveal'}
                </Button>
              </div>
              <input type={showWhatsapp ? 'text' : 'password'} value={form.whatsappToken ?? ''} onChange={e => set('whatsappToken', e.target.value || null)} className="field font-mono" placeholder="••••••••" />
            </div>
          </div>
        </Card>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary" isDisabled={isPending}>
          {uploadLogo.isPending ? <><Spinner size="sm" /> Uploading…</> : isPending ? <><Spinner size="sm" /> Saving…</> : 'Save changes'}
        </Button>
        {update.isSuccess && !isPending && <p className="text-sm text-emerald-400">Saved.</p>}
        {uploadLogo.isError && <p className="text-sm text-rose-400">Upload failed: {(uploadLogo.error as Error).message}</p>}
        {update.isError && <p className="text-sm text-rose-400">{(update.error as Error).message}</p>}
      </div>

      {/* Danger zone */}
      <div className="border border-rose-900/50 rounded-xl p-5 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-rose-500/70">Danger Zone</p>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-200">Delete this school</p>
            <p className="text-xs text-zinc-500 mt-0.5">Permanently removes the school and all associated data. This cannot be undone.</p>
          </div>
          <Button type="button" variant="danger" size="sm" onPress={() => setShowDeleteConfirm(true)}>
            Delete
          </Button>
        </div>
      </div>

      <DeleteSchoolModal
        isOpen={showDeleteConfirm}
        schoolName={school.name}
        schoolSlug={school.slug}
        isPending={deleteSchool.isPending}
        onConfirm={async () => {
          await deleteSchool.mutateAsync(school.id);
          toastQueue.add({ title: `${school.name} has been deleted`, variant: 'danger' });
          navigate('/schools');
        }}
        onClose={() => setShowDeleteConfirm(false)}
      />
    </form>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function SchoolUsersTab({ schoolId }: { schoolId: number }) {
  const { data: allUsers, isLoading } = useUsers();
  const [showCreate, setShowCreate] = useState(false);

  const users = allUsers?.filter(u => u.schoolId === schoolId) ?? [];

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">{users.length} user{users.length !== 1 ? 's' : ''}</p>
        <Button variant="primary" size="sm" onPress={() => setShowCreate(true)}>
          <Plus className="w-3.5 h-3.5" />
          Add User
        </Button>
      </div>

      <Table variant="secondary">
        <Table.Content aria-label="School users" selectionMode="none" className="w-full text-sm">
          <Table.Header>
            <Table.Column isRowHeader>Username</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>ID</Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="py-12 text-center text-zinc-600 text-sm">
                {isLoading ? 'Loading…' : 'No users for this school'}
              </div>
            )}
          >
            {users.map((user: User) => (
              <Table.Row key={user.id} id={user.id}>
                <Table.Cell>
                  <span className="font-medium text-zinc-100">{user.username}</span>
                </Table.Cell>
                <Table.Cell>
                  <Chip color={user.role === 'super_admin' ? 'warning' : 'default'} variant="soft" size="sm">
                    {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-mono text-[11px] text-zinc-600">{user.id}</span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>

      <CreateUserModal isOpen={showCreate} onClose={() => setShowCreate(false)} defaultSchoolId={schoolId} />
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await update.mutateAsync({
      subscriptionStatus: status,
      ...(expiresAt ? { subscriptionExpiresAt: Math.floor(new Date(expiresAt).getTime() / 1000) } : {}),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-6">
      <Card className="p-5 space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Subscription</p>
        <div>
          <label className="field-label">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value as SubscriptionStatus)} className="field">
            {SUBSCRIPTION_STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Expiry Date</label>
          <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="field" />
          <p className="text-[11px] text-zinc-600 mt-1">Leave empty for no hard expiry</p>
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary" isDisabled={update.isPending}>
          {update.isPending ? <><Spinner size="sm" /> Saving…</> : 'Update subscription'}
        </Button>
        {update.isSuccess && <p className="text-sm text-emerald-400">Updated.</p>}
        {update.isError && <p className="text-sm text-rose-400">{(update.error as Error).message}</p>}
      </div>
    </form>
  );
}
