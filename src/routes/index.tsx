import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Hero } from "@/components/landing/Hero";
import { AnalyzerContent } from "@/routes/analyzer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Florida HomeShield — Understand your insurance. Protect your home." },
      {
        name: "description",
        content:
          "Upload Florida home insurance policies, inspections and contractor estimates for plain-English explanations, risk analysis and next-step guidance.",
      },
    ],
  }),
});

function Index() {
  return (
    <Shell>
      <Hero />
      <AnalyzerContent />
    </Shell>
  );
}
