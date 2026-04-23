## Test Matrix

| Area | Scenario | Expected Result | Evidence |
|---|---|---|---|
| Backend DTO validation | Invalid `/api/ai/suggestions` payload | Returns `AI_BAD_REQUEST` | `server/app.ts` |
| Backend config | Missing `GEMINI_API_KEY` | Throws `AI_MISCONFIGURED` | `tests/server/aiProxyService.test.ts` |
| Backend provider mapping | Suspended/unavailable Gemini response | Maps to `AI_UNAVAILABLE` | `tests/server/aiProxyService.test.ts` |
| Backend normalization | Valid Gemini JSON response | Returns `AISuggestionsResponse` | `tests/server/aiProxyService.test.ts` |
| Frontend request mapping | `getBudgetSuggestions` called with full budget | Sends sanitized `BudgetSummaryRequest` to `/api/ai/suggestions` | `tests/services/geminiService.test.ts` |
| Frontend fallback | Proxy returns `AI_UNAVAILABLE` | Uses `getBudgetSuggestionsMock` | `tests/services/geminiService.test.ts` |
| Frontend error path | Proxy returns non-fallback error | Throws generic UI-safe error | `tests/services/geminiService.test.ts` |
| Full validation | Type-check, test, and build | All pass | local command runs on 2026-04-23 |
| Runtime | Server starts and `/api/health` responds | Returns `{"status":"ok"}` | local runtime check on 2026-04-23 |
