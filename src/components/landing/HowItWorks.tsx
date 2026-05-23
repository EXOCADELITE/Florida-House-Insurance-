import { Upload, ScanSearch, ClipboardList } from "lucide-react";
import { Section } from "@/components/shared/Section";

const steps = [
  {
    icon: Upload,
    title: "Upload your documents",
    body: "Insurance declaration pages, inspection PDFs, contractor estimates — drag, drop, done. No account required to start.",
  },
  {
    icon: ScanSearch,
    title: "We translate the jargon",
    body: "Plain-English summaries highlight what matters: deductibles, exclusions, age limits, missing credits and red flags.",
  },
  {
    icon: ClipboardList,
    title: "Get next-step guidance",
    body: "Personalized recommendations — what to fix, what to ask your agent, what to ignore, and what to do before renewal.",
  },
];

export function HowItWorks() {
  return (
    <Section
      eyebrow="How it works"
      title="From confusing PDFs to confident next steps"
      description="A guided workflow built for homeowners — not insurance brokers, not contractors."
      align="center"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="rounded-2xl border border-border bg-card p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/10 text-orange">
                <s.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">STEP {i + 1}</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
