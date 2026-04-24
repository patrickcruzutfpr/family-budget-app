# Mermaid Diagrams

Below are diagrams describing the high-level request flow and interactions. Use any Mermaid renderer (or VS Code extension) to preview.

## AI Proxy Sequence

```mermaid
sequenceDiagram
  participant SPA as Frontend SPA
  participant Proxy as Node AI Proxy
  participant Loader as Provider Loader
  participant Provider as Active Provider Adapter
  participant External as External Provider Endpoint

  SPA->>Proxy: POST /api/ai/suggestions { language, budgetSummary }
  Proxy-->>Proxy: validate & sanitize payload
  Proxy->>Loader: select provider (AI_PROVIDER)
  Loader->>Provider: getAiSuggestions(budgetSummary, language)

  alt provider == gemini
    Provider->>External: generateContent(prompt)
    External-->>Provider: response (json text)
    Provider-->>Loader: normalizedSuggestions
  else provider == llmstudio
    Provider->>External: POST /chat/completions (json_schema)
    External-->>Provider: choices[0].message.content (json text)
    Provider-->>Loader: normalizedSuggestions
  else mocked provider (tests/CI)
    Provider-->>Loader: normalizedSuggestions (mock)
  end

  Loader-->>Proxy: normalizedSuggestions
  Proxy-->>SPA: 200 { suggestions: [...] }

  alt provider/network error
    Provider-->>Loader: throws Error
    Loader-->>Proxy: maps to AppApiError (AI_UNAVAILABLE / AI_BAD_RESPONSE)
    Proxy-->>SPA: error response (503 / 502)
  end
```

## Deployment Context

```mermaid
flowchart LR
  Browser -->|HTTP| CDN[Static Frontend]
  Browser -->|HTTP| Proxy[Node AI Proxy]
  Proxy -->|HTTPS| Gemini[Google Gemini API]
  Proxy -->|HTTP| LMStudio[LM Studio Local API]
  subgraph Local
    CDN
    Proxy
    LMStudio
  end
```

Feel free to extract these blocks into `.mmd` files for rendering elsewhere.

## Provider pluggability (mermaid)

```mermaid
flowchart LR
  SPA[Frontend SPA] -->|POST /api/ai/suggestions| Proxy[Node AI Proxy]
  Proxy -->|select provider via AI_PROVIDER| Loader[Provider Loader]
  Loader --> Gemini[gemini]
  Loader --> LLMStudio[llmstudio]
  Loader -->|calls| ActiveProvider
  ActiveProvider -->|returns normalized| Proxy
  Proxy -->|200| SPA
```

Use this diagram to reason about adding adapters under `server/providers/` and to illustrate provider failover and mocking in tests.
