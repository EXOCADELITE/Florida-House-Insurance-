import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import heroBackground from "@/assets/florida-hero-background.png";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <img
        src={heroBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(3,12,26,0.30),rgba(3,12,26,0.62)_54%,rgba(3,12,26,0.86)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/35 to-background/70" />
      <div className="absolute inset-0 bg-grid opacity-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="container-page relative pt-20 pb-20 sm:pt-28 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-6xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-orange" />
            Built independently for Florida homeowners
          </div>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Understand your <span className="text-orange">Florida home insurance</span> before it becomes a problem.
          </h1>
          <p className="mx-auto mt-6 max-w-5xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Upload policies, inspections, and property documents for plain-English explanations, risk analysis,
            and next-step guidance without the sales pressure.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
