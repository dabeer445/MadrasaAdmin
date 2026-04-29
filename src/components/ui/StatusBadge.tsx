import type { SubscriptionStatus } from '../../types';
import { STATUS_COLORS, STATUS_LABELS } from '../../lib/constants';

export default function StatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
