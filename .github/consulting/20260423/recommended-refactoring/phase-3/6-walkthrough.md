## Phase 3 Walkthrough

Date: 2026-04-23  
Goal: move Gemini calls behind a minimal backend proxy without changing local-first ownership of budgets, profiles, categories, and saved AI suggestions.

## A. Task Artifact

Created:
- `.github/consulting/20260423/recommended-refactoring/phase-3/2-task.md`

Execution tasks covered:
1. Build the Node/Express AI proxy.
2. Add shared DTOs and app-level AI error types.
3. Refactor the frontend AI service to the proxy.
4. Add local dev/runtime support for frontend + backend.
5. Add backend and frontend tests for the new contract.
6. Update docs and Phase 3 consulting artifacts.

## B. Code Changes

### 1) Node AI proxy

Created files:
- `server/app.ts`
- `server/aiProxyService.ts`
- `server/index.ts`

Implemented:
1. Added `POST /api/ai/suggestions`.
2. Validated `BudgetSummaryRequest` payloads with `language` plus sanitized budget summary.
3. Moved Gemini prompt construction and provider parsing to the backend.
4. Added stable error mapping:
- `AI_BAD_REQUEST`
- `AI_UNAVAILABLE`
- `AI_MISCONFIGURED`
- `AI_BAD_RESPONSE`

Outcome:
- Gemini secret handling now stays on the backend and the browser no longer talks to Gemini directly.

### 2) Shared DTOs

Created file:
- `src/types/api.ts`

Implemented:
1. Added `BudgetSummaryRequest`.
2. Added `AISuggestionsResponse`.
3. Added `AppApiError` and error code types.
4. Re-exported the new API types from `src/types/index.ts`.

Outcome:
- Frontend and backend now share one explicit contract for the AI path.

### 3) Frontend AI refactor

Changed file:
- `src/services/geminiService.ts`

Implemented:
1. Replaced direct `@google/genai` usage with a fetch client to `/api/ai/suggestions`.
2. Added `buildBudgetSummary` to strip the full budget into the agreed transport shape.
3. Preserved the existing public function signature:
- `getBudgetSuggestions(budget, language)`
4. Kept fallback behavior for `AI_UNAVAILABLE`.
5. Kept generic UI-safe errors for non-fallback proxy failures.

Outcome:
- The UI contract did not change, but the browser bundle no longer depends on the Gemini SDK.

### 4) Dev/build/runtime support

Changed files:
- `package.json`
- `vite.config.ts`
- `.env.example`
- `tsconfig.json`
- `src/services/apiService.ts`

Implemented:
1. Added scripts:
- `dev:client`
- `dev:server`
- `dev:full`
- `server:start`
2. Added an `/api` Vite dev proxy to `http://localhost:3001`.
3. Removed frontend Gemini env injection from Vite.
4. Added backend runtime dependencies for Express and TypeScript execution.
5. Marked the old Flask-style `apiService.ts` as legacy/demo code.

Outcome:
- Local development now supports the dual-process AI setup without hardcoded browser-side backend URLs.

## C. Tests and Verification

### 1) New tests

Created files:
- `tests/server/aiProxyService.test.ts`
- `tests/services/geminiService.test.ts`

Coverage added:
1. Backend DTO validation.
2. Backend misconfiguration handling.
3. Backend provider unavailable mapping.
4. Backend response normalization.
5. Frontend sanitized payload construction.
6. Frontend fallback on `AI_UNAVAILABLE`.
7. Frontend generic error behavior for non-fallback failures.

### 2) Type-check run

Command:
- `npm run type-check`

Result:
- Passed

### 3) Test run

Command:
- `npm run test`

Result:
- 7 test files passed
- 30 tests passed
- 0 failed

Note:
- Existing profile corruption and legacy fallback tests still print handled stderr paths while passing.

### 4) Build run

Command:
- `npm run build`

Result:
- Passed

Key impact:
1. No frontend Gemini key injection remains in `vite.config.ts`.
2. The production frontend bundle no longer emits a Gemini vendor chunk.

### 5) Runtime verification

Checks performed:
1. Start the Node AI proxy.
2. Request `GET /api/health`.
3. Confirm the proxy responds with `{"status":"ok"}`.

Result:
- Passed on 2026-04-23

## D. Documentation Updates

Updated:
- `README.md`
- `docs/architecture/A-executive-summary.md`
- `docs/architecture/B-system-context.md`
- `docs/architecture/C-container-component-view.md`
- `docs/architecture/E-api-integration-contracts.md`
- `docs/architecture/F-critical-flows.md`
- `docs/architecture/G-quality-attributes-nfr.md`
- `docs/architecture/H-security-privacy-review.md`
- `docs/architecture/I-operational-architecture.md`
- `docs/architecture/J-risks-tech-debt-register.md`
- `docs/architecture/K-recommendations-roadmap.md`
- `docs/architecture/L-open-questions.md`
- `docs/architecture/architecture-options.md`
- `docs/architecture/index.md`

Documented changes:
1. Phase 3 marked complete for AI proxy extraction.
2. Runtime topology updated from frontend-only AI integration to frontend + Node proxy + Gemini.
3. Secret-handling guidance updated to backend-owned `GEMINI_API_KEY`.
4. Roadmap and risk register updated to show the Phase 3 security mitigation is implemented.

## E. Summary

Phase 3 is complete for the defined scope.

Delivered:
1. Minimal Node/Express AI proxy in-repo.
2. Shared request/response/error DTOs for the AI path.
3. Frontend AI service refactor to `/api/ai/suggestions`.
4. Preservation of local-first ownership for budgets, profiles, categories, and saved suggestions.
5. New backend and frontend automated tests.
6. Updated development workflow for frontend + backend local execution.
7. Updated README, architecture docs, and Phase 3 consulting artifacts.

Validation state:
1. Type-check: PASS
2. Tests: PASS
3. Build: PASS
4. Runtime health check: PASS
