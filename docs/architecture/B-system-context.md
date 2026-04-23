# B. System Context (C4 L1)

## System under analysis
- System: Family Budget App
- Type: Browser-based single-page budgeting application
- Primary responsibility: Allow users to manage household budget profiles, categories, and AI-assisted suggestions.

## Actors
- End User (individual/family budget manager)
  - Creates and edits budget items/categories.
  - Manages profiles (switch, duplicate, import/export).
  - Requests and saves AI suggestions.

## External systems
- In-repo Node AI proxy
  - Exposes `/api/ai/suggestions` to the SPA.
  - Owns Gemini secret handling, prompt construction, and provider error mapping.
- Google Gemini API
  - Provides AI-generated budget suggestions to the backend proxy.
- Optional Flask backend API (integration module present)
  - Exposes users/categories endpoints in service layer.
  - Appears supplementary, not the source of truth for budget/profile domain.

## System context diagram (text)
```text
[End User]
   |
   v
[Family Budget App SPA (React/Vite)]
   |\
   | \__ localStorage (profiles, budget, language, saved suggestions)
   |
   \____ HTTP -> [Node AI Proxy /api/ai/suggestions] ---- HTTPS -> [Google Gemini API]

(Optional path)
[Family Budget App SPA] ---- HTTP -> [Flask API /api/v1 users/categories]
```

## Boundaries
- Inside boundary:
  - UI components, hooks, services, i18n, local persistence logic.
- Outside boundary:
  - Gemini provider.
  - Optional external API backend.

## Unknowns
- Unknown: Production user personas and role segmentation.
  - Evidence needed: product analytics, user research, documented personas.
- Unknown: Real production hosting topology and environment separation.
  - Evidence needed: deployment manifests, hosting configuration, environment docs.
- Unknown: Authoritative backend strategy for long-term data sync.
  - Evidence needed: roadmap docs or backend ADRs.

## Evidence
- Domain description and feature list: README.md
- SPA bootstrap and providers: src/main.tsx
- Functional composition and user operations: src/App.tsx
- AI proxy integration: src/services/geminiService.ts, server/app.ts, server/aiProxyService.ts
- Optional backend integration client: src/services/apiService.ts
- Local storage-driven profile model: src/services/profileService.ts
- Saved suggestion local persistence by profile/language: src/hooks/useSavedSuggestions.ts
