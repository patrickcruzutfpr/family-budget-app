# Architecture Options and Trade-offs

## Option 1: Minimal-change stabilization

### Description
Keep current frontend architecture and local-first model. Focus only on critical fixes, security hardening, and quality gates.

### Scope
- Fix profile bootstrap recursion risk.
- Fix category deletion integrity behavior.
- Restrict local reset key deletion.
- Add CI checks and basic telemetry hooks.

### Pros
- Fastest to deliver.
- Lowest disruption risk.
- Preserves current user experience.

### Cons
- Does not solve long-term multi-device or central governance needs.
- localStorage constraints remain.

### Best fit
- Short-term reliability and cost control with limited team capacity.

### Evidence
- Current modular frontend baseline: src/App.tsx, src/hooks/, src/services/
- Current risk hotspots: src/services/profileService.ts, src/services/categoryService.ts, src/services/budgetService.ts

## Option 2: Modularization / modular monolith (recommended baseline)

### Description
Keep single frontend deployable but formalize domain boundaries and internal contracts. Remove legacy persistence ambiguity and adopt explicit event/state boundaries.

### Scope
- Introduce documented domain modules (Budget, Profile, Category, AI, i18n, Persistence).
- Deprecate legacy budget fallback paths.
- Add contract tests and structured error model.
- Add architecture decision records for domain boundaries.

### Pros
- Significant maintainability gain without full distributed-system overhead.
- Better testability and clearer ownership.
- Prepares cleanly for future backend extraction.

### Cons
- Requires medium refactor effort.
- Some short-term velocity cost.

### Best fit
- Product expected to evolve with moderate complexity over next 6-18 months.

### Evidence
- Current mixed persistence and event coupling: src/hooks/useBudget.ts, src/utils/categoryMigration.ts, src/hooks/useSavedSuggestions.ts
- Existing modular folder structure already supports this direction: README.md, src/

## Option 3: Service extraction (only if justified)

### Description
Extract key capabilities to backend services: AI proxy, profile/budget persistence, auth and sync. Keep frontend as client.

### Scope
- Build backend API for profiles/categories/budgets.
- Move Gemini calls server-side with secret management.
- Add authn/authz and environment-based operations.
- Introduce migration path from localStorage to backend.

### Pros
- Resolves frontend secret exposure.
- Enables multi-user and cross-device sync.
- Improves compliance and observability options.

### Cons
- Highest implementation and operational cost.
- Requires infra and DevOps maturity.
- More moving parts and failure modes.

### Best fit
- Required when there are concrete drivers: compliance, shared data, scale, enterprise controls.

### Evidence
- Security driver: vite.config.ts, src/services/geminiService.ts
- Current local-only data ownership: src/services/profileService.ts
- Optional API path indicates potential backend direction: src/services/apiService.ts

## Decision guidance matrix

| Driver | Option 1 | Option 2 | Option 3 |
|---|---|---|---|
| Speed to implement | Best | Good | Worst |
| Security improvement | Good | Better | Best |
| Long-term maintainability | Fair | Best | Good |
| Multi-user readiness | Poor | Fair | Best |
| Operational complexity | Low | Medium | High |

## Recommendation
- Adopt Option 2 as default trajectory.
- Execute Option 1 actions immediately as prerequisites.
- Phase 3 has already implemented the narrowest justified slice of Option 3 for AI secret isolation.
- Expand beyond that only when concrete drivers are confirmed (sync requirements, compliance obligations, shared data governance, or scale).

## Evidence
- Combined evidence from files cited per option above.
