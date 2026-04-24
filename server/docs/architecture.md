# Server Architecture

## Overview

The server is a minimal Node/Express AI proxy whose responsibility is to safely call the configured AI provider on behalf of the SPA. It validates input, protects server-side secrets, normalizes provider responses, and returns a stable schema to the frontend.

## Components

- `server/index.ts` — bootstraps server and loads environment
- `server/app.ts` — Express application, routes, and middleware
- `server/aiProxyService.ts` — provider integration, request construction, response normalization, error mapping
- `server/tests/` — unit and integration tests

## Data flow

1. Frontend POSTs a sanitized `BudgetSummary` to `/api/ai/suggestions`.
2. Server validates payload and builds a provider prompt.
3. Server loads adapter from `AI_PROVIDER` (`gemini` default, `llmstudio` supported).
4. Server calls the selected provider adapter and normalizes output into `AISuggestionsResponse`.
5. Server returns normalized suggestions to the frontend.

Built-in adapters:

- `gemini`: uses `@google/genai` and `GEMINI_API_KEY`.
- `llmstudio`: uses LM Studio OpenAI-compatible API with `LLMSTUDIO_API_KEY` and optional `LLMSTUDIO_BASE_URL`/`LLMSTUDIO_MODEL`.

## Error mapping

- Client validation errors → `400` with `AI_BAD_REQUEST`
- Provider parse or schema errors → `502` with `AI_BAD_RESPONSE`
- Provider availability issues (quota/suspended) → `503` with `AI_UNAVAILABLE`
- Server misconfiguration (missing key) → `500` with `AI_MISCONFIGURED`

## Deployment considerations

- Keep provider secrets in secure environment (CI/Platform secrets)
- Ensure TLS termination between users and server in production
- Configure request rate limits and provider quota monitoring
