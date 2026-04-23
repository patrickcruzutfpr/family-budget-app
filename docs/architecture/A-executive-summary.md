# A. Executive Summary

## Scope
This analysis reverse-engineers the current architecture of Family Budget App from repository evidence and identifies risks, gaps, and pragmatic improvements for the next 3-6 months.

## What the system is
- A React + TypeScript single-page application for family budget tracking with a minimal in-repo Node AI proxy.
- Local-first persistence using browser localStorage with profile-aware budget data.
- Optional AI suggestions via a server-side Gemini proxy, with mock fallback on specific failures.
- Bilingual UI (English and pt-BR) with dynamic translation loading.

## Current architecture assessment
- Architecture style: frontend-first modular monolith with a narrow backend proxy for AI only.
- Runtime: browser application built with Vite plus a minimal Node/Express service for `/api/ai/suggestions`.
- Data ownership: mostly browser-local state and localStorage; no authoritative backend for core budget domain.
- Integrations: Gemini through the in-repo Node proxy; optional legacy Flask API service module for users/categories.

## Key strengths
- Clear code organization by features, hooks, services, and i18n.
- Good UX baseline for profiles, categories, charts, and AI suggestions.
- Type-safe model definitions for budget, profile, and suggestions.
- Existing automated validation stack with Vitest + jsdom + TypeScript checks.
- Minimum CI workflow now validates install, type-check, tests, and build.
- Gemini secret exposure has been removed from the frontend runtime and build pipeline.

## Key risks and gaps
- Operational gap: no production observability instrumentation despite CI now being present.
- NFR gap: no explicit SLO/SLA targets and no validated scale assumptions.
- Backend AI proxy is intentionally thin and still lacks auth, quotas, and telemetry.
- Styling/runtime debt: the application still depends on the Tailwind CDN in `index.html` because there is no local Tailwind build pipeline yet.

## Recommended direction
- Phase 1: completed stability fixes for bootstrap correctness and category deletion integrity.
- Phase 2: completed reset hardening, CI baseline, TypeScript cleanup, and bundle/runtime warning cleanup.
- Phase 3: completed the security-driven extraction of Gemini calls to a backend proxy while keeping budget/profile ownership local-first.
- Next: expand backend responsibilities only if there are concrete drivers beyond AI secret isolation, such as sync, compliance, analytics, or multi-user governance.

## Assumptions
- The repository is the primary source of truth for current production-like architecture.
- No hidden backend contracts are currently governing core budget/profile behavior.
- Current user scale is small to medium and browser-local data model is acceptable short term.

## Evidence
- Product overview and architecture claims: README.md
- Frontend runtime and providers: src/main.tsx
- Main orchestration and feature composition: src/App.tsx
- Build/runtime dependencies: package.json
- AI proxy runtime and frontend client integration: server/app.ts, server/aiProxyService.ts, src/services/geminiService.ts, vite.config.ts
- Local profile persistence and profile model management: src/services/profileService.ts, src/types/index.ts
- Category delete implementation: src/services/categoryService.ts
- UI warning for category delete behavior: src/components/features/DeleteConfirmationModal.tsx
- Test tooling and setup: vitest.config.ts, tests/hooks/useBudget.test.ts
- CI workflow and scripts: .github/workflows/ci.yml, package.json
- Current Tailwind runtime dependency: index.html
