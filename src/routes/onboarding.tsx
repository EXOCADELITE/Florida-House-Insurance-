import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({ meta: [{ title: "Welcome — Florida HomeShield" }] }),
});

const steps = [
  { title: "Property", description: "Address and basic facts" },
  { title: "Insurance", description: "Carrier and renewal date" },
  { title: "Priorities", description: "What we focus on first" },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  return (
    <Shell>
      <Section eyebrow="Get started" title="Set up your homeowner profile" description="Takes about 90 seconds. You can edit anything later.">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <ol className="space-y-2">
            {steps.map((s, i) => (
              <li key={s.title} className={cn("rounded-xl border p-4 flex items-start gap-3", i === step ? "border-orange/40 bg-orange/5" : "border-border bg-card")}>
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold shrink-0", i < step ? "bg-success text-white" : i === step ? "bg-orange text-white" : "bg-secondary text-muted-foreground")}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="rounded-2xl border border-border bg-card p-7">
            {step === 0 && <PropertyStep />}
            {step === 1 && <InsuranceStep />}
            {step === 2 && <PrioritiesStep />}
            <div className="mt-8 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</Button>
              <Button className="bg-orange text-white hover:bg-orange/90" onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>
                {step === steps.length - 1 ? "Finish" : "Continue"} <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </Shell>
  );
}

function PropertyStep() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><Label>Address</Label><Input placeholder="1428 Bayshore Dr" className="mt-1.5" /></div>
      <div><Label>City</Label><Input placeholder="Tampa" className="mt-1.5" /></div>
      <div><Label>Zip</Label><Input placeholder="33606" className="mt-1.5" /></div>
      <div><Label>Year built</Label><Input placeholder="2008" className="mt-1.5" /></div>
      <div><Label>Square feet</Label><Input placeholder="2,140" className="mt-1.5" /></div>
    </div>
  );
}
function InsuranceStep() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><Label>Insurance carrier</Label><Input placeholder="Florida Coastal Insurance" className="mt-1.5" /></div>
      <div><Label>Renewal date</Label><Input type="date" className="mt-1.5" /></div>
      <div><Label>Hurricane deductible</Label><Input placeholder="2%" className="mt-1.5" /></div>
    </div>
  );
}
function PrioritiesStep() {
  const opts = ["Lower my premium", "Prepare for hurricane season", "Understand my policy", "Plan a roof replacement", "Avoid renewal surprises", "Document my property"];
  const [sel, setSel] = useState<string[]>([]);
  return (
    <div>
      <p className="text-sm text-muted-foreground">Pick anything that applies — we'll prioritize your analysis.</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {opts.map((o) => {
          const active = sel.includes(o);
          return (
            <button
              key={o}
              onClick={() => setSel(active ? sel.filter((x) => x !== o) : [...sel, o])}
              className={cn(
                "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                active ? "border-orange bg-orange/10 text-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
