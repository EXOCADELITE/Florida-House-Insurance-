import { Link, useLocation } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { cn } from "@/lib/utils";
import { FileText, Bookmark, Bell, Settings, User } from "lucide-react";

const items = [
  { to: "/account", label: "Profile", icon: User, exact: true },
  { to: "/account/history", label: "Document history", icon: FileText },
  { to: "/account/saved", label: "Saved reports", icon: Bookmark },
  { to: "/account/notifications", label: "Notifications", icon: Bell },
  { to: "/account/settings", label: "Settings", icon: Settings },
];

export function AccountLayout({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  return (
    <Shell>
      <div className="container-page py-12">
        <h1 className="text-3xl font-bold text-foreground">Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, documents and notifications.</p>
        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
          <nav className="space-y-1">
            {items.map((it) => {
              const active = it.exact ? loc.pathname === it.to : loc.pathname.startsWith(it.to);
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  )}
                >
                  <it.icon className="h-4 w-4" /> {it.label}
                </Link>
              );
            })}
          </nav>
          <div>{children}</div>
        </div>
      </div>
    </Shell>
  );
}
