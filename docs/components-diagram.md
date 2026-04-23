# Components Diagram — Family Budget App

This diagram shows the main runtime components and how they interact.

```mermaid
graph LR
  subgraph Client
    SPA[Frontend SPA]
    Local[LocalStorage]
    CDN[CDN / Static Host]
  end

  SPA --> Local
  SPA -->|HTTP POST /api/ai/suggestions| Proxy
  CDN --> SPA

  subgraph Server
    Proxy["Node AI Proxy (Express)"]
    App["server/app.ts"]
    Service["server/aiProxyService.ts"]
    Loader["server/providers/index.ts (loader)"]
    Providers["server/providers/*"]
    Helpers["server/lib/aiHelpers.ts"]
  end

  Proxy --> App
  App --> Service
  Service --> Loader
  Loader --> Providers
  Providers --> Helpers

  subgraph External
    Gemini["Google Gemini (@google/genai)"]
    OpenAI[OpenAI API]
    Ollama["Ollama (local)"]
  end

  Providers -->|calls provider SDK/HTTP| Gemini
  Providers -->|calls provider SDK/HTTP| OpenAI
  Providers -->|calls provider SDK/HTTP| Ollama

  CI["CI / Vitest"] -->|mocks Provider| Loader
  Scripts["scripts/run-ai-integration-tests.ps1"] -->|starts server & posts test payload| Proxy
  Health["GET /api/health"] -.-> App

  classDef infra fill:#f9f,stroke:#333,stroke-width:1px;
  class CDN,Proxy,App,Service,Loader,Providers,Helpers,CI,Scripts,Health infra;
```

Notes:

- The SPA owns local persistence (`localStorage`) and constructs the sanitized `BudgetSummary` payload.
- The Node AI Proxy centralizes provider keys and delegates to provider adapters via the loader.
- Providers are pluggable; `AI_PROVIDER` selects the active adapter. CI and tests mock adapters to avoid network.
- `server/lib/aiHelpers.ts` contains shared prompt-building and normalization logic.

