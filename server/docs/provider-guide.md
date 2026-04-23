# Provider Guide — Server

This document explains the provider adapter pattern used by the server AI proxy and how to add or test providers.

Location

- Provider adapters: `server/providers/`
- Provider loader: `server/providers/index.ts`
- Public server API: `POST /api/ai/suggestions` handled by `server/app.ts` -> `server/aiProxyService.ts`

How it works

- The server selects a provider via the `AI_PROVIDER` environment variable (defaults to `gemini`).
- Provider adapters must export a default object with an async function `getAiSuggestions(budgetSummary, language)` that returns `{ suggestions: [{ title, suggestion }] }`.
- The adapter receives already-validated `budgetSummary` and a `language` string (`en` or `pt-BR`).
- Adapters should throw `AppApiError` for expected errors (e.g. misconfiguration) and let unexpected errors bubble so `aiProxyService` can map them to `AI_UNAVAILABLE` or `AI_BAD_RESPONSE`.

Adapter skeleton

```ts
// server/providers/example.ts
import type { BudgetSummary } from '../../src/types';
import { AppApiError } from '../lib/aiHelpers';

export default {
  async getAiSuggestions(budgetSummary: BudgetSummary, language: 'en' | 'pt-BR') {
    // Validate runtime config (API keys, endpoints)
    if (!process.env.EXAMPLE_API_KEY) {
      throw new AppApiError('AI_MISCONFIGURED', 'Example provider not configured', 500);
    }

    // Call provider SDK or HTTP API and normalize result
    const raw = await callProvider(budgetSummary, language);
    return normalizeProviderResponse(raw);
  },
};
```

Testing adapters

- Unit test the adapter in isolation by mocking the provider SDK or HTTP client.
- Integration tests under `server/tests/integration` should mock `getAiSuggestions` to avoid network calls.
- Use `AI_PROVIDER` to switch providers for local manual testing. In PowerShell:

```powershell
$env:AI_PROVIDER = 'example'
npm run dev:server
```

Best practices

- Keep prompt-building and normalization logic in `server/lib/aiHelpers.ts` when shared across adapters.
- Return predictable, minimal shapes back to `aiProxyService` — arrays of `{ title, suggestion }`.
- Avoid making heavy domain decisions on the server; keep business logic local-first in the SPA.

Security

- Never embed API keys in the frontend. Keep keys for providers in server-side environment variables or secret stores.

