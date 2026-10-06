import { Loader2 } from 'lucide-react';

export default function Loader({ text = "Loading…" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
}
