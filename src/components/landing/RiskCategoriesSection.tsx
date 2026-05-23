import { Section } from "@/components/shared/Section";
import { RISK_CATEGORIES } from "@/lib/data";
import { Home, Wind, Waves, ClipboardCheck, PiggyBank, Camera } from "lucide-react";

const iconMap = { Home, Wind, Waves, ClipboardCheck, PiggyBank, Camera } as const;

export function RiskCategoriesSection() {
  return (
    <Section
      eyebrow="What we analyze"
      title="The six risk areas behind every Florida renewal"
      description="Insurers don't read your policy the way you do. We surface what they actually evaluate."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RISK_CATEGORIES.map((c) => {
          const Icon = iconMap[c.icon as keyof typeof iconMap];
          return (
            <div key={c.key} className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-orange/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">{c.label}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.description}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
