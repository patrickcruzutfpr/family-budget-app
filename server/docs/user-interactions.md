# User Interactions (Server-facing)

This document explains the interactions that the frontend and users have which involve the server.

## Typical user flow (AI suggestions)

1. User opens the Budget view in the SPA.
2. SPA computes a sanitized `BudgetSummary` (totals and per-category projected vs actual).
3. SPA calls `POST /api/ai/suggestions` with `{ language, budgetSummary }`.
4. Server responds with up to 3 actionable suggestions.
5. SPA displays them in the UI and offers save/share options.

## UX considerations

- Keep UI responsive: request suggestions asynchronously and show loading state.
- Handle `AI_UNAVAILABLE` by showing fallback suggestions from `geminiServiceMock` and a non-blocking error message.
- Local-first design: users' budgets remain in browser `localStorage` — server only sees sanitized summaries.

## Error handling UX

- 400 (`AI_BAD_REQUEST`): show a short message and allow retry.
- 500/502/503: show friendly fallback message and present mock suggestions.
- Include telemetry events for suggestion requests and failures (if configured) to help debug production issues.
