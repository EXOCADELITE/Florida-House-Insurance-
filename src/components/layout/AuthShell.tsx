import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative">
          <Logo className="[&_span]:text-primary-foreground" withWordmark={false} />
        </div>
        <div className="relative max-w-md">
          <p className="text-2xl font-semibold leading-snug text-balance">
            "Florida HomeShield turned a 90-page insurance policy into three things I actually understood — and I caught two missing wind credits worth $480 a year."
          </p>
          <p className="mt-6 text-sm opacity-80">Marcela R. · Sarasota, FL</p>
        </div>
        <p className="relative text-xs opacity-60">© {new Date().getFullYear()} Florida HomeShield</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8 space-y-4">{children}</div>
          {footer && <div className="mt-8 text-sm text-muted-foreground">{footer}</div>}
          <p className="mt-10 text-xs text-muted-foreground">
            By continuing you agree to our <Link to="/" className="hover:text-foreground underline">Terms</Link> and{" "}
            <Link to="/" className="hover:text-foreground underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
