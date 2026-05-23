# Florida HomeShield

A modern Florida homeowner platform that helps users understand insurance, inspections,
roof and property risks, hurricane prep, contractor scams, and find trusted help.

## Stack

- **TanStack Start** (Vite + React 19 + TypeScript) — file-based routing with SSR-ready head metadata
- **Tailwind CSS v4** with oklch design tokens
- **shadcn/ui** primitives (Radix-based)
- **Framer Motion** for tasteful, calm animation
- **Lucide** icons

> Note: The original brief requested Next.js. This sandbox scaffolds TanStack Start, which
> uses the same React 19 component model, file-based routes, head metadata, and SSR story.
> Migrating to Next.js later means moving routes from `src/routes/*.tsx` to `app/**/page.tsx`
> with minimal component refactor — components are framework-agnostic React.

## Folder structure

```
src/
  assets/                Brand assets (logo)
  components/
    brand/               Logo
    landing/             Landing page sections (Hero, RiskCategories, etc.)
    layout/              Shell, Navbar, Footer, AuthShell, AccountLayout
    shared/              Section, Pill, Callout, Checklist, Timeline
    upload/              DropZone (drag & drop with progress + states)
    ui/                  shadcn/ui primitives
  lib/
    data.ts              Mock content (articles, scam alerts, providers, etc.)
    theme.tsx            Light/dark theme provider (localStorage backed)
    utils.ts             cn() helper
  routes/
    __root.tsx           Root layout, meta, providers
    index.tsx            Landing page
    analyzer.tsx         Document Analyzer with 6 doc types
    dashboard.tsx        Homeowner dashboard (risk, property, alerts, timeline)
    resources/
      index.tsx          Resource Center
      category.$category.tsx
      article.$slug.tsx  Article with FAQ, callouts, checklists, related reading
    scam-alerts.tsx      Scam Alert Center
    storm-prep.tsx       Hurricane prep system (3 phases)
    directory.tsx        Trusted Help directory with type filtering
    auth/
      login.tsx
      signup.tsx
    onboarding.tsx       3-step onboarding wizard
    account/
      index.tsx          Profile
      history.tsx        Document history
      saved.tsx          Saved reports
      notifications.tsx  Notification preferences
      settings.tsx       Security + data privacy
    analysis/
      $type.tsx          Mock AI analysis screens (insurance/roof/deductible/mitigation)
  styles.css             Tokens + globals (Tailwind v4 @theme inline)
```

## Design system

- **Navy** `var(--navy)` — primary brand, calm authority
- **Florida orange** `var(--orange)` — CTAs and accents
- **Warm sand** background, white cards, soft shadows
- 14px–18px body, 36–60px display, balanced text, generous spacing
- Dark mode preserves brand contrast — navy canvas, orange accent

All tokens live in `src/styles.css` under `:root` and `.dark`.

## Future automation preparation

The following integration points are marked with `// FUTURE:` comments in code:

| Touchpoint                       | File(s)                                  |
| -------------------------------- | ---------------------------------------- |
| OCR + document parsing            | `src/components/upload/DropZone.tsx`     |
| AI summarization (Lovable AI)     | `src/routes/analyzer.tsx`, `src/routes/analysis/$type.tsx` |
| Auth (Lovable Cloud / Supabase)   | `src/routes/auth/login.tsx`, `src/routes/auth/signup.tsx` |
| Risk scoring engine               | `src/routes/dashboard.tsx`               |
| Insurance analysis engine         | `src/routes/analysis/$type.tsx`          |
| Contractor routing                | `src/routes/directory.tsx`               |
| Storm checklist PDF generation    | `src/routes/storm-prep.tsx`              |

Recommended Lovable Cloud schema (for future enablement):

- `profiles` (id, name, primary_property_id)
- `properties` (id, address, year_built, sqft, carrier, renewal_date, …)
- `documents` (id, property_id, type, storage_key, status, parsed_at)
- `analyses` (id, document_id, summary, sections jsonb, insights jsonb)
- `alerts` (id, property_id, kind, severity, body, resolved_at)

## SEO

Every route declares a `head()` with `title` and `description`. The article route adds
`og:title`, `og:description`, and `og:type="article"`. Use the SEO scanner in the
Lovable workspace to verify.

## Scripts

```bash
bun dev      # local dev
bun build    # production build
bun preview  # preview built app
```

## Deployment

The scaffold is preconfigured for Cloudflare via `@cloudflare/vite-plugin` and `wrangler.jsonc`.
For other targets, swap the deploy step — the React/Tailwind/Motion code is unchanged.
