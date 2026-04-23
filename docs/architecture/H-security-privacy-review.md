# H. Security and Privacy Review

## Lightweight threat model

### Assets
- Budget and profile financial data stored locally.
- Saved AI suggestions and language preferences.
- Backend Gemini API key and sanitized AI request payloads.

### Threat actors
- Malicious script running in browser context.
- Casual attacker abusing leaked API keys.
- User-side data loss from browser storage corruption/cleanup.

### Entry points
- Browser localStorage.
- `/api/ai/suggestions` requests from client to backend proxy.
- Gemini API requests from backend proxy.
- Optional backend API fetch calls.
- Profile JSON import path.

## OWASP-aligned risks
- Sensitive data exposure:
  - financial summaries are sent to a third-party AI provider through the backend proxy.
- Insecure design:
  - AI proxy is intentionally minimal and has no auth/rate limiting yet.
- Data integrity issues:
  - localStorage remains the system of record for profiles and budgets.
- Input handling risks:
  - Profile import validates basic shape but lacks strict schema and size controls.

## Secrets handling
- Current state: `GEMINI_API_KEY` is loaded only by the backend proxy.
- Recommended baseline:
  - keep Gemini calls in backend proxy
  - move from `.env.local` to managed secret storage in hosted environments
  - add request quotas and abuse protections

## Privacy considerations
- Current behavior:
  - financial data remains in browser localStorage by default.
  - only sanitized budget summaries are sent to Gemini via the backend proxy.
  - no explicit consent or privacy policy workflow in codebase.
- Risks:
  - local shared-device exposure
  - lack of defined retention and deletion policy

## Least privilege review
- No role-based authorization model in main app flow.
- Optional backend wrapper has no token/session handling in client code.

## Compliance status
- GDPR/LGPD/PCI applicability: Unknown.
- Evidence needed:
  - data classification inventory
  - lawful basis and consent requirements
  - retention/deletion policy
  - DPA/processor obligations for AI provider

## Recommended controls (priority order)
1. Add rate limiting, audit logging, and telemetry to the AI proxy.
2. Add strict import schema validation and payload limits.
3. Add privacy notice and local data handling guidance for localStorage and AI provider usage.
4. Define whether backend auth is required if the AI proxy becomes remotely exposed.
5. Add optional encryption-at-rest strategy for local cache if needed.

## Evidence
- AI proxy secret boundary: server/app.ts, server/aiProxyService.ts, src/services/geminiService.ts
- Import/export profile path: src/services/profileService.ts
- Local persistence keys and suggestion storage: src/services/profileService.ts, src/hooks/useSavedSuggestions.ts
- Optional backend wrapper without auth contract in client: src/services/apiService.ts
