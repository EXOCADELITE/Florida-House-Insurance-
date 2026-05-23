import { createFileRoute } from "@tanstack/react-router";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/account/notifications")({
  component: NotificationsPage,
  head: () => ({ meta: [{ title: "Notifications — Florida HomeShield" }] }),
});

const groups = [
  {
    title: "Renewals & inspections",
    items: [
      { label: "60 days before policy renewal", on: true },
      { label: "Wind mitigation re-inspection due", on: true },
      { label: "4-point expiration warning", on: true },
    ],
  },
  {
    title: "Storm alerts",
    items: [
      { label: "Hurricane watch issued for my county", on: true },
      { label: "Tropical storm warning", on: true },
      { label: "Post-storm scam-chaser alerts", on: true },
    ],
  },
  {
    title: "Educational",
    items: [
      { label: "Weekly resource digest", on: false },
      { label: "New scam alerts in Florida", on: true },
    ],
  },
];

function NotificationsPage() {
  return (
    <AccountLayout>
      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g.title} className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border p-6">
              <h2 className="text-lg font-semibold text-foreground">{g.title}</h2>
            </div>
            <ul className="divide-y divide-border">
              {g.items.map((it) => (
                <li key={it.label} className="p-5 flex items-center justify-between">
                  <p className="text-sm text-foreground">{it.label}</p>
                  <Switch defaultChecked={it.on} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AccountLayout>
  );
}
