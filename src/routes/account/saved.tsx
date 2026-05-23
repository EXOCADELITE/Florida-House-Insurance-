import { createFileRoute, Link } from "@tanstack/react-router";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Bookmark } from "lucide-react";

export const Route = createFileRoute("/account/saved")({
  component: SavedPage,
  head: () => ({ meta: [{ title: "Saved reports — Florida HomeShield" }] }),
});

const saved = [
  { title: "Tampa property — 2026 renewal analysis", date: "May 14, 2026" },
  { title: "Roof replacement decision memo", date: "May 10, 2026" },
  { title: "Hurricane prep checklist (family copy)", date: "May 1, 2026" },
];

function SavedPage() {
  return (
    <AccountLayout>
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">Saved reports</h2>
          <p className="mt-1 text-sm text-muted-foreground">Bookmark analyses to share with your spouse, agent or contractor.</p>
        </div>
        <ul className="divide-y divide-border">
          {saved.map((s) => (
            <li key={s.title} className="p-5 flex items-center gap-4">
              <Bookmark className="h-4 w-4 text-orange" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.date}</p>
              </div>
              <Link to="/analyzer" className="text-sm text-orange hover:text-orange/80 font-medium">Analyze</Link>
            </li>
          ))}
        </ul>
      </div>
    </AccountLayout>
  );
}
