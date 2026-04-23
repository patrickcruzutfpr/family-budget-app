# Server Architecture

## Overview

The server is a minimal Node/Express AI proxy whose sole responsibility is to safely call the Google Gemini API on behalf of the SPA. It validates input, protects secrets (`GEMINI_API_KEY`), normalizes provider responses, and returns a stable schema to the frontend.

## Components

- `server/index.ts` — bootstraps server and loads environment
- `server/app.ts` — Express application, routes, and middleware
- `server/aiProxyService.ts` — provider integration, request construction, response normalization, error mapping
- `server/tests/` — unit and integration tests

## Data flow

1. Frontend POSTs a sanitized `BudgetSummary` to `/api/ai/suggestions`.
2. Server validates payload and builds a provider prompt.
3. Server calls Gemini via `@google/genai` using `GEMINI_API_KEY` from environment.
4. Server validates and normalizes provider output into `AISuggestionsResponse` and returns it to frontend.

## Error mapping

- Client validation errors → `400` with `AI_BAD_REQUEST`
- Provider parse or schema errors → `502` with `AI_BAD_RESPONSE`
- Provider availability issues (quota/suspended) → `503` with `AI_UNAVAILABLE`
- Server misconfiguration (missing key) → `500` with `AI_MISCONFIGURED`

## Deployment considerations

- Keep `GEMINI_API_KEY` in secure environment (CI/Platform secrets)
- Ensure TLS termination between users and server in production
- Configure request rate limits and provider quota monitoring
