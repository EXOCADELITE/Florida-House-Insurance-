import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Section } from "@/components/shared/Section";
import { Checklist } from "@/components/shared/Checklist";
import { Callout } from "@/components/shared/Callout";
import { STORM_CHECKLIST } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, Cloud, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/storm-prep")({
  component: StormPrepPage,
  head: () => ({ meta: [{ title: "Storm Prep System — Florida HomeShield" }] }),
});

type PhaseKey = "beforeSeason" | "watchWarning" | "afterStorm";

const PHASES: {
  key: PhaseKey;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
  tone: "success" | "warning" | "danger";
  window: string;
  intro: string;
}[] = [
  {
    key: "beforeSeason",
    icon: ShieldCheck,
    title: "Before the season",
    blurb: "Foundation tasks to complete by June 1.",
    tone: "success",
    window: "March – May · ~2 hours",
    intro:
      "Pre-season prep is the difference between a calm storm week and a panicked one. Finish these five items before June 1 and you'll never be scrambling for documents, photos, or fuel when a cone appears.",
  },
  {
    key: "watchWarning",
    icon: Cloud,
    title: "Watch / Warning",
    blurb: "The 36 hours before landfall — focused, fast.",
    tone: "warning",
    window: "T-36h to T-6h · ~60 minutes",
    intro:
      "Once your county is under a watch or warning, work the list top-to-bottom in one focused hour. Don't improvise — improvisation is how people forget medications, evacuation zones, and exterior photos.",
  },
  {
    key: "afterStorm",
    icon: AlertTriangle,
    title: "After the storm",
    blurb: "Document, mitigate, file. Refuse unsolicited inspections.",
    tone: "danger",
    window: "First 72 hours post-landfall",
    intro:
      "The first 72 hours decide whether your claim is paid quickly or fought for months. Document everything before you clean up, mitigate further damage, and never sign an Assignment of Benefits handed to you in your driveway.",
  },
];

const toneClasses: Record<"success" | "warning" | "danger", string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-foreground",
  danger: "bg-destructive/10 text-destructive",
};

function StormPrepPage() {
  const [active, setActive] = useState<PhaseKey>("beforeSeason");
  const current = PHASES.find((p) => p.key === active)!;

  return (
    <Shell>
      <Section
        eyebrow="Storm prep system"
        title="Hurricane preparation, calm and methodical"
        description="Three phases. Three checklists. Tap a phase to see exactly what to do — and when."
      >
        {/* Phase tabs */}
        <div role="tablist" aria-label="Storm preparation phases" className="grid gap-4 md:grid-cols-3">
          {PHASES.map((p) => {
            const isActive = active === p.key;
            return (
              <button
                key={p.key}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${p.key}`}
                id={`tab-${p.key}`}
                onClick={() => setActive(p.key)}
                className={cn(
                  "text-left rounded-2xl border p-6 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange",
                  isActive
                    ? "border-orange/50 bg-orange/5 shadow-sm"
                    : "border-border bg-card hover:border-orange/30",
                )}
              >
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneClasses[p.tone])}>
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                <p className="mt-3 text-xs uppercase tracking-wider text-orange font-semibold">{p.window}</p>
              </button>
            );
          })}
        </div>

        {/* Active phase panel */}
        <div
          role="tabpanel"
          id={`panel-${current.key}`}
          aria-labelledby={`tab-${current.key}`}
          className="mt-10 rounded-3xl border border-border bg-card p-7"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-wider text-orange font-semibold">{current.window}</p>
              <h3 className="mt-2 text-2xl font-bold text-foreground">{current.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{current.intro}</p>
            </div>
            <div className="shrink-0 rounded-xl border border-border bg-background px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">Items</p>
              <p className="text-2xl font-bold text-foreground">{STORM_CHECKLIST[current.key].length}</p>
            </div>
          </div>

          <Checklist className="mt-6" items={STORM_CHECKLIST[current.key]} />
        </div>

        <Callout tone="info" title="Document backup recommendations" className="mt-12">
          Email yourself: declaration page, latest wind mitigation inspection, photos of every room, copies of driver's
          licenses and insurance cards, and emergency contacts. Store off-device — a phone in a flooded car helps nobody.
        </Callout>

        <div className="mt-10 rounded-3xl border border-border bg-card p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-foreground">Printable family checklist</p>
            <p className="mt-1 text-sm text-muted-foreground">One-page PDF covering all three phases.</p>
          </div>
          {/* FUTURE: render printable PDF via /api/storm-prep/pdf */}
          <Button className="bg-orange text-white hover:bg-orange/90">
            <Download className="mr-2 h-4 w-4" /> Download checklist
          </Button>
        </div>
      </Section>
    </Shell>
  );
}
