# C. Container and Component View (C4 L2/L3)

## C4 L2 - Containers

### Container 1: Web SPA (React)
- Tech: React 19 + TypeScript + Vite.
- Responsibilities:
  - Render budgeting UI.
  - Manage local state and interactions.
  - Trigger local persistence and external calls.

### Container 2: Browser local persistence
- Tech: localStorage.
- Responsibilities:
  - Store profiles, current profile ID, language, and saved suggestions.
  - Retain client data across sessions.

### Container 3: External AI provider
- Tech: Google Gemini API via @google/genai.
- Responsibilities:
  - Return structured suggestion payloads from budget summaries.

### Container 4 (optional/incomplete): Flask backend API integration
- Tech: HTTP fetch wrapper.
- Responsibilities:
  - Health, users, and categories endpoints.
- Note: Not used as core budget/profile source in current app flow.

## C4 L3 - Internal frontend components

### Presentation layer
- App shell and modal orchestration: App.tsx
- Feature components: budget table/chart, profile manager, category manager, AI feature.
- i18n and notifications as global providers.

### Application layer (hooks)
- useBudget: core budget state mutation and persistence orchestration.
- useProfileManager: profile CRUD/switch/export/import orchestration.
- useSavedSuggestions: profile/language-aware suggestion persistence.

### Domain/service layer
- profileService: profile lifecycle, current profile management, import/export.
- categoryService: category CRUD on current profile budget.
- geminiService: AI request construction and parsing.
- apiService: optional backend HTTP client.

### Support layer
- i18n utilities and locale resources.
- migration utilities for category legacy keys and icon enrichment.
- shared TypeScript types.

## Coupling and hidden dependencies
- Event-based coupling via window events:
  - profileChanged
  - categoryDataChanged
  - ai-suggestions-updated
- Implicit key contracts in localStorage:
  - familyBudgetProfiles
  - currentProfileId
  - family-budget-language
  - family-budget-saved-suggestions[-profileId]
- Dual persistence path in budget logic (profile-first with legacy fallback).

## Unknowns
- Unknown: Intended ownership boundaries between optional backend API and current local domain.
  - Evidence needed: ADR or roadmap clarifying target architecture.
- Unknown: Expected long-term decomposition (single frontend app vs backend-centric).
  - Evidence needed: architecture decision records.

## Evidence
- App orchestration and feature composition: src/App.tsx
- Bootstrap/providers: src/main.tsx
- Hook boundaries: src/hooks/useBudget.ts, src/hooks/useSavedSuggestions.ts
- Service boundaries: src/services/profileService.ts, src/services/categoryService.ts, src/services/geminiService.ts, src/services/apiService.ts
- Migration/event behavior: src/utils/categoryMigration.ts
- Type contracts: src/types/index.ts
