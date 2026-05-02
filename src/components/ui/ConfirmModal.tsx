import { AlertDialog, Button } from '@heroui/react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  isPending?: boolean;
}

export default function ConfirmModal({
  isOpen, title, message, confirmLabel = 'Confirm',
  onConfirm, onClose, isPending,
}: ConfirmModalProps) {
  return (
    <AlertDialog isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Button aria-hidden excludeFromTabOrder className="sr-only" />
      <AlertDialog.Backdrop variant="blur" isDismissable={false} isKeyboardDismissDisabled>
        <AlertDialog.Container placement="center">
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger">
                <AlertTriangle className="w-5 h-5" />
              </AlertDialog.Icon>
              <AlertDialog.Heading>{title}</AlertDialog.Heading>
              <AlertDialog.CloseTrigger />
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-sm">{message}</p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button variant="ghost" onPress={onClose}>Cancel</Button>
              <Button variant="danger" onPress={onConfirm} isDisabled={isPending}>
                {isPending ? 'Please wait…' : confirmLabel}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
