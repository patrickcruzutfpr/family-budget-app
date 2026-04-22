# I. Operational Architecture

## Deploy topology (current)
- Primary deployment model: static frontend bundle (Vite build) served to browser.
- Core business state remains in browser localStorage.
- External runtime dependency: Gemini API endpoint for AI suggestions.
- Optional local/dev dependency: Flask API endpoint for users/categories demo integration.

## Environments
- Confirmed:
  - Development workflow via npm run dev.
  - Production-like local preview via npm run preview.
- Unknown:
  - formal stage/prod environments and promotion strategy.

## CI/CD
- Current state:
  - No visible CI workflow files in .github besides agents/prompts customizations.
  - package.json does not expose test/lint/type-check scripts currently.
- Impact:
  - quality gates are likely manual.

## Rollback strategy
- Current inferred rollback:
  - redeploy previous static frontend artifact.
- Gaps:
  - no documented rollback runbook.
  - no migration versioning strategy for localStorage schema changes.

## Operational runbook checklist (recommended)

### Runbook 1: AI provider outage or key suspension
- Symptoms: AI feature errors, fallback usage spike.
- Steps:
  1. Verify key status and provider quota.
  2. Confirm fallback behavior path is functioning.
  3. Communicate degraded mode to users.
- Exit criteria: AI success rate returns above defined threshold.

### Runbook 2: Data inconsistency in local profile state
- Symptoms: missing categories/items, incorrect profile switching.
- Steps:
  1. Export available profile data.
  2. Validate storage keys and JSON parse integrity.
  3. Recover from backup export import if available.
- Exit criteria: profile and budget integrity restored.

### Runbook 3: Release regression
- Symptoms: post-release budget/profile feature break.
- Steps:
  1. Roll back static artifact.
  2. Capture browser console error signatures.
  3. Add regression test before re-release.
- Exit criteria: stable baseline and verified test coverage.

## Alerting and monitoring recommendations
- Frontend error telemetry:
  - uncaught exceptions, failed external calls, localStorage parsing errors.
- Product metrics:
  - profile switch success rate, suggestion generation success rate, import failure rate.
- SLO dashboard (future):
  - availability of AI feature,
  - median and p95 suggestion latency,
  - critical user action failure rate.

## Unknowns
- Unknown: hosting provider and CDN strategy.
  - Evidence needed: infrastructure configuration and deployment docs.
- Unknown: release frequency and change management process.
  - Evidence needed: release notes history and team operating model.

## Evidence
- Scripts and build flow: package.json
- Runtime/build setup: vite.config.ts
- Optional API base URL and endpoints: src/services/apiService.ts
- AI runtime dependency and fallback: src/services/geminiService.ts
- Repository .github contents (no CI workflow found): .github/
