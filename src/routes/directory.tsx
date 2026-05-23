import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Section } from "@/components/shared/Section";
import { PROVIDERS } from "@/lib/data";
import { Pill } from "@/components/shared/Pill";
import { BadgeCheck, Star, MapPin, FileCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/directory")({
  component: DirectoryPage,
  head: () => ({ meta: [{ title: "Trusted Help Directory — Florida HomeShield" }] }),
});

const types = ["All", "Roof Inspector", "Wind Mitigation Inspector", "4-Point Inspector", "Mold Specialist", "Insurance Reviewer", "Emergency Services"];

function DirectoryPage() {
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? PROVIDERS : PROVIDERS.filter((p) => p.type === filter);

  return (
    <Shell>
      <Section
        eyebrow="Trusted help directory"
        title="Verified Florida professionals — no referral fees, no sponsored placements"
        description="License-verified providers across roofing, inspections, mold remediation and emergency response."
      >
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                filter === t
                  ? "border-orange bg-orange/10 text-orange"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between">
                <Pill tone="navy">{p.type}</Pill>
                {p.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{p.name}</h3>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.region}</span>
                <span className="inline-flex items-center gap-1"><FileCheck className="h-3 w-3" /> {p.license}</span>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-orange text-orange" />
                <span className="font-semibold text-foreground">{p.rating}</span>
                <span className="text-muted-foreground">· {p.reviews} verified reviews</span>
              </div>
              <button className="mt-5 w-full rounded-lg border border-border bg-background py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                View profile
              </button>
            </div>
          ))}
        </div>
      </Section>
    </Shell>
  );
}
