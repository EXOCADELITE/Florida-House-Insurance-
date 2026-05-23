import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { ARTICLES } from "@/lib/data";
import { Pill } from "@/components/shared/Pill";
import { Callout } from "@/components/shared/Callout";
import { Checklist } from "@/components/shared/Checklist";
import { Clock, ChevronLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources/article/$slug")({
  component: ArticlePage,
  loader: ({ params }) => {
    const a = ARTICLES.find((x) => x.slug === params.slug);
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Article"} — Florida HomeShield` },
      { name: "description", content: loaderData?.excerpt ?? "" },
      { property: "og:title", content: loaderData?.title ?? "" },
      { property: "og:description", content: loaderData?.excerpt ?? "" },
      { property: "og:type", content: "article" },
    ],
  }),
});

function ArticlePage() {
  const a = Route.useLoaderData();
  const related = ARTICLES.filter((x) => x.categorySlug === a.categorySlug && x.slug !== a.slug).slice(0, 3);
  return (
    <Shell>
      <article className="container-page max-w-3xl py-16">
        <Link to="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Resource Center
        </Link>
        <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
          <Pill tone="orange">{a.category}</Pill>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readMinutes} min read</span>
          <span>· {a.publishedAt}</span>
        </div>
        <h1 className="mt-5 text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">{a.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{a.excerpt}</p>

        <div className="mt-10 aspect-[16/8] overflow-hidden rounded-3xl border border-border bg-secondary">
          <img src={a.image} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="mt-10 prose-fhs">
          <p className="text-base leading-relaxed text-foreground">
            Florida's home insurance market behaves differently from the rest of the country. Coverage availability,
            renewal logic and underwriting all depend on a handful of property characteristics — and {a.tags[0]} is
            usually near the top of the list.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            In this guide we'll walk through what underwriters actually look at, what's negotiable, and which steps
            consistently move the needle for Florida homeowners.
          </p>

          <Callout tone="warning" title="Why this matters in Florida" className="mt-8">
            More than 11 carriers exited the Florida market between 2021 and 2024. The carriers that remain underwrite
            tightly — small flags now create renewal risk that wouldn't have triggered a phone call five years ago.
          </Callout>

          <h2 className="mt-12 text-2xl font-bold text-foreground">What underwriters actually evaluate</h2>
          <Checklist
            className="mt-5"
            items={[
              { label: "Roof age, material and remaining useful life" },
              { label: "Wind mitigation credits and inspection recency" },
              { label: "4-point pass/fail status — electrical, plumbing, HVAC, roof" },
              { label: "Open claims and prior loss history" },
              { label: "Distance to coast and FEMA flood zone classification" },
            ]}
          />

          <h2 className="mt-12 text-2xl font-bold text-foreground">FAQs</h2>
          <FAQ
            items={[
              { q: "Does this apply to condos and townhomes?", a: "Most concepts apply, but condo HO-6 policies and the master association policy have different rules. We cover both in the Insurance Education category." },
              { q: "Will fixing one item save my renewal?", a: "Sometimes — particularly roof condition. Often the issue is cumulative, and improving 2–3 items together moves underwriting decisions." },
              { q: "Should I switch carriers proactively?", a: "Not necessarily. Re-shop 60 days before renewal, but factor in tenure-based loyalty discounts and reinstatement waiting periods." },
            ]}
          />

          <Callout tone="info" title="What to do next" className="mt-10">
            Upload your declaration page and most recent wind mitigation inspection in the{" "}
            <Link to="/analyzer" className="text-orange font-medium hover:underline">Document Analyzer</Link>. You'll get
            a property-specific report with concrete next steps.
          </Callout>
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-6">
          <p className="text-sm font-semibold text-foreground">{a.author}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The HomeShield editorial team is composed of former insurance underwriters, public adjusters and Florida
            homeowners writing without sponsorship from carriers or contractors.
          </p>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-foreground">Related reading</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/resources/article/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-2xl border border-border bg-card p-4 hover:border-orange/40 transition-colors"
                >
                  <div className="mb-3 aspect-[16/9] overflow-hidden rounded-xl bg-secondary">
                    <img src={r.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <p className="text-xs text-muted-foreground">{r.readMinutes} min</p>
                  <p className="mt-1 text-sm font-semibold text-foreground line-clamp-3">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </Shell>
  );
}

function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card divide-y divide-border">
      {items.map((it, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="text-sm font-medium text-foreground">{it.q}</span>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open === i && "rotate-180")} />
          </button>
          {open === i && <div className="px-5 pb-5 text-sm text-muted-foreground">{it.a}</div>}
        </div>
      ))}
    </div>
  );
}
