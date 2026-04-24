# Server Requirements

## Functional requirements

- Accept a sanitized `BudgetSummary` and `language` via `POST /api/ai/suggestions`.
- Validate incoming payloads and return clear error codes for invalid input.
- Support pluggable provider adapters selected by `AI_PROVIDER`.
- Support `gemini` and `llmstudio` adapters with server-side credentials.
- Normalize provider responses to `AISuggestionsResponse` shape.
- Provide a health endpoint: `GET /api/health`.
- Provide provider-aware readiness checks via `GET /api/health?deep=true`.
- Support mocked responses for automated tests.

## Non-functional requirements

- Secrets must never be exposed in the frontend build.
- Response latency should be reasonable (aim <1s for fast responses; accept higher for model calls).
- API errors must be deterministic and documented for the frontend to handle gracefully.
- Tests must be hermetic: unit tests and integration tests should avoid live provider calls.
- The server should be easy to run locally (npm scripts) and runnable in CI.

## Security

- Require server-side storage of provider credentials in environment/secret store.
- Sanitize prompts to avoid exposing sensitive user data to the provider.
- Rate-limit and monitor outgoing provider calls in production.
