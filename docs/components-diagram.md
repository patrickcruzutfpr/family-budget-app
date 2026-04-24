# Components Diagram

This page is a companion to the canonical architecture guide in [architecture/SYSTEM_DESIGN.md](architecture/SYSTEM_DESIGN.md). It only keeps the runtime component map so contracts, error handling, and deployment notes do not get duplicated here.

```mermaid
graph LR
  subgraph Client
    SPA[Frontend SPA]
    Local[localStorage]
    CDN[CDN or static host]
  end

  SPA --> Local
  SPA -->|POST /api/ai/suggestions| Proxy
  CDN --> SPA

  subgraph Server
    Proxy[Node AI Proxy]
    App[server/app.ts]
    Service[server/aiProxyService.ts]
    Loader[server/providers/index.ts]
    Providers[server/providers/*]
    Helpers[server/lib/aiHelpers.ts]
  end

  Proxy --> App
  App --> Service
  Service --> Loader
  Loader --> Providers
  Providers --> Helpers

  subgraph External
    Gemini[Google Gemini]
    OpenAI[OpenAI API]
    Ollama[Ollama]
  end

  Providers --> Gemini
  Providers --> OpenAI
  Providers --> Ollama

  CI[CI and Vitest] -->|mocks provider| Loader
  Health[GET /api/health] -.-> App
```

## Ownership

- Architecture narrative: [architecture/SYSTEM_DESIGN.md](architecture/SYSTEM_DESIGN.md)
- Frontend state and persistence: [frontend/STATE.md](frontend/STATE.md)
- Backend API details: [server/docs/API.md](../server/docs/API.md)
