import { Card } from '@heroui/react';
import type { LucideIcon } from 'lucide-react';

type Color = 'blue' | 'green' | 'yellow' | 'red' | 'indigo' | 'purple';

const ICON_CLASSES: Record<Color, string> = {
  blue:   'bg-sky-500/10 text-sky-400',
  green:  'bg-emerald-500/10 text-emerald-400',
  yellow: 'bg-amber-500/10 text-amber-400',
  red:    'bg-rose-500/10 text-rose-400',
  indigo: 'bg-violet-500/10 text-violet-400',
  purple: 'bg-purple-500/10 text-purple-400',
};

const VALUE_CLASSES: Record<Color, string> = {
  blue:   'text-sky-300',
  green:  'text-emerald-300',
  yellow: 'text-amber-300',
  red:    'text-rose-300',
  indigo: 'text-violet-300',
  purple: 'text-purple-300',
};

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  color: Color;
  onClick?: () => void;
}

export default function StatCard({ label, value, sub, icon: Icon, color, onClick }: StatCardProps) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
        <div className={`p-2 rounded-lg ${ICON_CLASSES[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <p className={`text-3xl font-bold tracking-tight ${VALUE_CLASSES[color]}`}>{value}</p>
        <p className={`text-xs mt-1 ${sub ? 'text-zinc-500' : 'invisible'}`}>{sub ?? ' '}</p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="card p-5 w-full flex flex-col gap-4 text-left cursor-pointer hover:border-zinc-700 hover:bg-zinc-800/80 transition-all"
      >
        {body}
      </button>
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-4">
      {body}
    </Card>
  );
}
