import * as React from "react"
import { cn } from "./Button"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-blue-50 text-blue-700 border border-blue-200/80": variant === "default",
          "bg-slate-100 text-slate-600 border border-slate-200": variant === "secondary",
          "bg-red-50 text-red-700 border border-red-200/80": variant === "destructive",
          "bg-emerald-50 text-emerald-700 border border-emerald-200/80": variant === "success",
          "bg-amber-50 text-amber-700 border border-amber-200/80": variant === "warning",
          "border border-slate-200 text-slate-700": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
