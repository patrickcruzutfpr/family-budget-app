## Definition of Done

Phase 3 is done when:
1. Gemini calls run only on the backend proxy.
2. `GEMINI_API_KEY` is no longer injected into the browser build/runtime.
3. The frontend AI feature still uses `getBudgetSuggestions(budget, language)` with no UI contract break.
4. The frontend sends only sanitized budget summaries to the backend.
5. Provider failures map to stable app-level error codes.
6. `AI_UNAVAILABLE` still activates mock fallback behavior.
7. Root package scripts support frontend-only, backend-only, and combined local development.
8. `npm run type-check`, `npm run test`, and `npm run build` all pass.
9. Runtime startup of the Node AI proxy is validated locally.
10. README, architecture docs, and Phase 3 artifacts all reflect the implemented state.
