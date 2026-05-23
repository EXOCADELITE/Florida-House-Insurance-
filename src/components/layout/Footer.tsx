import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

const cols = [
  {
    title: "Platform",
    links: [
      { to: "/analyzer", label: "Document Analyzer" },
      { to: "/storm-prep", label: "Storm Prep" },
      { to: "/directory", label: "Trusted Help" },
    ],
  },
  {
    title: "Learn",
    links: [
      { to: "/resources", label: "Resource Center" },
      { to: "/resources/category/insurance-education", label: "Insurance Education" },
      { to: "/resources/category/roofing-education", label: "Roofing Education" },
      { to: "/scam-alerts", label: "Scam Alert Center" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/auth/signup", label: "Create account" },
      { to: "/auth/login", label: "Sign in" },
      { to: "/account", label: "Account settings" },
      { to: "/account/history", label: "Document history" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40 mt-24">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-4 max-w-sm">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              An independent platform helping Florida homeowners understand insurance,
              prepare for storms, and avoid contractor scams.
            </p>
            <p className="text-xs text-muted-foreground">
              Florida HomeShield provides educational information only. It is not an
              insurance company, contractor, or licensed adjuster.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{c.title}</h4>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Florida HomeShield. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for Florida homeowners. Not affiliated with any insurer or contractor.
          </p>
        </div>
      </div>
    </footer>
  );
}
