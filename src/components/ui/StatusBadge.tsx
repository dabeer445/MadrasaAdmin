import { Chip } from '@heroui/react';
import type { SubscriptionStatus } from '../../types';

const STATUS_MAP: Record<SubscriptionStatus, { color: 'success' | 'warning' | 'danger' | 'default'; label: string }> = {
  active:    { color: 'success', label: 'Active' },
  trial:     { color: 'warning', label: 'Trial' },
  expired:   { color: 'danger',  label: 'Expired' },
  suspended: { color: 'default', label: 'Suspended' },
};

export default function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const { color, label } = STATUS_MAP[status] ?? STATUS_MAP.suspended;
  return <Chip color={color} variant="soft" size="sm">{label}</Chip>;
}
