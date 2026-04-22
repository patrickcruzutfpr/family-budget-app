# G. Quality Attributes and NFR Assessment

## Performance
### Assessment
- Good for small local datasets due to client-only architecture.
- Potential overhead from frequent full-state localStorage writes on each budget change.

### Gaps
- No performance budgets or instrumentation for interaction latency.
- No explicit optimization strategy for very large profile/category sets.

### Evidence
- write-on-change behavior in useEffect: src/hooks/useBudget.ts
- in-memory map/reduce totals each render: src/App.tsx

## Scalability
### Assessment
- Scales per-device, not across shared users by default.
- LocalStorage size limits constrain long-term data growth.

### Gaps
- No multi-user authoritative data model in main flow.
- Optional API client is not integrated as a source of truth.

### Evidence
- profile local persistence: src/services/profileService.ts
- optional API wrapper only: src/services/apiService.ts

## Reliability
### Assessment
- Resilient fallback exists for profile load and Gemini suspension case.
- Event-based synchronization is brittle and may be hard to reason about.

### Gaps
- Potential recursion in profile initialization path.
- Inconsistent behavior between warning text and delete implementation.

### Evidence
- getAllProfiles and saveProfile interaction: src/services/profileService.ts
- custom window event coupling: src/App.tsx, src/hooks/useBudget.ts, src/hooks/useSavedSuggestions.ts
- category deletion mismatch: src/components/features/DeleteConfirmationModal.tsx, src/services/categoryService.ts

## Maintainability
### Assessment
- Strong modular folder structure and alias-based imports.
- Types are centralized and reusable.

### Gaps
- Coexistence of legacy and current persistence paths increases complexity.
- Duplicate/overlapping concepts around categories and API integration create ambiguity.

### Evidence
- project structure and aliases: README.md, vite.config.ts, vitest.config.ts
- profile-first plus legacy fallback: src/hooks/useBudget.ts, src/services/budgetService.ts
- parallel category API and local category service: src/hooks/useApi.ts, src/hooks/useCategories.ts

## Security
### Assessment
- Basic client-side validation and error handling only.
- No robust secret isolation in current AI integration path.

### Gaps
- Gemini key exposed to frontend runtime via Vite define.
- No authn/authz in main application domain.

### Evidence
- API key mapping: vite.config.ts
- Gemini API use in client: src/services/geminiService.ts
- backend client without auth headers: src/services/apiService.ts

## Cost efficiency
### Assessment
- Low infra cost for frontend-only architecture.
- AI calls can introduce variable external cost.

### Gaps
- No cost guardrails (rate limiting, quotas, or budget-aware fallback policy).

### Evidence
- direct Gemini request path and model selection: src/services/geminiService.ts

## Observability maturity
### Assessment
- Low maturity.
- Logging is mostly console-based; no metrics or tracing pipeline.

### Gaps
- No telemetry stack integration.
- No alerting or SLO dashboards.

### Evidence
- console warnings/errors across services/hooks: src/services/profileService.ts, src/services/geminiService.ts, src/hooks/useSavedSuggestions.ts
- no observability config files in repository root.

## SLO readiness
- Unknown.
- Evidence needed: explicit latency/availability objectives and error budget policy.
