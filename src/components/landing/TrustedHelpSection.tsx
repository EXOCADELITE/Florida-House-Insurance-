import { Section } from "@/components/shared/Section";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const types = [
  "Roof inspectors",
  "Wind mitigation inspectors",
  "4-point inspectors",
  "Mold specialists",
  "Insurance reviewers",
  "Emergency services",
];

export function TrustedHelpSection() {
  return (
    <Section
      eyebrow="Trusted help"
      title="When you need a real human — verified, licensed, no kickbacks"
      description="We don't take referral fees. Listings are based on license verification and homeowner-reported outcomes."
    >
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] items-center">
        <div>
          <h3 className="text-xl font-semibold text-foreground">A directory built on verification, not advertising</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Every provider is checked against the Florida DBPR license database. Reviews come from
            verified homeowners — not paid leads. No sponsored placements.
          </p>
          <Link to="/directory" className="inline-block mt-6">
            <Button className="bg-orange text-white hover:bg-orange/90">
              Browse directory <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {types.map((t) => (
            <div key={t} className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm">
              <BadgeCheck className="h-4 w-4 text-success" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
