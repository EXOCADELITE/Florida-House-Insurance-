import { createFileRoute, Link } from "@tanstack/react-router";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Pill } from "@/components/shared/Pill";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/account/history")({
  component: HistoryPage,
  head: () => ({ meta: [{ title: "Document history — Florida HomeShield" }] }),
});

const docs = [
  { name: "Florida Coastal Declaration Page.pdf", type: "Declaration", date: "May 14, 2026", status: "Analyzed" },
  { name: "Wind Mitigation Inspection 2024.pdf", type: "Wind Mitigation", date: "May 12, 2026", status: "Analyzed" },
  { name: "4-Point Inspection Report.pdf", type: "4-Point", date: "May 12, 2026", status: "Analyzed" },
  { name: "Roof Estimate — Apex Roofing.pdf", type: "Contractor Estimate", date: "May 10, 2026", status: "Flagged" },
  { name: "FEMA Elevation Certificate.pdf", type: "Flood", date: "Apr 30, 2026", status: "Analyzed" },
];

function HistoryPage() {
  return (
    <AccountLayout>
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">Document history</h2>
          <p className="mt-1 text-sm text-muted-foreground">Every document you've analyzed. Delete any time.</p>
        </div>
        <ul className="divide-y divide-border">
          {docs.map((d) => (
            <li key={d.name} className="p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground"><FileText className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.type} · {d.date}</p>
              </div>
              <Pill tone={d.status === "Flagged" ? "warning" : "success"}>{d.status}</Pill>
              <Link to="/analysis/$type" params={{ type: "insurance" }} className="text-sm text-orange hover:text-orange/80 font-medium">Open</Link>
            </li>
          ))}
        </ul>
      </div>
    </AccountLayout>
  );
}
