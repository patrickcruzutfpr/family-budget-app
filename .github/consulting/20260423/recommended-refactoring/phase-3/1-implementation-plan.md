# Phase 3 Plan: AI Proxy First Refactor

## Summary
Phase 3 will add a minimal Node backend inside this repository to move Gemini calls server-side while keeping budgets, profiles, categories, and suggestion persistence local-first in the browser. The goal is to remove `GEMINI_API_KEY` exposure from the frontend, preserve the current AI UX contract, and avoid expanding Phase 3 into full backend domain ownership.

## Implementation Changes
### 1) Phase-3 artifact workflow
- Keep all planning artifacts under `.github/consulting/20260423/recommended-refactoring/phase-3/`.
- Use the numbered convention you selected:
  - `1-implementation-plan.md`
  - `2-task.md`
  - `3-checklist.md`
  - `4-test-matrix.md`
  - `5-definition-of-done.md`
  - `6-walkthrough.md`
  - `index.md`
- Align the wording in `1-implementation-plan.md` with this structure.
- Do not say it follows the Phase 2 artifact pattern; this Phase 3 structure now matches the expanded Phase 1-style workflow more closely.

### 2) Backend proxy introduction
- Add a minimal TypeScript Node service under `server/`, but keep a single root `package.json`.
- Use `express` as the HTTP layer for this phase.
- Add one production-facing endpoint only:
  - `POST /api/ai/suggestions`
- The frontend must send a sanitized summary payload, not full `BudgetState`.
- Request contract:
  - `language: SupportedLanguage`
  - `budgetSummary: { totalIncome: number; expenses: { category: string; projected: number; actual: number }[] }`
- Response contract:
  - success: `{ suggestions: AISuggestion[] }`
  - error: stable app-level error payload with a small code set such as `AI_UNAVAILABLE`, `AI_MISCONFIGURED`, `AI_BAD_RESPONSE`
- The backend owns:
  - Gemini client initialization
  - prompt construction
  - provider response parsing
  - normalization to `AISuggestion[]`
  - hiding raw provider/internal errors from the browser
- The backend does not own profile, budget, category, or suggestion persistence in Phase 3.

### 3) Frontend AI refactor
- Keep the public frontend function stable:
  - `getBudgetSuggestions(budget, language): Promise<AISuggestion[]>`
- Change its implementation so it:
  - builds the sanitized budget summary locally
  - calls `/api/ai/suggestions`
  - maps proxy errors to existing UI behavior
- Preserve fallback behavior:
  - if the proxy indicates provider unavailable/suspended, use `geminiServiceMock`
  - otherwise throw the same generic UI-safe error used today
- Remove direct `@google/genai` usage from the frontend bundle.
- Remove Gemini key injection from `vite.config.ts`.
- The optional legacy `apiService.ts` is out of scope unless it blocks `/api` routing or creates naming confusion; if needed, mark it clearly as non-authoritative legacy/demo code.

### 4) Dev/build/runtime integration
- Keep one root package and add scripts for:
  - frontend dev
  - backend dev
  - combined dev
  - backend start
- Add a Vite dev proxy for `/api/*` to the backend port.
- Default frontend runtime calls to same-origin `/api`; do not hardcode localhost URLs in browser code.
- Environment variables:
  - required on backend: `GEMINI_API_KEY`
  - optional on backend: `PORT`
  - avoid frontend Gemini env usage entirely
- Update `README.md` and architecture docs after implementation to reflect:
  - dual-process local development
  - server-owned AI secret boundary
  - Phase 3 completion status

## Public APIs / Interfaces / Types
- New HTTP API:
  - `POST /api/ai/suggestions`
- New request DTO:
  - `BudgetSummaryRequest`
- New response/error DTOs:
  - `AISuggestionsResponse`
  - `AppApiError`
- Existing frontend contract remains unchanged:
  - `getBudgetSuggestions(budget, language): Promise<AISuggestion[]>`
- No changes to `BudgetState`, `BudgetProfile`, category types, or localStorage ownership in this phase.

## Test Plan
- Backend unit tests:
  - valid Gemini payload returns normalized `AISuggestion[]`
  - empty or malformed Gemini output returns controlled error
  - provider unavailable/suspended maps to the fallback-triggering error code
- Frontend/service tests:
  - `geminiService` calls the proxy, not `@google/genai`
  - sanitized summary generation is correct for income and expense categories
  - mock fallback still activates for the expected proxy error codes
  - generic UI error still appears for non-fallback failures
- Integration checks:
  - frontend + backend boot locally via the new combined workflow
  - `npm run type-check`, `npm run test`, and `npm run build` all pass
  - production frontend bundle no longer contains Gemini SDK code or frontend key injection
- Acceptance checks:
  - no `GEMINI_API_KEY` exposed in browser build/runtime config
  - AI suggestions still work end-to-end through the proxy
  - local-first profile and budget behavior remains unchanged

## Assumptions and Defaults
- Phase 3 is one deliverable, not split into subphases.
- Backend stack is Node in-repo with `express`.
- Repo structure stays single-package for this phase.
- The browser sends a sanitized budget summary, not full `BudgetState`.
- Tailwind CDN usage remains unchanged in Phase 3.
- Full backend ownership for budgets/profiles/sync is deferred to a later phase.
