# Project Structure

This document describes repository layout and code ownership boundaries. It covers where code lives and which document owns each topic, so structural notes do not get repeated in architecture or user guides.

## Navigation

- Previous: [docs/index.md](index.md)
- Next: [docs/usage-guide-section.md](usage-guide-section.md)
- Root: [README.md](../README.md)

## Repository Layout

```text
family-budget-app/
|-- docs/                  # Project documentation
|-- public/                # Static assets served by Vite
|-- server/                # Node/Express AI proxy
|   |-- docs/              # Backend-specific docs
|   |-- lib/               # Shared backend helpers
|   |-- providers/         # AI provider adapters
|   |-- aiProxyService.ts  # Backend AI orchestration
|   `-- app.ts             # Express app and routes
|-- src/                   # Frontend application
|   |-- assets/            # Icons and static frontend assets
|   |-- components/        # Layout, feature, UI, and debug components
|   |-- hooks/             # Stateful frontend orchestration
|   |-- i18n/              # Localization resources and helpers
|   |-- services/          # Persistence and API-facing services
|   |-- styles/            # Shared styling
|   |-- types/             # Shared TypeScript contracts
|   |-- utils/             # Pure helpers and migration utilities
|   |-- App.tsx            # Root application shell
|   `-- main.tsx           # Frontend bootstrap
|-- tests/                 # Vitest coverage
|-- README.md              # Repository overview
|-- package.json           # Scripts and dependencies
|-- tsconfig.json          # TypeScript configuration
|-- vite.config.ts         # Vite configuration
`-- vitest.config.ts       # Test runner configuration
```

## Frontend Boundaries

- `src/components/` contains render-focused code:
  - `layout/` for app shell pieces such as the header.
  - `features/` for domain-facing UI such as budget, profile, category, and AI flows.
  - `ui/` for reusable primitives.
  - `debug/` for targeted debugging helpers.
- `src/hooks/` owns stateful workflows such as budget updates, profile management, category CRUD, language synchronization, and saved suggestions.
- `src/services/` owns persistence and request logic such as profile storage, category storage, AI calls, and optional API wrappers.
- `src/types/` is the shared contract layer used by both frontend and backend code.

## Backend Boundaries

- `server/app.ts` defines HTTP routes, request validation entry points, and health checks.
- `server/aiProxyService.ts` owns backend-side request orchestration and error mapping.
- `server/providers/` contains pluggable provider adapters selected through `AI_PROVIDER`.
- `server/lib/` contains shared backend helpers that should not leak into UI code.
- `server/docs/` documents backend contracts in more detail than this repository-level structure guide.

## Tests and Documentation

- `tests/` covers frontend hooks, components, and integration scenarios.
- `docs/architecture/` owns runtime architecture and decision analysis.
- `docs/frontend/` owns frontend state and composition rules.
- `docs/automation/` owns CI/CD and integration test documentation.
- `docs/usage-guide-section.md` owns end-user workflow guidance.
- `docs/user-guide-category-management.md` owns detailed category-management behavior.

## Import Aliases

The frontend uses path aliases configured in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["src/*"],
    "@/components/*": ["src/components/*"],
    "@/hooks/*": ["src/hooks/*"],
    "@/services/*": ["src/services/*"],
    "@/types/*": ["src/types/*"],
    "@/utils/*": ["src/utils/*"],
    "@/assets/*": ["src/assets/*"]
  }
}
```

## Document Ownership

Use the most specific document for the topic:

- Repository layout: [project-structure.md](project-structure.md)
- Runtime architecture and API boundary: [architecture/SYSTEM_DESIGN.md](architecture/SYSTEM_DESIGN.md)
- Frontend state and persistence: [frontend/STATE.md](frontend/STATE.md)
- Frontend component rules: [frontend/STYLEGUIDE.md](frontend/STYLEGUIDE.md)
- End-user workflow: [usage-guide-section.md](usage-guide-section.md)
- Category CRUD details: [user-guide-category-management.md](user-guide-category-management.md)

---

Next: [docs/usage-guide-section.md](usage-guide-section.md)
