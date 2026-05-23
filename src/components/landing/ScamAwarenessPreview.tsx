import { Section } from "@/components/shared/Section";
import { SCAM_ALERTS } from "@/lib/data";
import { Link } from "@tanstack/react-router";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { Pill } from "@/components/shared/Pill";

export function ScamAwarenessPreview() {
  const top = SCAM_ALERTS.slice(0, 3);
  return (
    <Section
      eyebrow="Scam alert center"
      title="The scams targeting Florida homeowners right now"
      description="Independent consumer protection — not fearmongering, not lead-gen."
      className="bg-secondary/30"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {top.map((s) => (
          <div key={s.id} className="rounded-2xl border border-destructive/20 bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <Pill tone={s.severity === "high" ? "danger" : "warning"}>
                {s.severity === "high" ? "High risk" : "Elevated"}
              </Pill>
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{s.summary}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/scam-alerts" className="inline-flex items-center text-sm font-medium text-orange hover:text-orange/80">
          See all active scam alerts <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}
