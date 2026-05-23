import { Section } from "@/components/shared/Section";
import { Link } from "@tanstack/react-router";
import { ARTICLES } from "@/lib/data";
import { Clock, ArrowRight } from "lucide-react";
import { Pill } from "@/components/shared/Pill";

export function EducationalPreview() {
  const featured = ARTICLES.filter((a) => a.featured).slice(0, 3);
  return (
    <Section
      eyebrow="Resource center"
      title="Educational content, not contractor marketing"
      description="Independent, footnoted, written by homeowners who've lived through it."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {featured.map((a) => (
          <Link
            key={a.slug}
            to="/resources/article/$slug"
            params={{ slug: a.slug }}
            className="group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-orange/40 hover:-translate-y-0.5"
          >
            <div className="aspect-[16/9] bg-gradient-to-br from-primary/15 via-orange/10 to-secondary border-b border-border" />
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Pill tone="orange">{a.category}</Pill>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readMinutes} min</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-orange transition-colors text-balance">
                {a.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/resources" className="inline-flex items-center text-sm font-medium text-orange hover:text-orange/80">
          Browse all categories <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}
