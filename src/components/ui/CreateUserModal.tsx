import { useState } from 'react';
import { Modal, Button, Input, Select, ListBox } from '@heroui/react';
import { useCreateUser } from '../../hooks/useUsers';
import { useSchools } from '../../hooks/useSchools';
import type { CreateUserPayload, UserRole } from '../../types';
import type { FormEvent } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultSchoolId?: number;
}

export default function CreateUserModal({ isOpen, onClose, defaultSchoolId }: Props) {
  const [form, setForm] = useState<CreateUserPayload>({
    username: '',
    password: '',
    role: 'admin',
    schoolId: defaultSchoolId,
  });
  const create = useCreateUser();
  const { data: schools } = useSchools();

  const set = <K extends keyof CreateUserPayload>(key: K, value: CreateUserPayload[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: CreateUserPayload = { ...form };
    if (payload.role === 'super_admin') delete payload.schoolId;
    await create.mutateAsync(payload);
    setForm({ username: '', password: '', role: 'admin', schoolId: defaultSchoolId });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Button aria-hidden excludeFromTabOrder className="sr-only" />
      <Modal.Backdrop variant="blur" isDismissable>
        <Modal.Container placement="center">
          <Modal.Dialog>
            <form onSubmit={handleSubmit}>
              <Modal.Header>
                <Modal.Heading>Create User</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>

              <Modal.Body>
                <div className="space-y-4">
                  <div>
                    <label className="field-label">Username *</label>
                    <Input fullWidth required value={form.username} onChange={e => set('username', e.target.value)} placeholder="school_admin" />
                  </div>

                  <div>
                    <label className="field-label">Password *</label>
                    <Input fullWidth required type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
                  </div>

                  <div>
                    <label className="field-label">Role *</label>
                    <Select
                      fullWidth
                      value={form.role}
                      onChange={key => {
                        const role = key as UserRole;
                        setForm(f => ({ ...f, role, schoolId: role === 'admin' ? defaultSchoolId : undefined }));
                      }}
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="admin">School Admin</ListBox.Item>
                          <ListBox.Item id="super_admin">Super Admin</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  {form.role === 'admin' && (
                    <div>
                      <label className="field-label">School *</label>
                      <Select
                        fullWidth
                        isRequired
                        placeholder="Select school…"
                        value={form.schoolId ?? null}
                        onChange={key => set('schoolId', key as number)}
                      >
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {schools?.map(s => <ListBox.Item key={s.id} id={s.id}>{s.name}</ListBox.Item>)}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                  )}

                  {create.isError && (
                    <p className="text-sm text-rose-400">{(create.error as Error).message}</p>
                  )}
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="ghost" onPress={onClose}>Cancel</Button>
                <Button variant="primary" type="submit" isDisabled={create.isPending}>
                  {create.isPending ? 'Creating…' : 'Create User'}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
