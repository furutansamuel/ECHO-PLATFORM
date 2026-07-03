ECHO — Audit & Stabilize (Phases 1–2 Only)

&nbsp;

Proceed with the framework swap and stabilization of my uploaded ECHO Vite + React Router project while preserving every existing feature, Prompt 4, Prompt 5, Prompt 6 implementation, branding, and UI.

&nbsp;

This is a stabilization pass only.

&nbsp;

&nbsp;

---

&nbsp;

Primary Objective

&nbsp;

Replace the current Lovable TanStack scaffold with my uploaded ECHO project, connect it to my existing external Supabase project, and fix only build, runtime, routing, CSS, authentication, and dependency issues.

&nbsp;

Do NOT redesign any page.

&nbsp;

&nbsp;

---

&nbsp;

Before Making Any Changes

&nbsp;

1. Create a Recovery Checkpoint

&nbsp;

Create a complete project checkpoint immediately after importing my ECHO codebase and before making any stabilization changes.

&nbsp;

If any later change causes:

&nbsp;

blank pages

&nbsp;

CSS regression

&nbsp;

routing failures

&nbsp;

build failures

&nbsp;

runtime crashes

&nbsp;

&nbsp;

rollback to this checkpoint before trying another approach.

&nbsp;

&nbsp;

---

&nbsp;

Framework Swap

&nbsp;

Replace the existing TanStack scaffold with my uploaded ECHO Vite project.

&nbsp;

Remove only the framework-specific TanStack files.

&nbsp;

Keep:

&nbsp;

README.md

&nbsp;

DATABASE_IMPLEMENTATION_SUMMARY.md

&nbsp;

ECHO_MASTER_AUDIT_REPORT.md

&nbsp;

&nbsp;

Exclude:

&nbsp;

.git

&nbsp;

node_modules

&nbsp;

bun.lock

&nbsp;

package-lock.json

&nbsp;

.orig

&nbsp;

.rej

&nbsp;

&nbsp;

Regenerate dependencies from my package.json.

&nbsp;

&nbsp;

---

&nbsp;

External Supabase

&nbsp;

Use my existing external Supabase project.

&nbsp;

Ask me for:

&nbsp;

SUPABASE_URL

&nbsp;

SUPABASE_PUBLISHABLE_KEY

&nbsp;

&nbsp;

Do NOT:

&nbsp;

create a new Supabase

&nbsp;

run migrations

&nbsp;

modify my existing database

&nbsp;

modify RLS

&nbsp;

modify storage

&nbsp;

modify Edge Functions

&nbsp;

&nbsp;

Only reconnect the client.

&nbsp;

&nbsp;

---

&nbsp;

Stabilization Rules

&nbsp;

Do NOT redesign anything

&nbsp;

Do NOT modify:

&nbsp;

layouts

&nbsp;

colors

&nbsp;

typography

&nbsp;

spacing

&nbsp;

animations

&nbsp;

branding

&nbsp;

landing page

&nbsp;

dashboard appearance

&nbsp;

Prompt 5 UI

&nbsp;

Prompt 6 premium UI

&nbsp;

&nbsp;

Only repair broken functionality.

&nbsp;

&nbsp;

---

&nbsp;

CSS Pipeline

&nbsp;

Investigate first.

&nbsp;

Do NOT automatically delete:

&nbsp;

postcss.config.js

&nbsp;

tailwind.config.*

&nbsp;

vite.config.*

&nbsp;

&nbsp;

Determine which Tailwind pipeline is actually active.

&nbsp;

Only remove redundant configuration if styling remains identical afterward.

&nbsp;

Forest Green branding and Prompt 6 styling must remain exactly the same.

&nbsp;

&nbsp;

---

&nbsp;

Dependencies

&nbsp;

Do NOT upgrade or replace core dependencies unless a proven compatibility issue requires it.

&nbsp;

Do NOT change versions of:

&nbsp;

React

&nbsp;

ReactDOM

&nbsp;

Vite

&nbsp;

Tailwind

&nbsp;

React Router

&nbsp;

Supabase

&nbsp;

TypeScript

&nbsp;

Lucide

&nbsp;

&nbsp;

unless the existing version is confirmed to be the direct cause of a runtime or build failure.

&nbsp;

&nbsp;

---

&nbsp;

External Packages

&nbsp;

The project currently externalizes packages through esm.sh.

&nbsp;

Only remove the import-map strategy after confirming every externalized dependency already exists locally and builds successfully.

&nbsp;

Never leave unresolved imports.

&nbsp;

&nbsp;

---

&nbsp;

Dead Files

&nbsp;

Delete files only after verifying they have zero imports or references.

&nbsp;

Never delete files based only on assumption.

&nbsp;

&nbsp;

---

&nbsp;

Authentication

&nbsp;

Repair only:

&nbsp;

AuthProvider

&nbsp;

loading deadlocks

&nbsp;

duplicate profile fetching

&nbsp;

Supabase initialization

&nbsp;

guest mode

&nbsp;

demo mode

&nbsp;

&nbsp;

Do not redesign authentication.

&nbsp;

&nbsp;

---

&nbsp;

Realtime

&nbsp;

Repair:

&nbsp;

duplicate subscriptions

&nbsp;

channel cleanup

&nbsp;

removeChannel lifecycle

&nbsp;

React Strict Mode compatibility

&nbsp;

&nbsp;

Do not modify business logic.

&nbsp;

&nbsp;

---

&nbsp;

Routing

&nbsp;

Keep every existing route.

&nbsp;

Do not rename routes.

&nbsp;

Replace silent redirects with a proper NotFound page only if necessary.

&nbsp;

&nbsp;

---

&nbsp;

Memory Safety

&nbsp;

Preserve existing build optimizations.

&nbsp;

Do NOT:

&nbsp;

regenerate UI

&nbsp;

duplicate components

&nbsp;

increase bundle size unnecessarily

&nbsp;

remove lazy loading

&nbsp;

remove manual chunking

&nbsp;

remove build optimizations unless they are confirmed to be broken

&nbsp;

&nbsp;

&nbsp;

---

&nbsp;

Validation

&nbsp;

After every major phase verify that these pages load correctly:

&nbsp;

Landing

&nbsp;

Dashboard

&nbsp;

Report

&nbsp;

Reports

&nbsp;

Map

&nbsp;

AI Intelligence

&nbsp;

Community Health

&nbsp;

Analytics

&nbsp;

Community Insights

&nbsp;

Knowledge Center

&nbsp;

Profile

&nbsp;

Impact Center

&nbsp;

Notifications

&nbsp;

Search

&nbsp;

&nbsp;

Verify:

&nbsp;

CSS loads

&nbsp;

no white pages

&nbsp;

no blank pages

&nbsp;

no console errors

&nbsp;

no routing regression

&nbsp;

no authentication regression

&nbsp;

build succeeds

&nbsp;

demo mode works

&nbsp;

guest mode works

&nbsp;

&nbsp;

&nbsp;

---

&nbsp;

Success Criteria

&nbsp;

The project must finish with:

&nbsp;

zero blank pages

&nbsp;

zero white screens

&nbsp;

zero CSS regressions

&nbsp;

zero routing regressions

&nbsp;

zero authentication crashes

&nbsp;

zero Supabase initialization errors

&nbsp;

zero realtime subscription errors

&nbsp;

successful production build

&nbsp;

Prompt 4 preserved

&nbsp;

Prompt 5 preserved

&nbsp;

Prompt 6 preserved

&nbsp;

Environmental Intelligence Module preserved

&nbsp;

Premium UI preserved

&nbsp;

&nbsp;

&nbsp;

---

&nbsp;

Final Deliverables

&nbsp;

Provide:

&nbsp;

1. Every modified file with a short reason.

&nbsp;

&nbsp;

2. Remaining issues not fixed.

&nbsp;

&nbsp;

3. Production readiness score (/100).

&nbsp;

&nbsp;

4. Recommendations for the next stabilization phase.

&nbsp;

&nbsp;

&nbsp;

If any proposed change risks breaking existing functionality, stop and ask for approval instead of making the change automatically.