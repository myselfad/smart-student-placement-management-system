import React, { useState } from 'react';
import { cn } from './Button';

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, className, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab } as any);
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ className, children, activeTab, setActiveTab }: any) {
  return (
    <div className={cn("inline-flex h-12 items-center justify-center rounded-lg bg-black/40 p-1 text-gray-400 border border-white/10 shadow-inner backdrop-blur-sm", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab } as any);
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ value, className, children, activeTab, setActiveTab }: any) {
  const isActive = activeTab === value;
  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-white text-black shadow-sm" : "hover:text-white hover:bg-white/10",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, activeTab }: any) {
  if (activeTab !== value) return null;
  return (
    <div
      className={cn(
        "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in zoom-in-95 duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}
