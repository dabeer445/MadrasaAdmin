import type { SubscriptionStatus } from '../types';

export const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ['trial', 'active', 'expired', 'suspended'];

export const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  trial: 'Trial',
  active: 'Active',
  expired: 'Expired',
  suspended: 'Suspended',
};

export const STATUS_COLORS: Record<SubscriptionStatus, string> = {
  trial:     'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  active:    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  expired:   'bg-zinc-700/40 text-zinc-400 border border-zinc-600/30',
  suspended: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

export const STATUS_DOT: Record<SubscriptionStatus, string> = {
  trial:     'bg-amber-400',
  active:    'bg-emerald-400',
  expired:   'bg-zinc-500',
  suspended: 'bg-rose-500',
};

export const MONTH_OPTIONS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];
