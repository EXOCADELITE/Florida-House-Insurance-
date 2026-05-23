import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checklist({
  items,
  className,
}: {
  items: { label: string; detail?: string }[];
  className?: string;
}) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-4">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
            <Check className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{it.label}</p>
            {it.detail && <p className="mt-1 text-sm text-muted-foreground">{it.detail}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
