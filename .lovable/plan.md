
# ECHO Premium UI/UX Transformation

This is a large, multi-phase visual refresh of an already-working app. I'll work **incrementally**, preserving every route, feature, hook, Supabase call, and business rule. Only presentation-layer files change.

---

## Phase 1 — Design System Foundation (touched first, powers everything else)

**Files:** `src/index.css`, `tailwind.config.ts` (if present), a new `src/lib/design-tokens.ts` only if needed.

- Introduce semantic HSL tokens for the ECHO palette:
  - `--forest` (primary), `--emerald`, `--sky`, `--amber`, `--coral`
  - Surfaces: `--surface`, `--surface-elevated`, `--surface-glass`
  - Gradients: `--gradient-forest`, `--gradient-sky`, `--gradient-aurora`
  - Shadows: `--shadow-soft`, `--shadow-elevated`, `--shadow-glow`
- Keep existing `--primary` mapped to forest green so no component breaks.
- Add utility classes: `.glass-card`, `.premium-card`, `.stat-card`, `.bento-tile` — used by new sections without editing shadcn primitives.
- Typography scale tightened; add display font pairing via `<link>` in `index.html` (no new dep).

## Phase 2 — Landing Page (compact + premium)

Edit **only** landing components; keep `LandingPage.tsx` section order intact where possible, remove/replace only what the brief calls out.

- **Hero** (`Hero.tsx`): keep carousel infra but replace slide copy with concise ECHO messaging; enforce single H1, 2-line subtitle, primary CTA "Report Hazard" → `/report`, secondary "Track My Reports" → `/reports`.
- **Stats** (`Stats.tsx`): collapse to 4 premium stat cards (Reports Submitted, Cases Resolved, Environmental Health Score, Active Communities) with icon + count-up.
- **CoreFeatures**: enforce exactly 6 cards (AI Intelligence, Community Reporting, GIS Mapping, Government Collaboration, Analytics, Rewards & Impact).
- **HowItWorks**: 4 concise steps.
- **AiPreview / MapPreview / CommunityHealth**: consolidate into one Bento preview component `IntelligenceBento.tsx` (map tile, AI insights tile, health score tile, active incidents tile). Remove the three separate sections from `LandingPage.tsx`.
- **CommunityImpact**: replace placeholder testimonials with "Community Impact Highlights" grid.
- **Partners** (`Partners.tsx`): rename to "Technology Stack" and swap placeholder logos for real tech icons (React, Supabase, Leaflet, Tailwind, Recharts, Lovable AI) — no fake partners.
- **Cta**: keep, restyle with gradient + glassmorphism.
- **Footer** (`Footer.tsx`): trim to compact premium footer with the exact link set requested (About, Features, Resources, Contact, FAQ, Privacy, Terms, Cookie, Accessibility, Social, ©). Replace hardcoded `bg-gray-900 text-white` with semantic tokens.

## Phase 3 — Dashboard (Bento consolidation, no feature loss)

Edit `src/pages/citizen/Dashboard.tsx` and add **wrapper** widgets that reuse existing ones (no logic changes).

- Rename H1 "Command Center" → **"Environmental Intelligence"** (brief explicitly forbids "Command Center").
- Add persistent floating/pinned **Report Hazard** CTA in the dashboard header (always visible).
- New composite widgets that *compose* existing ones (no data-layer rewrite):
  - `EnvironmentalConditionsCard` — wraps existing weather/air/water summary widgets in tabs.
  - `CommunityEngagementCard` — wraps `CommunityActivityWidget` + `VolunteerWidget` in tabs.
  - `EnvironmentalIntelligenceCard` — wraps `RecentReports` + `AnalyticsSection` summaries with "View Reports" / "Open Analytics" links (Reports page untouched).
  - `AlertCenterCard` — wraps `NotificationsWidget` with a critical-alerts strip on top.
  - `AIIntelligenceCard` — wraps `AISummaryWidget` insights/trends/recommendations tabs.
- Re-layout with a balanced 12-col Bento so above-the-fold shows: Intelligence hero tile, Alert Center, Quick Actions, Report CTA. Secondary rows: Conditions, Engagement, Rewards, Leaderboard.

## Phase 4 — Global Polish

- Add `LoadingSkeleton`, `EmptyState`, `ErrorState` primitives under `src/components/ui/states.tsx` and swap in the most-visible pages.
- Standardize card padding/radius/shadow via the new `.premium-card` utility.
- Fix known layout jumps: `min-h-*` on widgets that fetch async, `h-dvh` instead of `h-screen` where relevant.
- A11y: `aria-label` on icon buttons, ensure Amber vs Coral have icons+text (not color-only).

## Phase 5 — Redeploy (clean)

- Confirm current `package.json` has `build:dev`.
- Run `rm -rf node_modules/.vite dist` then `bun install` then `bun run build` locally in the sandbox to prove a cold rebuild succeeds.
- Then invoke `preview_ui--publish` (which always deploys from the current committed project state — Lovable does not reuse cached artifacts across publishes).
- Smoke-check `/`, `/dashboard`, `/map`, `/ai-intelligence`, `/community-health` via headless Chromium after build; report any console errors.

---

## Explicit non-goals (per your rules)

- No routing, auth, Supabase, backend, schema, or business-logic changes.
- No feature removals — every existing widget stays mounted somewhere; consolidated widgets are wrappers, not rewrites.
- No new heavy deps; no bundle-size regressions.
- Keep "ECHO — Environmental Community Health Observatory" naming everywhere; purge militarized terms.

## Technical notes

- All colors go through HSL semantic tokens in `index.css`; components use `bg-primary`, `text-foreground`, `.premium-card`, etc. No `text-white`/`bg-gray-900` literals in new/edited files.
- Composite dashboard widgets are pure presentational wrappers — they import and render the existing widget components with a shared shell, so no hook or data-fetch changes.
- Font pairing added via preconnect + `<link>` in `index.html` — zero JS cost.
- Estimated diff: ~15 landing/dashboard files edited, ~4 new wrapper components, 1 CSS token pass. No files deleted.

Reply **approve** and I'll execute Phases 1→5 in order, or tell me which phase to skip/reorder.
