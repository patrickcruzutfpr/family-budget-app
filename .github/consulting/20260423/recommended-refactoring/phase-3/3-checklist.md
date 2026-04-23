## Checklist

- [x] `server/app.ts` exposes `POST /api/ai/suggestions`
- [x] `server/aiProxyService.ts` owns Gemini prompt construction, parsing, and error mapping
- [x] Frontend sends `BudgetSummaryRequest`, not full `BudgetState`
- [x] Frontend no longer imports `@google/genai`
- [x] `vite.config.ts` no longer injects `GEMINI_API_KEY` into the frontend
- [x] Root `package.json` includes backend dev/start/full scripts
- [x] Automated tests cover backend normalization/error mapping and frontend proxy/fallback behavior
- [x] `npm run type-check` passes
- [x] `npm run test` passes
- [x] `npm run build` passes
- [x] Runtime health check for the Node AI proxy passes
- [x] README and architecture docs reflect Phase 3 completion
