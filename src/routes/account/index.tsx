import { createFileRoute } from "@tanstack/react-router";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account/")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Account — Florida HomeShield" }] }),
});

function ProfilePage() {
  return (
    <AccountLayout>
      <div className="rounded-2xl border border-border bg-card p-7">
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Personal information and primary property.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div><Label>Full name</Label><Input defaultValue="Jane Hernandez" className="mt-1.5" /></div>
          <div><Label>Email</Label><Input defaultValue="jane@example.com" className="mt-1.5" /></div>
          <div className="sm:col-span-2"><Label>Primary property</Label><Input defaultValue="1428 Bayshore Dr, Tampa, FL 33606" className="mt-1.5" /></div>
        </div>
        <div className="mt-6 flex justify-end"><Button className="bg-orange text-white hover:bg-orange/90">Save changes</Button></div>
      </div>
    </AccountLayout>
  );
}
