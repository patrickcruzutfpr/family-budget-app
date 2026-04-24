Integration Tests (PowerShell runner)

Purpose: Describe how to run the AI-proxy integration checks locally and where integration tests live.

Files

- `scripts/run-ai-integration-tests.ps1` — PowerShell runner that starts the backend AI proxy, waits for health, posts a sample payload, prints the response, and stops the proxy.
- `server/tests/integration/aiProxy.integration.test.ts` — Vitest integration tests that exercise `POST /api/ai/suggestions` (provider call is mocked in tests).
- `tests/server/providerLoader.test.ts` — Unit tests for provider selection and fallback behavior.
- `tests/server/llmstudioProvider.test.ts` — Unit tests for the LM Studio provider adapter.

Prerequisites

- Node.js 18+ and `npm` installed
- Run `npm install` to install dev dependencies
- Optional real-provider checks:
	- Gemini: `GEMINI_API_KEY` and `AI_PROVIDER=gemini`
	- LM Studio: `LLMSTUDIO_API_KEY`, `AI_PROVIDER=llmstudio`, and local LM Studio server running

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

The repository uses Vitest for integration and unit tests. To run all tests (including integration and provider adapter tests):

```bash
npm run test
```

Notes about the test design:

- `server/tests/integration/aiProxy.integration.test.ts` starts the server programmatically on an ephemeral port and mocks `getAiSuggestions` so tests remain hermetic.
- This approach verifies HTTP validation and response normalization while avoiding network calls to external providers.

CI / Automation

- The existing GitHub Actions CI runs `npm run test` (see `.github/workflows/ci.yml`). Integration tests are safe in CI because external provider calls are mocked.

Debugging tips

- PowerShell and `curl.exe` can alter quoting; prefer the PowerShell-native `Invoke-RestMethod` or the provided `run-ai-integration-tests.ps1` runner. If you need to use `curl.exe`, escape inner quotes, or send a payload file using `-d @payload.json`.
- If the proxy returns `AI_BAD_REQUEST`, capture the raw request (the runner already validates behavior). Use the runner to ensure the server receives valid JSON.

Cleaning up

- The repository briefly added extra debug logging during troubleshooting; the current `server/app.ts` has been restored to normal operation. If you see additional logs, search for temporary `rawBody` debug code and remove it.

Where to add more tests

- Recommended location for future integration tests: `server/tests/integration/` (same folder used here). Keep tests small and mock external providers when possible.
