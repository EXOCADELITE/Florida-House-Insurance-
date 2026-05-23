import { cn } from "@/lib/utils";
import { AlertTriangle, Info, ShieldCheck, AlertOctagon } from "lucide-react";

type Tone = "info" | "warning" | "danger" | "success";

const styles: Record<Tone, { wrap: string; icon: string; Icon: React.ComponentType<{ className?: string }> }> = {
  info: {
    wrap: "border-chart-5/30 bg-chart-5/5 text-foreground",
    icon: "text-chart-5",
    Icon: Info,
  },
  warning: {
    wrap: "border-warning/40 bg-warning/10 text-foreground",
    icon: "text-warning",
    Icon: AlertTriangle,
  },
  danger: {
    wrap: "border-destructive/30 bg-destructive/5 text-foreground",
    icon: "text-destructive",
    Icon: AlertOctagon,
  },
  success: {
    wrap: "border-success/30 bg-success/5 text-foreground",
    icon: "text-success",
    Icon: ShieldCheck,
  },
};

export function Callout({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const s = styles[tone];
  return (
    <div className={cn("rounded-2xl border p-5 flex gap-4", s.wrap, className)}>
      <s.Icon className={cn("h-5 w-5 mt-0.5 shrink-0", s.icon)} />
      <div className="space-y-1.5">
        {title && <p className="font-semibold text-sm">{title}</p>}
        {children && <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}
