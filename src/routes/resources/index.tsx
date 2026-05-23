import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Section } from "@/components/shared/Section";
import { ARTICLES, RESOURCE_CATEGORIES } from "@/lib/data";
import { Pill } from "@/components/shared/Pill";
import { Clock, Search, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/resources/")({
  component: ResourcesIndex,
  head: () => ({ meta: [{ title: "Resource Center — Florida HomeShield" }] }),
});

function ResourcesIndex() {
  const [q, setQ] = useState("");
  const filtered = ARTICLES.filter((a) =>
    !q ? true : (a.title + a.excerpt + a.category).toLowerCase().includes(q.toLowerCase()),
  );
  const featured = ARTICLES.filter((a) => a.featured);
  return (
    <Shell>
      <Section
        eyebrow="Resource center"
        title="Florida homeowner education, written without sales pressure"
        description="Independent guides on insurance, roofing, hurricanes, scams and claims."
      >
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 95 articles — wind mitigation, AOB, roof age, hurricane prep…"
            className="w-full rounded-2xl border border-border bg-card pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
          />
        </div>

        <div className="mt-14">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-bold text-foreground">Browse by category</h2>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCE_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/resources/category/$category"
                params={{ category: c.slug }}
                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-orange/40"
              >
                <p className="text-xs text-muted-foreground">{c.count} articles</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange" />
            <h2 className="text-xl font-bold text-foreground">Featured this week</h2>
          </div>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            {featured.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-xl font-bold text-foreground">All articles</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">No articles match "{q}" yet.</p>
            )}
          </div>
        </div>
      </Section>
    </Shell>
  );
}

function ArticleCard({ article }: { article: typeof ARTICLES[number] }) {
  return (
    <Link
      to="/resources/article/$slug"
      params={{ slug: article.slug }}
      className="group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-orange/40 hover:-translate-y-0.5"
    >
      <div className="aspect-[16/9] overflow-hidden border-b border-border bg-secondary">
        <img
          src={article.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Pill tone="orange">{article.category}</Pill>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readMinutes} min</span>
        </div>
        <h3 className="mt-3 text-base font-semibold text-foreground group-hover:text-orange transition-colors">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
      </div>
    </Link>
  );
}
