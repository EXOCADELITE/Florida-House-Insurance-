import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Section } from "@/components/shared/Section";
import { Pill } from "@/components/shared/Pill";
import { Callout } from "@/components/shared/Callout";
import { Checklist } from "@/components/shared/Checklist";
import { SCAM_ALERTS } from "@/lib/data";
import { ShieldAlert, AlertTriangle, Phone, FileWarning } from "lucide-react";

export const Route = createFileRoute("/scam-alerts")({
  component: ScamAlertsPage,
  head: () => ({ meta: [{ title: "Scam Alert Center — Florida HomeShield" }] }),
});

function ScamAlertsPage() {
  return (
    <Shell>
      <Section
        eyebrow="Scam alert center"
        title="What's targeting Florida homeowners right now"
        description="Active consumer-protection alerts. Independent, not sponsored, updated regularly."
      >
        <Callout tone="danger" title="If a contractor pressures you to sign anything today, walk away.">
          Florida law gives you a 3-day cancellation right on most door-to-door home improvement contracts. No real
          professional rushes that.
        </Callout>

        <h2 className="mt-12 text-xl font-bold text-foreground">Active alerts</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {SCAM_ALERTS.map((s) => (
            <div key={s.id} className="rounded-2xl border border-destructive/20 bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <Pill tone={s.severity === "high" ? "danger" : s.severity === "elevated" ? "warning" : "default"}>
                      {s.severity === "high" ? "High risk" : s.severity === "elevated" ? "Elevated" : "Moderate"}
                    </Pill>
                    <p className="mt-1 text-xs text-muted-foreground">Posted {s.posted}</p>
                  </div>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.summary}</p>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Common tactics</p>
                <ul className="mt-2 space-y-1.5">
                  {s.tactics.map((t) => (
                    <li key={t} className="flex gap-2 text-sm text-foreground">
                      <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Red flags</p>
                <ul className="mt-2 space-y-1.5">
                  {s.redFlags.map((t) => (
                    <li key={t} className="flex gap-2 text-sm text-foreground">
                      <FileWarning className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-xl font-bold text-foreground">Prevention checklist</h2>
        <div className="mt-5">
          <Checklist
            items={[
              { label: "Verify any contractor at MyFloridaLicense.com before signing", detail: "Search the license number directly — don't trust business cards." },
              { label: "Never sign an Assignment of Benefits (AOB) on first meeting" },
              { label: "Refuse any 'today only' pricing — real estimates don't expire in an hour" },
              { label: "Pay by check or credit card — never cash, Zelle, or Venmo to a stranger" },
              { label: "Get at least two written estimates before any non-emergency work" },
              { label: "Confirm the contractor pulls the permit — not you" },
            ]}
          />
        </div>

        <Callout tone="info" title="Reporting suspected fraud" className="mt-12">
          File a complaint with the Florida Department of Financial Services{" "}
          <Link to="/scam-alerts" className="text-orange hover:underline">Insurance Fraud Hotline</Link> (1-800-378-0445)
          or the Florida Attorney General's Consumer Protection Division.
        </Callout>
      </Section>
    </Shell>
  );
}
