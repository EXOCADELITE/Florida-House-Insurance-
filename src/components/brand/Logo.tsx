import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-cropped.png";

export function Logo({ withWordmark = false, className = "" }: { withWordmark?: boolean; className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="Florida HomeShield home">
      <img src={logo} alt="Florida HomeShield" className="h-12 w-auto sm:h-16" />
      {withWordmark && (
        <span className="hidden sm:flex flex-col leading-none">
          <span className="text-[15px] font-bold tracking-tight text-navy">Florida</span>
          <span className="text-[15px] font-bold tracking-tight text-orange">HomeShield</span>
        </span>
      )}
    </Link>
  );
}
