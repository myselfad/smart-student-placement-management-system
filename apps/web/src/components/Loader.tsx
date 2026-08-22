import { Loader2 } from 'lucide-react';

export default function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-muted-foreground animate-in fade-in duration-300">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
}
