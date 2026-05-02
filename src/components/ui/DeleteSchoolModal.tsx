import { useState } from 'react';
import { AlertDialog, Button, Input } from '@heroui/react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  schoolName: string;
  schoolSlug: string;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteSchoolModal({ isOpen, schoolName, schoolSlug, isPending, onConfirm, onClose }: Props) {
  const [input, setInput] = useState('');
  const matches = input === schoolSlug;

  const handleClose = () => {
    setInput('');
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <Button aria-hidden excludeFromTabOrder className="sr-only" />
      <AlertDialog.Backdrop variant="blur" isDismissable={false} isKeyboardDismissDisabled>
        <AlertDialog.Container placement="center">
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger">
                <AlertTriangle className="w-5 h-5" />
              </AlertDialog.Icon>
              <AlertDialog.Heading>Delete {schoolName}?</AlertDialog.Heading>
              <AlertDialog.CloseTrigger />
            </AlertDialog.Header>

            <AlertDialog.Body>
              <div className="space-y-4 text-sm">
                <p className="text-zinc-300">
                  Users belonging to this school will be{' '}
                  <span className="text-rose-400 font-medium">locked out immediately</span>.
                  All data (students, payments, teachers) will be permanently deleted after 30 days.
                </p>
                <p className="text-xs text-zinc-500">
                  This action cannot be undone through the app. Recovery within the 30-day window requires direct database intervention.
                </p>
                <div>
                  <label className="field-label">
                    Type <span className="font-mono normal-case tracking-normal text-zinc-300">{schoolSlug}</span> to confirm
                  </label>
                  <Input
                    fullWidth
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={schoolSlug}
                    className="font-mono"
                    autoComplete="off"
                  />
                </div>
              </div>
            </AlertDialog.Body>

            <AlertDialog.Footer>
              <Button variant="ghost" onPress={handleClose}>Cancel</Button>
              <Button variant="danger" onPress={onConfirm} isDisabled={!matches || isPending}>
                {isPending ? 'Deleting…' : 'Delete'}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
