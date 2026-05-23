import { cn } from "@/lib/utils";

export function Pill({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "orange" | "navy" | "success" | "warning" | "danger";
  className?: string;
}) {
  const tones = {
    default: "bg-secondary text-secondary-foreground",
    orange: "bg-orange/10 text-orange",
    navy: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-foreground",
    danger: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
