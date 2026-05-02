import { useState, useRef } from 'react';
import { Modal, Button, Input, Select, ListBox } from '@heroui/react';
import { useCreateSchool, useUploadLogo } from '../../hooks/useSchools';
import { SUBSCRIPTION_STATUSES, MONTH_OPTIONS } from '../../lib/constants';
import type { CreateSchoolPayload } from '../../types';
import type { FormEvent } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_FORM: CreateSchoolPayload = {
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const create = useCreateSchool();
  const uploadLogo = useUploadLogo();

  const set = <K extends keyof CreateSchoolPayload>(key: K, value: CreateSchoolPayload[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const addPhone = () => {
    if (adminPhoneInput.trim()) {
      set('adminPhones', [...(form.adminPhones ?? []), adminPhoneInput.trim()]);
      setAdminPhoneInput('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let logoUrl: string | undefined;
    if (logoFile) {
      logoUrl = await uploadLogo.mutateAsync(logoFile);
    }
    const slug = form.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await create.mutateAsync({ ...form, slug, ...(logoUrl ? { logoUrl } : {}) });
    setForm(DEFAULT_FORM);
    setAdminPhoneInput('');
    setLogoFile(null);
    setLogoPreview(null);
    onClose();
  };

  const isPending = uploadLogo.isPending || create.isPending;
  const uploadError = uploadLogo.isError ? (uploadLogo.error as Error).message : null;

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      {/* Hidden pressable child required by DialogTrigger's PressResponder */}
      <Button aria-hidden excludeFromTabOrder className="sr-only" />
      <Modal.Backdrop variant="blur" isDismissable>
        <Modal.Container size="lg" placement="center" scroll="outside">
          <Modal.Dialog>
            <form onSubmit={handleSubmit}>
              <Modal.Header>
                <Modal.Heading>Add School</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>

              <Modal.Body>
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="field-label">School Name *</label>
                    <Input fullWidth required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Madrassa Darul Uloom" />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="field-label">Address</label>
                    <Input fullWidth value={form.address ?? ''} onChange={e => set('address', e.target.value)} placeholder="123 Main St, Lahore" />
                  </div>

                  {/* Phone + Logo */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="field-label">Phone</label>
                      <Input fullWidth value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} placeholder="+92300000000" />
                    </div>
                    <div>
                      <label className="field-label">Logo</label>
                      <div className="flex items-center gap-3">
                        {logoPreview && (
                          <img src={logoPreview} alt="preview" className="h-9 w-9 rounded object-contain border border-zinc-700 shrink-0" />
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-zinc-700 file:text-zinc-200 hover:file:bg-zinc-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Admin Phones */}
                  <div>
                    <label className="field-label">Admin Phones</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(form.adminPhones ?? []).map((p, i) => (
                        <span key={i} className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-0.5 text-xs text-zinc-300 font-mono">
                          {p}
                          <Button type="button" variant="ghost" size="sm" onPress={() => set('adminPhones', (form.adminPhones ?? []).filter((_, j) => j !== i))} className="text-zinc-500 hover:text-rose-400 min-w-0 h-auto p-0 leading-none">×</Button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input fullWidth type="tel" value={adminPhoneInput} onChange={e => setAdminPhoneInput(e.target.value)} onKeyDown={e => { if ((e.key === 'Enter' || e.key === ',') && adminPhoneInput.trim()) { e.preventDefault(); addPhone(); } }} placeholder="+92300000000 — Enter to add" />
                      <Button type="button" variant="secondary" onPress={addPhone} className="text-xs px-3">Add</Button>
                    </div>
                  </div>

                  {/* Fee Settings */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="field-label">Due Date *</label>
                      <Input fullWidth required type="number" min={1} max={28} value={form.monthlyDueDate} onChange={e => set('monthlyDueDate', Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="field-label">Fee Month *</label>
                      <Select fullWidth value={form.annualFeeMonth} onChange={key => set('annualFeeMonth', key as string)}>
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {MONTH_OPTIONS.map(m => <ListBox.Item key={m.value} id={m.value}>{m.label}</ListBox.Item>)}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                    <div>
                      <label className="field-label">Annual Fee *</label>
                      <Input fullWidth required type="number" min={0} value={form.annualFee} onChange={e => set('annualFee', Number(e.target.value))} />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="field-label">WhatsApp Session ID</label>
                      <Input fullWidth value={form.whatsappSessionId ?? ''} onChange={e => set('whatsappSessionId', e.target.value || null)} className="font-mono" placeholder="sess_abc" />
                    </div>
                    <div>
                      <label className="field-label">WhatsApp Token</label>
                      <Input fullWidth value={form.whatsappToken ?? ''} onChange={e => set('whatsappToken', e.target.value || null)} className="font-mono" placeholder="tok_xyz" />
                    </div>
                  </div>

                  {/* Subscription Status */}
                  <div>
                    <label className="field-label">Subscription Status *</label>
                    <Select fullWidth value={form.subscriptionStatus} onChange={key => set('subscriptionStatus', key as CreateSchoolPayload['subscriptionStatus'])}>
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {SUBSCRIPTION_STATUSES.map(s => <ListBox.Item key={s} id={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</ListBox.Item>)}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  {uploadError && (
                    <p className="text-sm text-rose-400">Upload failed: {uploadError}</p>
                  )}
                  {create.isError && (
                    <p className="text-sm text-rose-400">{(create.error as Error).message}</p>
                  )}
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="ghost" onPress={onClose}>Cancel</Button>
                <Button variant="primary" type="submit" isDisabled={isPending}>
                  {uploadLogo.isPending ? 'Uploading…' : isPending ? 'Creating…' : 'Create School'}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
