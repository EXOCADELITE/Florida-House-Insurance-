import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Section } from "@/components/shared/Section";
import { Callout } from "@/components/shared/Callout";
import { Pill } from "@/components/shared/Pill";
import { Sparkles, FileText, ChevronDown, ShieldCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analysis/$type")({
  component: AnalysisPage,
  loader: ({ params }) => {
    const a = ANALYSES[params.type as keyof typeof ANALYSES];
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? "Analysis"} — Florida HomeShield` }],
  }),
});

type SectionItem = {
  title: string;
  value: string;
  tone: "default" | "warning" | "success";
  note: string;
  explanation: string;
  nextSteps: string[];
};

type AnalysisData = {
  title: string;
  subtitle: string;
  summary: string;
  sections: SectionItem[];
  insights: string[];
};

const ANALYSES: Record<string, AnalysisData> = {
  insurance: {
    title: "Insurance policy summary",
    subtitle: "Florida Coastal Insurance HO-3 · Policy #FCI-22841",
    summary: "Standard HO-3 policy on a single-family dwelling. Two missing wind mitigation credits and an above-average hurricane deductible relative to peer Tampa homes.",
    sections: [
      {
        title: "Dwelling coverage",
        value: "$372,000",
        tone: "default",
        note: "Consistent with replacement cost for 2,140 sqft Tampa SFH.",
        explanation: "Dwelling coverage is the amount your insurer will pay to rebuild your home if it's destroyed. It should match the cost to rebuild from scratch — not your market value or what you paid. Construction costs in Florida have risen sharply, so this number should be reviewed every 1–2 years.",
        nextSteps: [
          "Confirm replacement cost with an independent estimator every 2 years.",
          "Ask your agent to verify ordinance & law coverage is at least 25%.",
        ],
      },
      {
        title: "Hurricane deductible",
        value: "2% ($7,440)",
        tone: "warning",
        note: "Above peer median — consider raising to 5% if you have emergency reserves.",
        explanation: "In Florida, hurricane deductibles are a percentage of your dwelling coverage, not a flat dollar amount. A 2% deductible means you pay $7,440 out of pocket before insurance kicks in on a named-storm claim. Raising it lowers your premium but increases what you'd owe after a storm.",
        nextSteps: [
          "Confirm you have at least the deductible amount in liquid savings.",
          "Request quotes at 2%, 5%, and 10% to compare annual premium savings.",
        ],
      },
      {
        title: "Personal property",
        value: "$186,000 (50% of dwelling)",
        tone: "default",
        note: "Standard ratio. Confirm sub-limits for jewelry and electronics.",
        explanation: "This covers your belongings — furniture, clothing, electronics. The default 50% of dwelling is standard, but high-value items like jewelry, firearms, and collectibles often have low sub-limits (e.g., $1,500 for jewelry) unless separately scheduled.",
        nextSteps: [
          "Make a photo/video inventory of every room.",
          "Schedule any single item worth over $1,500 as a separate rider.",
        ],
      },
      {
        title: "Loss of use",
        value: "$74,400 (20%)",
        tone: "default",
        note: "Adequate for displacement up to ~6 months.",
        explanation: "If your home becomes uninhabitable after a covered loss, this pays for hotels, rentals, and extra living expenses. Florida rebuilds after a hurricane often take 9–18 months, so 20% is the minimum you should carry.",
        nextSteps: [
          "Keep receipts for all displacement expenses if you ever file a claim.",
          "Ask whether your policy uses a time limit or dollar limit — time limits are better.",
        ],
      },
      {
        title: "Liability",
        value: "$300,000",
        tone: "warning",
        note: "Consider raising to $500K — cost difference is typically <$60/yr.",
        explanation: "Liability protects you if someone is injured on your property or you cause damage to others. $300K is the baseline, but in Florida — where lawsuits are common — most advisors recommend $500K, paired with an umbrella policy for high-net-worth households.",
        nextSteps: [
          "Request a $500K liability quote at next renewal.",
          "Consider a $1M umbrella policy if you have significant assets.",
        ],
      },
    ],
    insights: [
      "Wind mitigation credits applied: 4 of 7 — missing roof-to-wall straps and secondary water resistance.",
      "Roof condition exclusion applies to roofs over 15 years — your roof is 16. Plan for inspection before renewal.",
      "AOB restriction endorsement is in effect (good).",
    ],
  },
  roof: {
    title: "Roof risk analysis",
    subtitle: "PalmTree Roof Inspections · May 12, 2026",
    summary: "Asphalt shingle roof, 16 years old. Minor granule loss and three lifted shingles on south-facing slope. No structural concerns. Likely 4–6 years of remaining useful life.",
    sections: [
      {
        title: "Material",
        value: "Architectural asphalt shingle",
        tone: "default",
        note: "30-year rated, installed 2010.",
        explanation: "Architectural shingles are the most common roof in Florida — affordable, decent wind ratings, but shorter life than metal or tile in coastal climates. The 30-year warranty rating is rarely achieved in Florida due to UV and storms; expect 18–22 years of real-world life.",
        nextSteps: [
          "Keep your original installation invoice for insurer documentation.",
          "Compare metal or concrete tile pricing at next replacement cycle.",
        ],
      },
      {
        title: "Age",
        value: "16 years",
        tone: "warning",
        note: "Past Florida insurer comfort threshold (15 yrs).",
        explanation: "Most Florida insurers either non-renew or apply a roof-condition exclusion once an asphalt shingle roof passes 15 years. You're in the carrier's risk window — don't be surprised by a non-renewal notice at the next term.",
        nextSteps: [
          "Get a roof certification letter to extend insurability 1–2 years.",
          "Start collecting replacement quotes now so you're not rushed.",
        ],
      },
      {
        title: "Estimated remaining life",
        value: "4–6 years",
        tone: "warning",
        note: "Plan replacement timing within next renewal cycle.",
        explanation: "Remaining life is an inspector's judgment based on granule loss, lifted edges, and underlayment condition. 4–6 years means you have planning runway, but coastal storms could shorten it significantly.",
        nextSteps: [
          "Budget 15–20% above today's quoted price for inflation.",
          "Re-inspect after any named storm passes within 100 miles.",
        ],
      },
      {
        title: "Damage flags",
        value: "3 lifted shingles",
        tone: "warning",
        note: "Repair recommended before renewal photo inspection.",
        explanation: "Lifted shingles let water reach the underlayment and are the #1 reason insurer photo inspections fail. A licensed repair takes under an hour and costs $150–$400 — far cheaper than non-renewal.",
        nextSteps: [
          "Get the repair done by a licensed roofer (not handyman).",
          "Save the repair invoice and post-repair photos for your file.",
        ],
      },
      {
        title: "Structural",
        value: "Sound",
        tone: "success",
        note: "Decking and trusses passed visual inspection.",
        explanation: "The bones of your roof — decking, trusses, fascia — are in good shape. That means your next replacement is shingle-only (no structural work), keeping the project simpler and cheaper.",
        nextSteps: [
          "Keep this inspection report on file as a baseline.",
          "Have an attic check after any major storm for water staining.",
        ],
      },
    ],
    insights: [
      "Insurers Friedman & Sentinel currently non-renew at 17+ years of asphalt shingle.",
      "Replacing with metal roofing in Florida averages ~$22K–$32K but extends carrier eligibility 15+ years.",
      "Wind mitigation re-inspection after re-roof can capture 2 missing credits worth ~$480/yr.",
    ],
  },
  deductible: {
    title: "Deductible explanation",
    subtitle: "Why your hurricane deductible is different",
    summary: "Florida policies carry a separate, percentage-based hurricane deductible — not a flat dollar amount. Yours is 2% of dwelling coverage, or $7,440 out of pocket per named-storm event.",
    sections: [
      {
        title: "Standard deductible",
        value: "$2,500",
        tone: "default",
        note: "Applies to non-hurricane claims (fire, theft, non-named-storm wind).",
        explanation: "This is the deductible for everyday claims — kitchen fire, burglary, a tree falling in a regular thunderstorm. It's a flat dollar amount and applies per claim.",
        nextSteps: [
          "Keep $2,500 accessible in an emergency fund.",
          "Don't file small claims — frequent filings can trigger non-renewal.",
        ],
      },
      {
        title: "Hurricane deductible",
        value: "2% / $7,440",
        tone: "warning",
        note: "Triggered only when a hurricane warning is issued.",
        explanation: "This activates only when the National Hurricane Center issues a hurricane watch/warning for any part of Florida. Once triggered, it applies to all hurricane-related damage for that calendar year — not per storm.",
        nextSteps: [
          "Confirm exact trigger language in your policy declarations.",
          "Build a separate hurricane savings bucket equal to this deductible.",
        ],
      },
      {
        title: "Annual hurricane savings at 5%",
        value: "~$310/yr",
        tone: "success",
        note: "Raises out-of-pocket to $18,600.",
        explanation: "Raising your hurricane deductible from 2% to 5% typically saves $250–$400/year in premium. Over 10 years that's $2,500–$4,000 — meaningful if you can absorb the higher out-of-pocket.",
        nextSteps: [
          "Verify you can comfortably write a $18,600 check.",
          "Ask your agent for the exact savings at your home's coverage level.",
        ],
      },
      {
        title: "Annual hurricane savings at 10%",
        value: "~$580/yr",
        tone: "success",
        note: "Raises out-of-pocket to $37,200 — only if you have reserves.",
        explanation: "10% deductibles are best suited for households with significant liquid savings, paid-off mortgages, or strong income stability. The savings are real but the downside risk is large after a major storm.",
        nextSteps: [
          "Only choose 10% if you have 6+ months of expenses plus the deductible saved.",
          "Confirm your mortgage lender allows this deductible level (some don't).",
        ],
      },
    ],
    insights: [
      "Hurricane deductibles apply per calendar year in Florida — not per event.",
      "Lower-income households should generally keep 2% to avoid catastrophic out-of-pocket.",
      "Homeowners with $50K+ liquid reserves often benefit from 5%.",
    ],
  },
  mitigation: {
    title: "Mitigation opportunities",
    subtitle: "Wind credits, deductibles, and structural upgrades",
    summary: "Your home is missing 3 of 7 wind mitigation credits. Adding two of them would capture roughly $480/year in premium reductions with no roof replacement required.",
    sections: [
      {
        title: "Roof-to-wall attachment",
        value: "Single wraps detected",
        tone: "warning",
        note: "Upgrade to double wraps via supplemental inspection — est. credit $190/yr.",
        explanation: "These metal straps tie your roof structure to the wall framing. Double wraps significantly reduce roof-uplift damage during hurricanes. Sometimes a re-inspection finds your home already has double wraps that were missed — worth checking before any structural work.",
        nextSteps: [
          "Hire a wind mitigation inspector for a second look ($125–$175).",
          "If upgrade is needed, get quotes from licensed framers.",
        ],
      },
      {
        title: "Secondary water resistance",
        value: "Not installed",
        tone: "warning",
        note: "Self-adhering membrane installed at re-roof time — est. credit $290/yr.",
        explanation: "A self-adhering peel-and-stick membrane is applied to the roof deck before shingles. If shingles blow off, this barrier prevents water from entering your home — the source of most hurricane damage. Only installable during a re-roof.",
        nextSteps: [
          "Schedule this with your next roof replacement (highest ROI credit).",
          "Confirm your roofer files the OIR-B1-1802 form afterward.",
        ],
      },
      {
        title: "Opening protection",
        value: "Not impact-rated",
        tone: "warning",
        note: "Install hurricane shutters on all openings — multi-year payoff.",
        explanation: "Impact-rated windows or hurricane shutters protect every opening (windows, doors, skylights). If even one opening is unprotected, you get zero credit — it's all-or-nothing. Payback is usually 5–8 years through premium savings alone.",
        nextSteps: [
          "Get quotes for accordion shutters (cheapest) vs. impact glass.",
          "Check your county for hurricane mitigation grant programs.",
        ],
      },
      {
        title: "Roof deck attachment",
        value: "8d nails @ 6/12 spacing",
        tone: "success",
        note: "Already maximum credit.",
        explanation: "Your roof deck is fastened with 8d nails on tight spacing — the strongest standard rating. No action needed; this credit is already applied.",
        nextSteps: [
          "Confirm this credit appears on your policy declarations.",
        ],
      },
      {
        title: "Roof shape",
        value: "Hip",
        tone: "success",
        note: "Already maximum credit (~$420/yr captured).",
        explanation: "Hip roofs (sloped on all four sides) shed wind better than gable roofs and earn the maximum shape credit. This is a structural feature — no action needed.",
        nextSteps: [
          "Preserve hip shape if you ever re-design the roof.",
        ],
      },
    ],
    insights: [
      "Secondary water resistance is the highest-ROI credit when scheduled with a planned re-roof.",
      "Florida statute requires insurers to apply credits when documented via OIR-B1-1802 form.",
      "Re-inspections cost $100–$175 and pay back in <12 months in most cases.",
    ],
  },
};

function AnalysisPage() {
  const a = Route.useLoaderData() as AnalysisData;
  return (
    <Shell>
      <Section
        eyebrow="AI analysis"
        title={a.title}
        description={a.subtitle}
      >
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Pill tone="orange"><Sparkles className="h-3 w-3 mr-1" />Plain-English summary</Pill>
          <Pill tone="navy"><FileText className="h-3 w-3 mr-1" />Source: uploaded document</Pill>
          <Pill tone="success"><ShieldCheck className="h-3 w-3 mr-1" />Private to your account</Pill>
        </div>

        <Callout tone="info" title="What this analysis means">{a.summary}</Callout>

        <div className="mt-10 space-y-3">
          {a.sections.map((s) => (
            <SectionCard key={s.title} section={s} />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-foreground">Why this matters</h2>
          <div className="mt-4 space-y-3">
            {a.insights.map((line, i) => (
              <Expand key={i} title={line.split(".")[0] + "."}>{line}</Expand>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            to="/analysis/$type"
            params={{ type: "mitigation" }}
            className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:border-orange/40"
          >
            View mitigation analysis
          </Link>
          <Link
            to="/analyzer"
            className="rounded-lg bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
          >
            Analyze your documents
          </Link>
        </div>
      </Section>
    </Shell>
  );
}

function SectionCard({ section: s }: { section: SectionItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-2xl border transition-colors",
        s.tone === "warning" && "border-warning/30 bg-warning/5",
        s.tone === "success" && "border-success/30 bg-success/5",
        s.tone === "default" && "border-border bg-card",
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.title}</p>
          <p className="mt-1 text-xl font-bold text-foreground">{s.value}</p>
          <p className="mt-2 text-sm text-muted-foreground">{s.note}</p>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground shrink-0 mt-1 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-border/60 px-5 py-5 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange mb-2">
              In plain English
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed">{s.explanation}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange mb-2">
              Recommended next steps
            </p>
            <ul className="space-y-2">
              {s.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <ArrowRight className="h-4 w-4 text-orange shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function Expand({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{children}</div>}
    </div>
  );
}
