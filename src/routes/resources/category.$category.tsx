import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Section } from "@/components/shared/Section";
import { ARTICLES, RESOURCE_CATEGORIES } from "@/lib/data";
import { Pill } from "@/components/shared/Pill";
import { Clock, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/resources/category/$category")({
  component: CategoryPage,
  loader: ({ params }) => {
    const cat = RESOURCE_CATEGORIES.find((c) => c.slug === params.category);
    if (!cat) throw notFound();
    return cat;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? "Category"} — Florida HomeShield` }],
  }),
});

function CategoryPage() {
  const cat = Route.useLoaderData();
  const articles = ARTICLES.filter((a) => a.categorySlug === cat.slug);
  return (
    <Shell>
      <Section eyebrow={`${articles.length} articles`} title={cat.title} description={cat.description}>
        <Link to="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft className="h-4 w-4" /> All categories
        </Link>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.length === 0 && (
            <p className="text-sm text-muted-foreground">More articles in this category are coming soon.</p>
          )}
          {articles.map((a) => (
            <Link
              key={a.slug}
              to="/resources/article/$slug"
              params={{ slug: a.slug }}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-orange/40 transition-all"
            >
              <div className="aspect-[16/9] overflow-hidden border-b border-border bg-secondary">
                <img
                  src={a.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Pill tone="orange">{a.category}</Pill>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readMinutes} min</span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-foreground group-hover:text-orange transition-colors">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </Shell>
  );
}
