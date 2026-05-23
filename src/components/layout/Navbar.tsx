import { Link, useLocation } from "@tanstack/react-router";
import { Show, UserButton } from "@clerk/tanstack-react-start";
import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/analyzer", label: "Analyzer" },
  { to: "/resources", label: "Resources" },
  { to: "/scam-alerts", label: "Scam Alerts" },
  { to: "/storm-prep", label: "Storm Prep" },
  { to: "/directory", label: "Trusted Help" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const loc = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-24 items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = loc.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Show when="signed-out">
            <Link to="/auth/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Link to="/analyzer" className="hidden sm:block">
            <Button size="sm" className="bg-orange text-white hover:bg-orange/90">
              Analyze documents
            </Button>
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden rounded-md p-2 text-muted-foreground hover:bg-secondary"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-border overflow-hidden"
          >
            <div className="container-page py-3 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Show when="signed-out">
                  <Link to="/auth/login" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">Sign in</Button>
                  </Link>
                </Show>
                <Link to="/analyzer" className="flex-1" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-orange text-white hover:bg-orange/90">Analyze</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
