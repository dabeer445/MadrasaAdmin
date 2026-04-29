import type { LucideIcon } from 'lucide-react';

type Color = 'blue' | 'green' | 'yellow' | 'red' | 'indigo' | 'purple';

const COLOR_CLASSES: Record<Color, string> = {
  blue:   'bg-blue-50 text-blue-600',
  green:  'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red:    'bg-red-50 text-red-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  purple: 'bg-purple-50 text-purple-600',
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: Color;
  onClick?: () => void;
}

export default function StatCard({ label, value, icon: Icon, color, onClick }: StatCardProps) {
  const base = 'bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-start justify-between gap-4';
  return (
    <div
      className={`${base} ${onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-200 transition-all' : ''}`}
      onClick={onClick}
    >
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl shrink-0 ${COLOR_CLASSES[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
