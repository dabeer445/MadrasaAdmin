import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateSchool } from '../../hooks/useSchools';
import { SUBSCRIPTION_STATUSES, MONTH_OPTIONS } from '../../lib/constants';
import type { CreateSchoolPayload } from '../../types';


interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_FORM: CreateSchoolPayload = {
  slug: '',
  name: '',
  address: '',
  phone: '',
  monthlyDueDate: 10,
  annualFeeMonth: '05',
  annualFee: 0,
  subscriptionStatus: 'trial',
};

export default function CreateSchoolModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreateSchoolPayload>(DEFAULT_FORM);
  const [adminPhoneInput, setAdminPhoneInput] = useState('');
  const create = useCreateSchool();

  if (!isOpen) return null;

  const set = <K extends keyof CreateSchoolPayload>(key: K, value: CreateSchoolPayload[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create.mutateAsync(form);
    setForm(DEFAULT_FORM);
    setAdminPhoneInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Add School</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">School Name *</label>
              <input
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Madrassa Darul Uloom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
              <input
                required
                value={form.slug}
                onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="darul-uloom"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input
              value={form.address ?? ''}
              onChange={e => set('address', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main St, Lahore"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              value={form.phone ?? ''}
              onChange={e => set('phone', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+92300000000"
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

          <div>
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Due Date *</label>
              <input
                required
                type="number"
                min={1}
                max={28}
                value={form.monthlyDueDate}
                onChange={e => set('monthlyDueDate', Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Annual Fee Month *</label>
              <select
                value={form.annualFeeMonth}
                onChange={e => set('annualFeeMonth', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MONTH_OPTIONS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Annual Fee (PKR) *</label>
              <input
                required
                type="number"
                min={0}
                value={form.annualFee}
                onChange={e => set('annualFee', Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Session ID</label>
              <input
                value={form.whatsappSessionId ?? ''}
                onChange={e => set('whatsappSessionId', e.target.value || null)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sess_abc"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Token</label>
              <input
                value={form.whatsappToken ?? ''}
                onChange={e => set('whatsappToken', e.target.value || null)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tok_xyz"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subscription Status *</label>
            <select
              value={form.subscriptionStatus}
              onChange={e => set('subscriptionStatus', e.target.value as CreateSchoolPayload['subscriptionStatus'])}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SUBSCRIPTION_STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

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
              {create.isPending ? 'Creating...' : 'Create School'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
