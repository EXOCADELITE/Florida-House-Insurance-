import { Section } from "@/components/shared/Section";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Checklist } from "@/components/shared/Checklist";

export function HurricanePrepSection() {
  return (
    <Section
      eyebrow="Storm preparedness"
      title="Hurricane season, handled methodically"
      description="A calm, repeatable workflow — not a panicked sprint when a name appears on the cone."
    >
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
        <div className="rounded-3xl border border-border bg-card p-7">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Pre-season foundation</p>
          <h3 className="mt-2 text-xl font-semibold text-foreground">The five things to finish before June 1</h3>
          <Checklist
            className="mt-6"
            items={[
              { label: "Photograph every room and serial-numbered item", detail: "Cloud-backup the photos." },
              { label: "Save your policy declaration page off-device" },
              { label: "Confirm your hurricane deductible in dollars — not %" },
              { label: "Trim trees and plan furniture storage" },
              { label: "Test generators, batteries and flashlights" },
            ]}
          />
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm font-semibold text-foreground">Watch / Warning phase</p>
            <p className="mt-2 text-sm text-muted-foreground">A focused 60-minute checklist for the 36 hours before landfall.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm font-semibold text-foreground">After the storm</p>
            <p className="mt-2 text-sm text-muted-foreground">Document, mitigate, file, and refuse unsolicited inspections.</p>
          </div>
          <Link to="/storm-prep">
            <Button className="bg-orange text-white hover:bg-orange/90">Open full storm prep system</Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
