# ECHO Stabilization & Recovery Plan

Goal: audit and stabilize the app end-to-end. No redesign, no new features, no backend/auth changes.

## 1. Animations (glitches, replay, bounce, layout shifts)
- Sweep `src/components/landing/*`, `src/components/dashboard/*`, `src/pages/**`, `src/components/rewards/AchievementAnimation.tsx`, `src/components/intelligence/HealthScore/HealthGauge.tsx`.
- Convert every `whileInView` / repeating `motion` into `useInView(ref, { once: true, amount: 0.2 })` + `initial`/`animate` pattern.
- Remove `type: 'spring'` bounces where they cause visible jitter; standardize on `ease: [0.16,1,0.3,1]`, 0.4–0.6s.
- Wrap all `motion` variants with `useReducedMotion()` → skip transforms, keep opacity only.
- Ensure animated containers use `will-change: transform, opacity` only during the transition; avoid animating `height`/layout properties (use `opacity`+`translateY`).
- Guarantee `CountUp` and similar counters run once (ref guard already in `Stats.tsx`; apply the same to other counters in `ContributionStats`, `EnvironmentalStatsWidget`, `RewardsSummaryWidget`).

## 2. Landing page stabilization
- Hero: keep current layout; fix image list, add explicit `width/height` on `<img>` to prevent CLS, add `fetchpriority="eager"` on first slide, keep `loading="lazy"` on rest, ensure fallback gradient always renders under images, verify `useReducedMotion` disables auto-rotate.
- Stats: already stabilized — verify only.
- CoreFeatures / HowItWorks / IntelligenceBento / HazardCategories / CommunityImpact / UpcomingEvents / KnowledgeCenter / Cta: audit each for `whileInView` replay, mobile overflow (`overflow-x-hidden` at section level), and grid breakpoints (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4`).
- Partners was previously deleted per prior memory — leave removed (no re-add).
- Footer: verify all links resolve to existing routes.

## 3. Hero carousel image fix
- Replace any broken Unsplash URLs with verified stable IDs, add `onError` fallback (swap to gradient placeholder), preload first slide via `<link rel="preload" as="image">` in `index.html` only if needed.
- Confirm `loaded[i]` gating still allows first paint (set `loaded[0]=true` optimistically after `onLoad` or on `eager` slide).

## 4. Knowledge Centre images
- `src/components/landing/KnowledgeCenter.tsx` + `src/pages/community/KnowledgeCentre.tsx` + `src/components/dashboard/KnowledgeCentrePreview.tsx` + `src/lib/fallback-articles.ts`: verify every image URL 200s; standardize to reliable Unsplash `?auto=format&fit=crop&w=1200&q=70`; unify `ArticleImage` fallback component and reuse across the three surfaces.

## 5. Routing & links audit
- Cross-check every `<Link to>` / `href` against `src/App.tsx` route table. Known routes: `/`, `/about`, `/contact`, `/faq`, `/auth/login|register|forgot-password`, `/dashboard`, `/report`, `/reports`, `/reports/:id`, `/rewards`, `/notifications`, `/profile`, `/map`, `/ai-intelligence`, `/community-health`, `/analytics`, `/knowledge`, `/knowledge/:slug`, `/community-insights`, `/search`.
- Redirect or fix any stale targets (`/events`, `/dashboard/*` legacy). Remove duplicate route declarations if any.
- Verify Header, Footer, PremiumBottomNav, DashboardLayout sidebar, dashboard widgets, landing CTAs.

## 6. Responsive layout & safe areas
- `DashboardLayout`: keep existing `padding-bottom: calc(env(safe-area-inset-bottom) + 7rem)` + `padding-top: env(safe-area-inset-top)`.
- Add `overflow-x-hidden` to `<body>` in `index.css` to kill horizontal scroll from decorative blurs.
- Audit sticky headers (`Header.tsx`, dashboard header) for `top-0 z-40` + backdrop-blur and iOS notch.
- Fix any fixed-position CTAs that overlap the bottom nav on mobile.
- Ensure long titles wrap (`break-words`) in cards.

## 7. Dead code / unused imports
- Run repo sweep: unused imports flagged by tsgo; delete `src/pages/Dashboard.tsx` and `src/pages/ModulePages.tsx` if unreferenced; remove commented-out blocks; delete unused motion variants.
- Do not remove any component still imported anywhere.

## 8. Rendering perf
- Memoize static arrays declared inside components (move `slides`, `articles`, `stats` to module scope — already done in most).
- Wrap heavy list children with `React.memo` where props are stable.
- Replace inline `style={{}}` recreated per render with Tailwind classes where equivalent.

## 9. Verification
- `bunx tsgo --noEmit` clean.
- `bun run build` succeeds.
- Playwright smoke: load `/`, `/dashboard` (with injected session if available), `/knowledge`, `/map`, `/reports`, `/rewards` at 390x844, 820x1180, 1440x900; screenshot each; check console for errors and network for 4xx/5xx on images.

## 10. Deliverable
- Final chat report listing: issues found (grouped by area), files modified, fixes applied, remaining recommendations.

## Out of scope (won't touch)
- Supabase, auth flows, edge functions, DB schema, business logic, visual redesign, new features, Partners re-add.
