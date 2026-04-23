# Server — AI Proxy (Node / Express)

[![Node](https://img.shields.io/badge/Node->=18-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000.svg?logo=express&logoColor=white)](https://expressjs.com)

Minimal in-repo Node/Express proxy that centralizes Google Gemini access for the Family Budget App. The proxy preserves the `GEMINI_API_KEY` on the server side, validates frontend requests, normalizes provider responses, and exposes a small, stable HTTP surface for the SPA.

## Index

- [Overview](#overview)
- [Quick start](#quick-start)
- [Available scripts](#available-scripts)
- [Configuration & environment](#configuration--environment)
- [API surface](#api-surface)
- [Testing](#testing)
- [Integration tests (PowerShell)](#integration-tests-powershell)
- [CI and automation](#ci-and-automation)
- [Security & secrets](#security--secrets)
- [Troubleshooting](#troubleshooting)
- [Development notes](#development-notes)

## Overview

The server is intentionally small and focused: it receives a sanitized budget summary from the SPA and returns normalized AI suggestions. Responsibilities:

- Keep `GEMINI_API_KEY` out of the browser build
- Validate request payloads and return consistent error codes
- Call `@google/genai` (Gemini) and normalize responses to an `AISuggestionsResponse`
- Provide a mocked path and deterministic behavior for tests and CI

Location: `server/` — main entry: `server/index.ts` and request handling in `server/app.ts` and `server/aiProxyService.ts`.

## Quick start

Install dependencies at the repository root and run the proxy locally.

```powershell
npm install
npm run dev:server   # runs tsx watch server/index.ts
```

Health check:

```bash
curl http://localhost:3001/api/health
# { "status": "ok" }
```

Deep provider check (optional):

```bash
curl http://localhost:3001/api/health?deep=true
# { "status":"ok","provider":{ "name":"gemini","status":"ok" }}
```

Notes: the `?deep=true` check attempts to load the active provider adapter and reports config/health info. It will not perform external network calls unless the adapter implements a `healthCheck()` method or you explicitly run it in a non-test environment.

To run the full local workflow (frontend + backend):

```bash
npm run dev:full
```

## Available scripts

Scripts are defined in the repository `package.json`. Server-specific commands (run from repo root):

- `npm run dev:server` — run the AI proxy in watch mode (tsx)
- `npm run server:start` — run the AI proxy once (no watch)
- `npm run test` — run Vitest (includes server unit + integration tests)

## Configuration & environment

Create a `.env` in the repository root or set environment variables via your deployment platform.

- `GEMINI_API_KEY` — (required for real Gemini responses) the server-side API key for Google Gemini. Keep this secret.
- `PORT` — optional, defaults to `3001`.
 - `AI_PROVIDER` — optional provider key (e.g. gemini, openai, ollama). Defaults to `gemini`.

Example `.env` (DO NOT COMMIT your real key):

```text
GEMINI_API_KEY=your-real-key-here
PORT=3001
```

## API surface

1. `GET /api/health`
   - Response: `{ status: 'ok' }`

2. `POST /api/ai/suggestions`
   - Request payload: JSON `{ language: 'en' | 'pt-BR', budgetSummary: BudgetSummary }`
     - `BudgetSummary` shape: `{ totalIncome: number, expenses: [{ category: string, projected: number, actual: number }] }`
   - Success: `200` with `{ suggestions: [{ title: string, suggestion: string }] }`
   - Client errors: `400` (AI_BAD_REQUEST) for malformed payloads
   - Provider/Server errors: `502` / `503` / `500` with standardized error codes (see `server/aiProxyService.ts`)

### Error contract

The proxy returns structured errors using `AppApiError` with `error.code` and `error.message`. Consumers should gracefully fall back to `geminiServiceMock` when `AI_UNAVAILABLE` is returned.

## Provider pluggability

The server implements a provider adapter pattern. The active provider is selected via the `AI_PROVIDER` environment variable (defaults to `gemini`).

- Provider adapters live in `server/providers/` and must export a default object with `getAiSuggestions(budgetSummary, language)`.
- During development and CI the integration tests mock provider behavior to avoid external network calls.

To add or test a different provider locally, set `AI_PROVIDER` before starting the server. Example (PowerShell):

```powershell
$env:AI_PROVIDER = 'gemini'
npm run dev:server
```

## Testing

- Unit tests: `tests/server/*.test.ts` (Vitest)
- Integration: `server/tests/integration/` contains HTTP-layer integration tests that start the server programmatically and mock `getAiSuggestions` to avoid external calls.

Run all tests (root):

```bash
npm run test
```

## Integration tests (PowerShell)

A convenience PowerShell runner is included to exercise the live proxy end-to-end locally: `scripts/run-ai-integration-tests.ps1`.

Usage:

```powershell
pwsh .\scripts\run-ai-integration-tests.ps1
```

This script:

- Starts `server/index.ts` via `npx tsx`
- Waits for `/api/health`
- Sends a sample `budgetSummary` to `/api/ai/suggestions` and prints the parsed response
- Stops the background server process

The Vitest integration tests (in `server/tests/integration`) are preferred for CI and developer checks because they mock external providers and run quickly.

## CI and automation

- The repository's GitHub Actions workflow runs `npm ci`, type-check, `npm run test`, and `npm run build`.
- Integration tests are safe to run in CI because the Gemini calls are mocked.

## Security & secrets

- Never commit `GEMINI_API_KEY` or other secrets. Use your secret store or GitHub Actions secrets for CI/production.
- The proxy enforces input validation; still, treat provider responses as untrusted and normalize them before returning to clients.

## Troubleshooting

- `AI_BAD_REQUEST` typically means the incoming JSON did not parse (PowerShell `curl.exe` may change quoting). Use the PowerShell runner or `Invoke-RestMethod`.
- If the proxy returns `AI_UNAVAILABLE` or provider errors, check `GEMINI_API_KEY`, API quotas, and provider status. Provider errors are mapped to `503` or `502` by `aiProxyService.ts`.

## Development notes

- Add new integration tests under `server/tests/integration/` and mock external provider calls for speed and reliability.
- Keep server logic minimal — heavy domain logic should remain in the frontend local-first model unless a future phase expands backend responsibilities.

## License

Same license as the repository: AGPL-3.0. See top-level `LICENSE`.
