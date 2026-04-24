# Frontend State Strategy

This document explains data fetching, state persistence, and cache behavior in the frontend (`src/`).

## Navigation

- Previous: [docs/automation/CI_CD.md](./automation/CI_CD.md)
- Next: [docs/frontend/STYLEGUIDE.md](STYLEGUIDE.md)
- Root: [README.md](../README.md)

## 1. State Ownership Model

The frontend follows a local-first model:

- UI state: React component state and hooks
- Domain state: custom hooks in `src/hooks/`
- Persistence: `localStorage` through services
- Remote calls: targeted service calls for AI proxy and optional legacy API wrapper

## 2. Data Fetching Strategies

## 2.1 AI suggestion fetch

- Service: `src/services/geminiService.ts`
- Request pattern: `fetch` to `POST /api/ai/suggestions`
- Validation strategy: runtime payload shape checks in service
- Fallback strategy: when backend returns `AI_UNAVAILABLE`, fallback to `geminiServiceMock`

## 2.2 Optional legacy API fetch

- Hook: `src/hooks/useApi.ts`
- Service: `src/services/apiService.ts`
- Behavior: one-shot fetch in `useEffect` for users/categories
- Error model: local `error` state per hook

## 3. Cache and Persistence

## 3.1 localStorage-backed persistence

- Budget baseline key: `familyBudget` (legacy path)
- Profile storage key: `familyBudgetProfiles`
- Active profile key: `currentProfileId`
- Saved suggestions key prefix: `family-budget-saved-suggestions`

## 3.2 Saved suggestions cache

Saved suggestions are cached by:

- profile (`family-budget-saved-suggestions-<profileId>`)
- language (`en`, `pt-BR`)

Additional behavior:

- De-duplication by `title + suggestion`
- Insert-at-front ordering
- Retention cap: 50 suggestions per language

## 3.3 In-memory cache

Hooks keep in-memory snapshots during render cycles and sync them to persistence through effects and callbacks.

## 4. Synchronization Mechanics

- Profile-driven reloads update budget state
- Category operations trigger synchronization helper methods
- Saved suggestions listen for storage and custom events for cross-context consistency

## 5. Failure Handling

- Service-level try/catch with user-safe error messages
- Parsing failures default to safe empty states
- Fallback paths preserve UX continuity when API/provider is unavailable

## 6. Recommendations

- Keep domain logic in hooks/services, not in presentational components
- Maintain deterministic key naming for any new persisted collection
- Add selective memoization only after profiling bottlenecks

## Related Documents

- [docs/frontend/STYLEGUIDE.md](STYLEGUIDE.md)
- [docs/architecture/SYSTEM_DESIGN.md](../architecture/SYSTEM_DESIGN.md)
- [server/docs/API.md](../../server/docs/API.md)

---

Next: [docs/frontend/STYLEGUIDE.md](STYLEGUIDE.md)
