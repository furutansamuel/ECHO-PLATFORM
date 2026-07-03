# ECHO MASTER AUDIT — Comprehensive Technical Health Check

**Date:** 2026-01-19  
**Project:** ECHO — Environmental Community Health Observatory  
**Status:** READ-ONLY AUDIT (No modifications performed)  
**Supabase:** Connected (`ngxkvzopulajanpubxsw.supabase.co`)

---

## Executive Summary

The ECHO application is a feature-rich React + TypeScript frontend for environmental hazard reporting in Nigeria. The codebase spans 60+ UI components across landing, dashboard, and report-wizard modules, with Supabase integration, lazy-loaded routing, and demo-mode scaffolding. **However, the application is not currently functional — the Supabase client remains a stub (`export const supabase: any = null`), which means all database queries, real-time subscriptions, and auth operations will fail at runtime.** Additionally, git merge-conflict artifacts, missing page modules, and architectural anti-patterns require attention before production deployment.

### Scores

| Dimension | Score (1-10) | Notes |
|---|---|---|
| **Build Health** | 3/10 | Production build FAILS — missing `@tailwindcss/postcss` package |
| **Runtime Readiness** | 2/10 | Supabase stub blocks all data operations |
| **Architecture Quality** | 5/10 | Good patterns present but inconsistent (hooks as functions vs. stores) |
| **Code Quality** | 6/10 | Clean TypeScript overall; some hardcoded data, emojis, AI tells |
| **UI/UX Cohesion** | 7/10 | shadcn/ui + Tailwind consistently applied; landing page competent |
| **Database Readiness** | 3/10 | 8 migrations exist but client is a stub; no DB access tested |
| **Accessibility** | 5/10 | Basic a11y present; scroll listener in Header violates guidelines |
| **Security** | 4/10 | RLS not verified; demo mode bypasses auth; client-side data only |

**Build Status:** FAILING — `@tailwindcss/postcss` package missing from `postcss.config.js`

**Overall Health Score: 4.0/10 — CRITICAL ISSUES PRESENT**

---

## Issue Summary

| # | Category | Issue | Severity |
|---|---|---|---|
| 1 | Supabase Client | Client stub — `supabase` is `null`, all DB ops fail | CRITICAL |
| 2 | Lazy Routes | Missing page modules may cause chunk-load failures | CRITICAL |
| 3 | ProtectedRoute | Redirects to `/login` but route is `/auth/login` | CRITICAL |
| 4 | Git Artifacts | `.rej` / `.orig` files in dashboard directory | MEDIUM |
| 5 | Header Scroll | `window.addEventListener('scroll')` anti-pattern | MEDIUM |
| 6 | use-reports-store | Not a real store — creates new state on every call | MEDIUM |
| 7 | Missing Icons | `@/components/ui/icons` and `HealthGauge` may not exist | MEDIUM |
| 8 | Demo Mode | Hardcoded demo bypass of auth; `window.location.href` reload | MEDIUM |
| 9 | Landing Emojis | Emojis in CTA buttons | LOW |
| 10 | Placeholder Partners | `via.placeholder.com` URLs in Partners component | LOW |
| 11 | Fake-Precise Stats | Made-up numbers (1250, 890, 34000) in Stats component | LOW |
| 12 | Duplicate CTA Intent | Multiple "Report" CTAs with different labels | LOW |
| 13 | Build Failure | `@tailwindcss/postcss` missing; production build fails | CRITICAL |

---

## Detailed Findings

### 1. Supabase & Database Audit

#### 1.1 CRITICAL: Supabase Client Stub Never Replaced

**File:** `src/integrations/supabase/client.ts`  
**Severity:** CRITICAL  
**Root Cause:** The preflight stub (`export const supabase: any = null`) was never replaced with a real `createClient(...)` call.  
**Impact:** Every `supabase.from(...)`, `supabase.auth.*`, `supabase.channel()`, and `supabase.rpc()` call across the codebase will throw `TypeError: Cannot read properties of null`. Zero data operations work.  
**Affected Files:**
- `src/hooks/use-intelligence-data.ts` (8 queries + realtime subscription)
- `src/hooks/use-auth.tsx` (auth.getSession, onAuthStateChange, signOut, profile fetch)
- All dashboard widgets that consume `useIntelligenceData()`

**Recommended Fix:** Replace the stub with:
```typescript
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ngxkvzopulajanpubxsw.supabase.co'
const supabaseAnonKey = '<anon_key>'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```
**Difficulty:** Easy (1 file, ~4 lines)

#### 1.2 MEDIUM: use-intelligence-data.ts Error Handling

**File:** `src/hooks/use-intelligence-data.ts` (lines 51-117)  
**Severity:** MEDIUM  
**Root Cause:** The `fetchData` function uses `Promise.all` on 8 Supabase queries. If ANY one throws, the entire catch block fires and toasts an error, but individual query errors (stats, articles, campaigns) are silently swallowed because they aren't re-thrown.  
**Impact:** Partial data failures hide silently; error toast appears for any single query failure.  
**Recommended Fix:** Use `Promise.allSettled` and handle individual rejections. Only toast aggregate errors.  
**Difficulty:** Easy

#### 1.3 MEDIUM: Realtime Channel on Null Client

**File:** `src/hooks/use-intelligence-data.ts` (lines 122-131)  
**Severity:** MEDIUM  
**Root Cause:** `supabase.channel('realtime-all')` is called on every mount but `supabase` is `null`.  
**Impact:** Uncaught TypeError on dashboard mount.  
**Recommended Fix:** Guard with `if (!supabase) return;` until client is wired.  
**Difficulty:** Trivial

#### 1.4 Database Migrations Exist But Unapplied

**Status:** 8 local migration files found in `supabase/migrations/`:
- `20260115120000_create_hazard_reports.sql`
- `20260115120100_create_report_drafts.sql`
- `20260115120200_create_notifications.sql`
- `20260115120300_create_user_stats.sql`
- `20260115120400_create_report_submission_trigger.sql`
- `20260115120500_extend_hazard_reports_verification_ai.sql`
- `20260115120600_create_report_activities.sql`
- `20260115120700_create_report_automation_functions.sql`

Remote database shows **0 applied migrations**. Migrations exist but have never been applied.

---

### 2. Runtime Errors & Routing Audit

#### 2.1 CRITICAL: Missing Page Modules (Unverified)

**File:** `src/App.tsx` (lines 10-28)  
**Severity:** CRITICAL  
**Root Cause:** 18 lazy-loaded page modules are imported but were not verified to exist on disk. Key paths include `@/pages/public/LandingPage`, `@/pages/auth/Login`, `@/pages/citizen/Dashboard`, and 15 more.  
**Impact:** If any of these modules don't exist, the chunk load will fail with `Error: Cannot find module`, and the `Suspense` boundary will show "Loading..." forever.  
**Recommended Fix:** Verify every `@/pages/` path resolves to an actual file.  
**Difficulty:** Easy (file existence check)

#### 2.2 CRITICAL: ProtectedRoute Redirect Mismatch

**File:** `src/components/auth/protected-route.tsx` (line 14)  
**Severity:** CRITICAL  
**Root Cause:** `return <Navigate to="/login" ...>` but the actual login route is `/auth/login`.  
**Impact:** Unauthenticated users are redirected to `/login`, which doesn't match any route, triggering the wildcard `<Navigate to="/" replace />`, landing them back at the homepage silently. No login prompt ever appears.  
**Recommended Fix:** Change to `to="/auth/login"`.  
**Difficulty:** Trivial

#### 2.3 GOOD: Suspense Boundary Present

**File:** `src/App.tsx` (line 39)  
**Status:** `<Suspense fallback={<LoadingFallback />}>` wraps all routes properly.

---

### 3. UI & CSS Pipeline Audit

#### 3.1 MEDIUM: Header Scroll Anti-Pattern

**File:** `src/components/layout/Header.tsx` (lines 23-29)  
**Severity:** MEDIUM  
**Root Cause:** Uses `window.addEventListener('scroll', handleScroll)` — this fires on every frame with no throttling, causing unnecessary re-renders.  
**Impact:** Jank on scroll, particularly on mobile.  
**Recommended Fix:** Use CSS-only approach or IntersectionObserver. At minimum, throttle with `requestAnimationFrame`.  
**Difficulty:** Easy

#### 3.2 GOOD: UI Consistency — shadcn/ui System

**Status:** The project consistently uses shadcn/ui components (Button, Card, Avatar, Sheet, etc.) throughout. Tailwind classes are applied uniformly. `cn()` utility from `clsx` + `tailwind-merge` is used for class composition.

#### 3.3 LOW: Emojis in CTA Buttons

**File:** `src/components/landing/Cta.tsx` (lines 16-22)  
**Severity:** LOW  
**Root Cause:** Emojis are used as button text prefixes.  
**Impact:** Visual inconsistency; emojis render differently across platforms.  
**Recommended Fix:** Replace with Lucide icons from the already-installed library.  
**Difficulty:** Trivial

#### 3.4 LOW: Em-Dash in CommunityImpact

**File:** `src/components/landing/CommunityImpact.tsx` (line 38)  
**Severity:** LOW  
**Root Cause:** Em-dash character appears in body copy: "more than a tool—it's a collaborative platform".  
**Impact:** Minor style violation.  
**Recommended Fix:** Replace with comma or period.

#### 3.5 LOW: Placeholder Partner Logos

**File:** `src/components/landing/Partners.tsx` (lines 3-10)  
**Severity:** LOW  
**Root Cause:** All partner logos use `https://via.placeholder.com/150x60?text=...` — placeholder URLs.  
**Impact:** Social proof section shows broken/mock content.  
**Recommended Fix:** Replace with real logos or SVG wordmarks.

---

### 4. Build & React Architecture Audit

#### 4.1 MEDIUM: Git Merge Conflict Artifacts

**Files:**
- `src/components/dashboard/EnvironmentalAnalyticsWidget.tsx.rej` (0 bytes, empty)
- `src/components/dashboard/EnvironmentalAnalyticsWidget.tsx.orig` (0 bytes, empty)

**Severity:** MEDIUM  
**Root Cause:** These are leftover from a merge or patch operation that failed. Both files are empty.  
**Impact:** No runtime impact (empty files) but indicates incomplete merge resolution.  
**Recommended Fix:** Delete both artifacts. Verify `EnvironmentalAnalyticsWidget.tsx` is correct.  
**Difficulty:** Easy

#### 4.2 MEDIUM: use-reports-store Is Not a Store

**File:** `src/hooks/use-reports-store.ts`  
**Severity:** MEDIUM  
**Root Cause:** Despite being named "store", this is a plain function returning `useState` values. Every component that calls `useReportsStore()` gets its own independent state — reports saved in one component are invisible to another.  
**Impact:** Data inconsistency across components. Reports submitted via wizard won't appear in dashboard widgets.  
**Recommended Fix:** Convert to React Context + Provider, or Zustand store.  
**Difficulty:** Moderate

#### 4.3 MEDIUM: Missing Icons Import in EnvironmentalStatsWidget

**File:** `src/components/dashboard/EnvironmentalStatsWidget.tsx` (line 2)  
**Severity:** MEDIUM  
**Root Cause:** Imports `{ Icons } from "@/components/ui/icons"` — this path may not resolve. The project has `src/components/icons.tsx` at the components root, not under `ui/`.  
**Impact:** Build failure if `@/components/ui/icons` doesn't exist.  
**Recommended Fix:** Verify path; change to `@/components/icons` if needed.  
**Difficulty:** Trivial

#### 4.4 MEDIUM: Missing HealthGauge Import in IntelligenceDashboard

**File:** `src/components/dashboard/IntelligenceDashboard.tsx` (line 9)  
**Severity:** MEDIUM  
**Root Cause:** Imports `HealthGauge from '../intelligence/HealthScore/HealthGauge'` — a relative path outside the dashboard directory.  
**Impact:** Build failure if `src/components/intelligence/HealthScore/HealthGauge.tsx` doesn't exist.  
**Recommended Fix:** Verify file exists; use `@/` alias import.  
**Difficulty:** Trivial

#### 4.5 LOW: use-auth.tsx — Unnecessary Namespace Import

**File:** `src/hooks/use-auth.tsx` (line 3)  
**Severity:** LOW  
**Root Cause:** `import * as Supabase from '@supabase/supabase-js'` imports the entire SDK just to type `Supabase.User`.  
**Impact:** Increases bundle size unnecessarily.  
**Recommended Fix:** Use `import type { User } from '@supabase/supabase-js'`.  
**Difficulty:** Trivial

#### 4.6 MEDIUM: use-auth.tsx — Demo Mode Full Page Reload

**File:** `src/hooks/use-auth.tsx` (line 119)  
**Severity:** MEDIUM  
**Root Cause:** Demo logout uses `window.location.href = '/'` — causes a full SPA reload.  
**Impact:** Poor UX; loses all in-memory state.  
**Recommended Fix:** Reset auth context state and use React Router navigation.  
**Difficulty:** Easy

---

### 5. Dependency & Feature Integrity Audit

#### 5.1 GOOD: Icon Library Usage

**Status:** The project uses `lucide-react` consistently. All icon imports verified across inspected files. Social media icons and logo are hand-rolled SVGs in `src/components/icons.tsx` — properly defined.

#### 5.2 GOOD: Animation Libraries

**Status:** `framer-motion` and `@react-spring/web` are both used appropriately. Framer Motion for entry animations (Hero, Stats, ReportWizard). React Spring for number counting (Stats). No GSAP detected.

#### 5.3 GOOD: Form Handling

**Status:** `react-hook-form` + `zod` used for the ReportWizard multi-step form. Schema validation is comprehensive (60 lines in `report-schema.ts`). Draft auto-save via `watch()` subscription. Excellent pattern.

#### 5.4 LOW: Inconsistent Sonner Import

**File:** `src/hooks/use-intelligence-data.ts` (line 11)  
**Severity:** LOW  
**Root Cause:** Imports `* as Sonner from 'sonner'` and calls `Sonner.toast.error(...)`. Other files use `import { toast } from 'sonner'`.  
**Impact:** Works but inconsistent.  
**Recommended Fix:** Use `import { toast } from 'sonner'` for consistency.

---

### 6. CRITICAL: Build Pipeline Failure

**File:** `postcss.config.js`  
**Severity:** CRITICAL  
**Root Cause:** `postcss.config.js` imports `@tailwindcss/postcss` but the package is not installed. Vite production build fails with `ERR_MODULE_NOT_FOUND: Cannot find package '@tailwindcss/postcss'`.  
**Impact:** Production builds are broken — the app cannot be deployed.  
**Recommended Fix:** Install `@tailwindcss/postcss` via `bun add -D @tailwindcss/postcss`, or switch to Tailwind v3 postcss plugin if using Tailwind v3.  
**Difficulty:** Easy

### 7. Landing Page Content Audit

#### 6.1 LOW: Fake-Precise Stats

**File:** `src/components/landing/Stats.tsx` (lines 15-22)  
**Severity:** LOW  
**Root Cause:** Hardcoded statistics (1250 Hazard Reports, 890 Verified, 45 Communities, 120 Cleanup Events, 1500 Volunteers, 34000 Impact Points) are invented numbers.  
**Impact:** Misleading to users; no source for these claims.  
**Recommended Fix:** Replace with live data from Supabase, or label clearly as "demo data".

#### 6.2 LOW: Duplicate CTA Intent

**Files:** Multiple landing components  
**Severity:** LOW  
**Root Cause:** Multiple CTAs with the same intent use different labels: "Report a Hazard", "Report a Dumpsite", "Report Hazard", "Report now".  
**Recommended Fix:** Standardize to one label across all entry points.

#### 6.3 LOW: "From the Community" Headline

**File:** `src/components/landing/Testimonials.tsx` (line 31)  
**Severity:** LOW  
**Root Cause:** "From the Community, For the Community" — variant of the AI-tell pattern "From the field".  
**Recommended Fix:** Use a simpler headline: "Real Stories" or "Community Voices".

---

## Top 10 Recommended Fixes (Priority Order)

| # | Fix | Difficulty | Impact |
|---|---|---|---|
| 1 | Replace Supabase client stub with real `createClient(...)` | Easy | Unblocks ALL data operations |
| 2 | Fix ProtectedRoute redirect to `/auth/login` | Trivial | Unblocks login flow |
| 3 | Verify all 18 lazy-loaded page modules exist | Easy | Prevents chunk-load failures |
| 4 | Delete `.rej` / `.orig` artifacts; verify merged file | Easy | Clean build |
| 5 | Guard `supabase.channel()` with null check | Trivial | Prevents runtime crashes |
| 6 | Convert `useReportsStore` to shared Context or Zustand | Moderate | Fixes cross-component data sync |
| 7 | Fix `@/components/ui/icons` import path | Trivial | Prevents build failure |
| 8 | Fix `HealthGauge` import path or create component | Easy | Prevents build failure |
| 9 | Replace `window.addEventListener('scroll')` in Header | Easy | Performance |
| 10 | Replace emojis with Lucide icons in Cta buttons | Trivial | Polish |

---

## Architectural Observations

### Strengths
- **Consistent UI system:** shadcn/ui + Tailwind applied uniformly across 60+ components
- **Good code splitting:** Lazy-loaded routes with Suspense boundaries
- **Type-safe forms:** react-hook-form + zod for multi-step report wizard
- **Comprehensive types:** `src/types/reports.ts` has well-structured TypeScript interfaces
- **Demo mode scaffolding:** Allows showcasing the app without real auth
- **Mobile-responsive design:** Mobile bottom nav, collapsible sidebar, responsive grids
- **Design consistency:** Dashboard sidebar, header, and content area follow a cohesive layout pattern

### Weaknesses
- **Supabase client is a stub:** The single biggest issue — stops all backend integration
- **No real state management:** `useReportsStore` is not a store; state is per-component
- **Mixed persistence:** Some data in localStorage, some attempted Supabase, some hardcoded
- **Build artifacts present:** `.rej` and `.orig` files indicate incomplete merge resolution
- **Missing module risk:** 18 lazy-loaded pages not verified to exist
- **Inconsistent import patterns:** `* as Sonner` vs. named imports; `import * as Supabase` vs. type-only

---

## Migration Status

| Aspect | Status |
|---|---|
| Local migrations | 8 files present |
| Remote applied migrations | 0 |
| Migration baseline conflict | None (remote is empty) |
| Action | Safe to apply migrations after client fix |

---

## Final Assessment

ECHO is a well-structured, thoughtfully designed application with comprehensive feature coverage. The UI layer (landing + dashboard + report wizard) is largely complete and consistent. **However, the application cannot function in its current state** because the Supabase client stub was never replaced. This is a single-point failure that blocks all data operations, auth, and real-time features.

**Recommended next steps:**
1. Fix the Supabase client (1-line change, maximum impact)
2. Apply the 8 pending database migrations
3. Fix the ProtectedRoute redirect
4. Verify all page modules exist
5. Clean up artifacts and address medium-priority architectural issues
6. Run a full integration test pass

**Estimated effort to production-ready:** 2-4 hours for critical fixes, 1-2 days for full remediation of all findings.

---

## Audit Metadata

- **Files Inspected:** 30+ source files across components, hooks, and configuration
- **Tools Used:** preflight_check, read_plan, read_files, search_in_files, list_files, supabase_preflight_check
- **Modifications Made:** NONE (read-only audit)
- **Report Location:** `ECHO_MASTER_AUDIT_REPORT.md`