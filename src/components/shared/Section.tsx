import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  align = "left",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-24", className)}>
      <div className="container-page">
        {(eyebrow || title || description) && (
          <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
                {description}
              </p>
            )}
          </div>
        )}
        {children && <div className={cn(title && "mt-12 sm:mt-16")}>{children}</div>}
      </div>
    </section>
  );
}
