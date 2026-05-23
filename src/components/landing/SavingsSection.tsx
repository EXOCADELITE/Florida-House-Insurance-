import { Section } from "@/components/shared/Section";
import { Link } from "@tanstack/react-router";
import { TrendingDown, ArrowRight } from "lucide-react";

const items = [
  { title: "Wind mitigation credits", body: "Add roof-to-wall straps, secondary water resistance and impact openings to capture up to $1,200/yr in credits.", save: "$320–$1,200/yr" },
  { title: "Hurricane deductible review", body: "Many homeowners overpay by keeping a low named-storm deductible they'd never actually file against.", save: "$200–$600/yr" },
  { title: "Bundled or re-shopped policies", body: "Florida market changes monthly. A 90-second carrier review at renewal often beats auto-renew quotes.", save: "$150–$900/yr" },
];

export function SavingsSection() {
  return (
    <Section
      eyebrow="Savings opportunities"
      title="Real reductions homeowners miss every renewal"
      description="We surface the savings carriers won't proactively offer — and explain the tradeoffs."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border border-border bg-card p-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
              <TrendingDown className="h-3.5 w-3.5" />
              Save {it.save}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/analyzer" className="inline-flex items-center text-sm font-medium text-orange hover:text-orange/80">
          Analyze your documents <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}
