import React from 'react';
import { cn } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-8 text-center glass-card rounded-xl border-dashed",
      className
    )}>
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-[hsl(196,100%,47%)]/10 flex items-center justify-center text-primary/50 mb-5 ring-1 ring-primary/10">
          {icon}
        </div>
      )}
      <h3 className="font-semibold text-foreground text-base mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
