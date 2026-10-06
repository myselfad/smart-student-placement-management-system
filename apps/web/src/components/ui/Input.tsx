import * as React from 'react';
import { cn } from './Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900',
          'placeholder:text-slate-400',
          'transition-all duration-150',
          'hover:border-slate-300',
          'focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/12',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
          'shadow-xs',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
