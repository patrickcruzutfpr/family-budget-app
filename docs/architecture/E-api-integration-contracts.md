# E. API and Integration Contracts

## Contract inventory

### Internal contracts (frontend modules)
- Hook-service contracts:
  - useBudget <-> profileService/budgetService
  - useSavedSuggestions <-> localStorage key schema
  - useProfileManager <-> profileService CRUD and import/export
- Type contracts:
  - CategoryType, BudgetState, BudgetProfile, AISuggestion

### External contract 1: Internal AI proxy HTTP API
- Endpoint: `POST /api/ai/suggestions`
- Request body:
  - `language: 'en' | 'pt-BR'`
  - `budgetSummary.totalIncome`
  - `budgetSummary.expenses[]` with `category`, `projected`, and `actual`
- Success response:
  - `suggestions[]` each containing `title` and `suggestion`
- Error response:
  - `error.code` in `AI_BAD_REQUEST | AI_UNAVAILABLE | AI_MISCONFIGURED | AI_BAD_RESPONSE`
  - `error.message` safe for UI/logging

### External contract 2: Provider adapters (Gemini and LM Studio)
- Provider owner: backend `server/aiProxyService.ts` via `server/providers/index.ts`
- Selection:
  - `AI_PROVIDER=gemini` -> `server/providers/gemini.ts`
  - `AI_PROVIDER=llmstudio` -> `server/providers/llmstudio.ts`
- Gemini request style:
  - model: `gemini-2.5-flash`
  - prompt built from sanitized budget summary
  - response requested as JSON schema
- LM Studio request style:
  - endpoint: `/chat/completions` on `LLMSTUDIO_BASE_URL` (default `http://127.0.0.1:1234/v1`)
  - model: `LLMSTUDIO_MODEL` (default `qwen2.5-coder-32b`)
  - `response_format.type = json_schema`
- Response expectation (both adapters):
  - object with `suggestions[]` each containing `title` and `suggestion`
- Error behavior:
  - missing/invalid key or credentials -> `AI_MISCONFIGURED`
  - unavailable/overloaded/quota/network failure -> `AI_UNAVAILABLE`
  - malformed/empty provider payload -> `AI_BAD_RESPONSE`

### External contract 3: Optional Flask API wrapper
- Base URL: process.env.REACT_APP_API_BASE_URL or http://localhost:5000/api/v1
- Endpoints in client wrapper:
  - GET /health
  - GET /users
  - POST /users
  - GET /categories
  - POST /categories
- Authn/Authz:
  - Unknown in current client wrapper (no auth headers or token handling).

## Versioning
- Current status: no explicit API version strategy for frontend-internal contracts.
- External API wrapper includes /api/v1 path naming but no contract governance in this repo.

## Idempotency and retries
- Frontend mutation operations are not formally idempotent.
- No retry/circuit-breaker/backoff strategy in service wrappers.
- Suggestion save dedupes by title+suggestion content in local storage arrays.

## Error model
- AI proxy now exposes a standardized app-level error contract for the AI path.
- Frontend still throws a generic UI-safe `Error` after proxy failures that should not trigger fallback.
- Non-AI areas still rely mostly on simple `Error` message strings.

## Security and secrets
- Provider credentials are backend-owned and loaded only by the Node AI proxy.
- The browser sends sanitized budget summaries and never receives provider secrets.

## Unknowns
- Unknown: authoritative OpenAPI spec for backend integration.
  - Evidence needed: openapi.yaml/json and backend repo references.
- Unknown: required authentication mechanism for backend endpoints.
  - Evidence needed: auth architecture docs.

## Evidence
- Frontend integration contract: src/services/geminiService.ts
- Mock fallback behavior: src/services/geminiServiceMock.ts
- Backend AI proxy contract: server/app.ts, server/aiProxyService.ts, src/types/api.ts
- Provider adapters: server/providers/gemini.ts, server/providers/llmstudio.ts, server/providers/index.ts
- Optional backend API wrapper: src/services/apiService.ts
- Frontend type contracts: src/types/index.ts
- Suggestion dedupe logic and persistence: src/hooks/useSavedSuggestions.ts
