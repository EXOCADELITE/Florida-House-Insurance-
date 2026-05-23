import { createFileRoute } from "@tanstack/react-router";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — Florida HomeShield" }] }),
});

function SettingsPage() {
  return (
    <AccountLayout>
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage password and two-factor authentication.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="outline">Change password</Button>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Data & privacy</h2>
          <p className="mt-1 text-sm text-muted-foreground">Export or delete every document and report linked to your account.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="outline">Export my data</Button>
            <Button variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/10">Delete account</Button>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
