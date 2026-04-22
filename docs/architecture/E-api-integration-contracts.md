# E. API and Integration Contracts

## Contract inventory

### Internal contracts (frontend modules)
- Hook-service contracts:
  - useBudget <-> profileService/budgetService
  - useSavedSuggestions <-> localStorage key schema
  - useProfileManager <-> profileService CRUD and import/export
- Type contracts:
  - CategoryType, BudgetState, BudgetProfile, AISuggestion

### External contract 1: Google Gemini
- Provider: @google/genai client.
- Request style:
  - model: gemini-2.5-flash
  - prompt built from simplified budget aggregate
  - response requested as JSON schema
- Response expectation:
  - object with suggestions[] each containing title and suggestion.
- Error behavior:
  - no key -> throws configuration error
  - suspended key -> fallback to mock implementation
  - other failures -> generic failure error message

### External contract 2: Optional Flask API wrapper
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
- Predominantly throws generic Error with message strings.
- UI handles errors with simple alert/message patterns.
- No standardized domain error taxonomy.

## Security and secrets
- Gemini API key is directly mapped into frontend environment definitions.
- This leaks secret material into browser runtime/build output if provided.

## Unknowns
- Unknown: authoritative OpenAPI spec for backend integration.
  - Evidence needed: openapi.yaml/json and backend repo references.
- Unknown: required authentication mechanism for backend endpoints.
  - Evidence needed: auth architecture docs.

## Evidence
- Gemini integration contract: src/services/geminiService.ts
- Mock fallback behavior: src/services/geminiServiceMock.ts
- Frontend environment mapping of API key: vite.config.ts
- Optional backend API wrapper: src/services/apiService.ts
- Frontend type contracts: src/types/index.ts
- Suggestion dedupe logic and persistence: src/hooks/useSavedSuggestions.ts
