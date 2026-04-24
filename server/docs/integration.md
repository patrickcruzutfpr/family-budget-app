# Integration & Local Smoke Tests

This page describes how to run local end-to-end checks and the included PowerShell runner.

Local smoke runner

A convenience PowerShell script is included at `scripts/run-ai-integration-tests.ps1`. It:

- Starts the server with `npx tsx server/index.ts`
- Waits for `/api/health`
- Posts a small `budgetSummary` payload to `POST /api/ai/suggestions`
- Prints the parsed response and exits

Usage (PowerShell):

```powershell
pwsh .\scripts\run-ai-integration-tests.ps1
```

Provider setup before smoke tests

- Gemini mode:
	- Set `AI_PROVIDER=gemini`
	- Ensure `GEMINI_API_KEY` is set
- LM Studio mode:
	- Set `AI_PROVIDER=llmstudio`
	- Ensure `LLMSTUDIO_API_KEY` is set
	- Start LM Studio API server (for example: `lms server start`)
	- Optional overrides: `LLMSTUDIO_BASE_URL`, `LLMSTUDIO_MODEL`

Quick readiness checks:

```powershell
Invoke-RestMethod -Uri http://localhost:3001/api/health
Invoke-RestMethod -Uri http://localhost:3001/api/health?deep=true
```

Notes about PowerShell & `curl.exe`

- PowerShell's `curl` is an alias to `Invoke-WebRequest` on some systems; `curl.exe` can be used, but be careful with quoting. For JSON payloads prefer `Invoke-RestMethod` or write the payload to a file and use `-d @payload.json` with `curl.exe`.

- Example using `Invoke-RestMethod`:

```powershell
$body = @{ language = 'en'; budgetSummary = @{ totalIncome = 3000; expenses = @(@{ category = 'Food'; projected = 400; actual = 450 }) } }
Invoke-RestMethod -Uri http://localhost:3001/api/ai/suggestions -Method Post -Body ($body | ConvertTo-Json -Depth 10) -ContentType 'application/json'
```

Vitest integration tests

- Integration tests live under `server/tests/integration` and are run by `npm run test`.
- The test harness starts the server programmatically and stubs or mocks `getAiSuggestions` to avoid external calls.

CI behavior

- In CI, provider calls are mocked. If you need to run a live provider check in CI, ensure secrets are injected via your platform's secrets store and adjust the workflow accordingly.

Troubleshooting

- If you see `AI_BAD_REQUEST` when posting from PowerShell, inspect the raw request body (the PowerShell runner shows the raw payload) and prefer `Invoke-RestMethod` for safe JSON encoding.

