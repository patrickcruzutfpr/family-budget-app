# J. Risks, Bottlenecks, and Technical Debt Register

| ID | Risk | Severity | Likelihood | Impact | Mitigation | Evidence |
|---|---|---|---|---|---|---|
| R1 | Profile bootstrap recursion between getAllProfiles and saveProfile on empty storage | Critical | Medium | App initialization failure in first-run scenarios | Implemented: bootstrap now uses a non-recursive initializeProfiles path and is covered by unit tests (2026-04-23) | src/services/profileService.ts, tests/services/profileService.test.ts |
| R2 | Gemini API key exposed in frontend build/runtime | High | High | Key abuse, billing leakage, service suspension | Implemented (2026-04-23): Gemini calls now go through the Node AI proxy and the key stays server-side | server/app.ts, server/aiProxyService.ts, src/services/geminiService.ts, vite.config.ts |
| R3 | Category deletion behavior mismatches warning text (items not moved to Other) | High | High | Data loss and trust erosion | Implemented: delete flow now transfers items to a type-safe Other category before removal, with unit+integration coverage (2026-04-23) | src/services/categoryService.ts, src/hooks/useCategories.ts, tests/services/categoryService.test.ts, tests/hooks/useCategories.test.ts, src/components/features/DeleteConfirmationModal.tsx |
| R4 | Broad reset strategy can delete unintended localStorage keys | Medium | Medium | Unintended local data loss | Implemented: reset now removes only explicit budget keys and is covered by regression tests (2026-04-23) | src/services/budgetService.ts, tests/services/budgetService.test.ts |
| R5 | Mixed persistence model (profile-first with legacy fallback) increases complexity | Medium | High | Harder debugging, inconsistent behavior | Deprecate legacy path with migration flag and remove fallback after safe window | src/hooks/useBudget.ts, src/services/budgetService.ts, src/services/profileService.ts |
| R6 | Event-based synchronization via global window events creates hidden coupling | Medium | Medium | Hard-to-track side effects and race conditions | Introduce typed event bus/state store boundary and document event contracts | src/App.tsx, src/hooks/useBudget.ts, src/hooks/useSavedSuggestions.ts, src/utils/categoryMigration.ts |
| R7 | No CI workflow and limited automated quality gates | Medium | High | Regression risk and release instability | Implemented: CI workflow validates install, type-check, tests, and build on push/PR (2026-04-23) | .github/workflows/ci.yml, package.json, vitest.config.ts |
| R8 | NFRs and SLOs are undocumented | Medium | Medium | Unclear reliability and performance objectives | Define NFR baseline and SLO dashboard metrics | README.md, docs/ |
| R9 | Optional API client contract and auth model are unclear | Medium | Medium | Integration drift and security ambiguity | Publish API contract (OpenAPI), auth model, and environment strategy | src/services/apiService.ts |
| R10 | i18n pluralization placeholder syntax not resolved by current translator utility | Low | Medium | User-facing text quality issues | Add interpolation/pluralization engine support and tests | src/i18n/locales/en.json, src/i18n/utils.ts |

## Bottlenecks
- localStorage-centric architecture limits horizontal scaling and shared-account workflows.
- the AI proxy is still a thin service with no auth, quotas, or telemetry.

## Debt themes
- Security debt: backend AI proxy still needs operational hardening.
- Consistency debt: dual persistence and UI/service mismatch.
- Operability debt: CI/CD and observability gaps.

## Evidence
- All entries cite evidence in-table from repository files.
