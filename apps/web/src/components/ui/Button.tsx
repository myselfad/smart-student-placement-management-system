import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: props.disabled ? 1 : 1.005 }}
        whileTap={{ scale: props.disabled ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50 select-none',
          {
            'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20': variant === 'default',
            'bg-slate-100 text-slate-700 hover:bg-slate-200': variant === 'secondary',
            'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm': variant === 'outline',
            'text-slate-600 hover:bg-slate-100 hover:text-slate-800': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/20': variant === 'destructive',
            'h-9 px-4 py-2': size === 'default',
            'h-8 rounded-md px-3 text-xs': size === 'sm',
            'h-10 rounded-lg px-6': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          className
        )}
        {...(props as HTMLMotionProps<'button'>)}
      />
    );
  }
);
Button.displayName = 'Button';
