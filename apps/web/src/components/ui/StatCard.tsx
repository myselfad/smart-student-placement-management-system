import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from './Button';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  accent?: 'blue' | 'cyan' | 'emerald' | 'violet' | 'amber';
  className?: string;
}

const accentMap = {
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600',    bar: 'bg-blue-500' },
  cyan:    { bg: 'bg-cyan-50',    icon: 'text-cyan-600',    bar: 'bg-cyan-500' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', bar: 'bg-emerald-500' },
  violet:  { bg: 'bg-violet-50',  icon: 'text-violet-600',  bar: 'bg-violet-500' },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   bar: 'bg-amber-500' },
};

export function StatCard({ title, value, icon, trend, accent = 'blue', className }: StatCardProps) {
  const colors = accentMap[accent];
  const isPositive = (trend?.value ?? 0) >= 0;

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.09)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden',
        className
      )}
    >
      {/* Top accent bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-[3px]', colors.bar)} />

      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {icon && (
          <div className={cn('p-2 rounded-lg flex-shrink-0', colors.bg)}>
            <span className={cn('block', colors.icon)}>{icon}</span>
          </div>
        )}
      </div>

      <div className="text-[28px] font-bold tracking-tight text-slate-900 tabular-nums leading-none">
        {value}
      </div>

      {trend && (
        <div className={cn(
          'flex items-center gap-1 mt-2.5 text-xs font-medium',
          isPositive ? 'text-emerald-600' : 'text-red-500'
        )}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{isPositive ? '+' : ''}{trend.value}%</span>
          <span className="text-slate-400 font-normal">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}
