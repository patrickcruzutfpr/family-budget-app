# A. Executive Summary

## Scope
This analysis reverse-engineers the current architecture of Family Budget App from repository evidence and identifies risks, gaps, and pragmatic improvements for the next 3-6 months.

## What the system is
- A client-side React + TypeScript single-page application for family budget tracking.
- Local-first persistence using browser localStorage with profile-aware budget data.
- Optional AI suggestions via Google Gemini API, with mock fallback on specific failures.
- Bilingual UI (English and pt-BR) with dynamic translation loading.

## Current architecture assessment
- Architecture style: frontend monolith (modular by components/hooks/services).
- Runtime: browser application built with Vite.
- Data ownership: mostly browser-local state and localStorage; no authoritative backend for core budget domain.
- Integrations: Gemini API directly from frontend; optional Flask API service module for users/categories.

## Key strengths
- Clear code organization by features, hooks, services, and i18n.
- Good UX baseline for profiles, categories, charts, and AI suggestions.
- Type-safe model definitions for budget, profile, and suggestions.
- Existing unit-test setup with Vitest + jsdom.

## Key risks and gaps
- High security risk: Gemini API key is injected into frontend build variables.
- Reliability risk: profile bootstrap logic can recurse between getAllProfiles and saveProfile in empty-storage scenarios.
- Data integrity gap: category delete behavior conflicts with UI warning that items will be moved to Other.
- Operational gap: no CI/CD workflows in repository and no production observability instrumentation.
- NFR gap: no explicit SLO/SLA targets and no validated scale assumptions.

## Recommended direction
- Phase 1: stabilize current architecture with low-disruption fixes (security, data integrity, bootstrap correctness).
- Phase 2: modularize frontend domain boundaries and deprecate legacy persistence paths.
- Phase 3: extract backend responsibilities only when justified by concrete drivers (security, multi-user sync, compliance, analytics).

## Assumptions
- The repository is the primary source of truth for current production-like architecture.
- No hidden backend contracts are currently governing core budget/profile behavior.
- Current user scale is small to medium and browser-local data model is acceptable short term.

## Evidence
- Product overview and architecture claims: README.md
- Frontend runtime and providers: src/main.tsx
- Main orchestration and feature composition: src/App.tsx
- Build/runtime dependencies: package.json
- Gemini client integration and direct key usage: src/services/geminiService.ts, vite.config.ts
- Local profile persistence and profile model management: src/services/profileService.ts, src/types/index.ts
- Category delete implementation: src/services/categoryService.ts
- UI warning for category delete behavior: src/components/features/DeleteConfirmationModal.tsx
- Test tooling and setup: vitest.config.ts, tests/hooks/useBudget.test.ts
- Missing CI workflows in repository root: .github/
