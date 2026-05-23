import { cn } from "@/lib/utils";

export function Timeline({
  items,
  className,
}: {
  items: { date: string; title: string; description?: string; tone?: "default" | "orange" | "success" | "warning" }[];
  className?: string;
}) {
  const dot: Record<string, string> = {
    default: "bg-primary",
    orange: "bg-orange",
    success: "bg-success",
    warning: "bg-warning",
  };
  return (
    <ol className={cn("relative border-l border-border pl-6", className)}>
      {items.map((it, i) => (
        <li key={i} className="mb-8 last:mb-0">
          <span
            className={cn(
              "absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-background",
              dot[it.tone ?? "default"],
            )}
          />
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{it.date}</p>
          <p className="mt-1 text-base font-semibold text-foreground">{it.title}</p>
          {it.description && <p className="mt-1 text-sm text-muted-foreground">{it.description}</p>}
        </li>
      ))}
    </ol>
  );
}
