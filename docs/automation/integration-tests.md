Integration Tests (PowerShell runner)

Purpose: Describe how to run the AI-proxy integration checks locally and where integration tests live.

Files

- `scripts/run-ai-integration-tests.ps1` — PowerShell runner that starts the backend AI proxy, waits for health, posts a sample payload, prints the response, and stops the proxy.
- `server/tests/integration/aiProxy.integration.test.ts` — Vitest integration tests that exercise `POST /api/ai/suggestions` (the Gemini call is mocked in tests).

Prerequisites

- Node.js 18+ and `npm` installed
- Run `npm install` to install dev dependencies
- Optional: a valid `GEMINI_API_KEY` in `.env` to test real Gemini responses (not required for the mocked integration test)

Run the PowerShell runner

Open PowerShell in the repository root and run:

```powershell
pwsh .\scripts\run-ai-integration-tests.ps1
```

What it does:

- Starts `server/index.ts` via `npx tsx` in the background
- Waits for `http://localhost:3001/api/health` to respond
- Posts a sample `budgetSummary` payload to `POST /api/ai/suggestions`
- Prints the parsed JSON response (or error body)
- Stops the background server process

Run Vitest integration tests

The repository uses Vitest for integration and unit tests. To run the tests (includes the integration test that mocks the Gemini provider):

```bash
npm run test
```

Notes about the test design:

- `server/tests/integration/aiProxy.integration.test.ts` starts the server programmatically on an ephemeral port and mocks `getAiSuggestions` so tests remain hermetic.
- This approach verifies the HTTP validation and response normalization while avoiding network calls to Gemini.

CI / Automation

- The existing GitHub Actions CI runs `npm run test` (see `.github/workflows/ci.yml`). The integration tests are safe to run in CI because external Gemini calls are mocked.

Debugging tips

- PowerShell and `curl.exe` can alter quoting; prefer the PowerShell-native `Invoke-RestMethod` or the provided `run-ai-integration-tests.ps1` runner. If you need to use `curl.exe`, escape inner quotes, or send a payload file using `-d @payload.json`.
- If the proxy returns `AI_BAD_REQUEST`, capture the raw request (the runner already validates behavior). Use the runner to ensure the server receives valid JSON.

Cleaning up

- The repository briefly added extra debug logging during troubleshooting; the current `server/app.ts` has been restored to normal operation. If you see additional logs, search for temporary `rawBody` debug code and remove it.

Where to add more tests

- Recommended location for future integration tests: `server/tests/integration/` (same folder used here). Keep tests small and mock external providers when possible.
