# Family Budget App

Local-first fullstack budget application with a React + TypeScript frontend in `src/` and a Node + TypeScript backend in `server/` for AI proxy features.

## Documentation Navigation

- Root (you are here): [README.md](README.md)
- Contribution rules: [CONTRIBUTING.md](CONTRIBUTING.md)
- Release history: [CHANGELOG.md](CHANGELOG.md)
- Project docs hub: [docs/index.md](docs/index.md)
- Backend setup guide: [server/README.md](server/README.md)

## Tech Stack

- Frontend: React 19, TypeScript, Vite
- Backend: Node.js, Express 5, TypeScript (`tsx` runtime)
- Testing: Vitest
- CI: GitHub Actions

## Monorepo Layout

```text
.
|- src/                   # Frontend application
|- server/                # Backend AI proxy
|- docs/                  # Product and engineering docs
|- tests/                 # Automated tests
|- package.json           # Shared scripts for frontend and backend
```

## Unified Quick Start (Frontend + Backend)

### 1. Prerequisites

- Node.js 18+
- npm 8+

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `.env` in the project root:

```env
# Cloud provider (Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# Local provider (LM Studio)
LLMSTUDIO_API_KEY=your_lm_studio_api_key_here
LLMSTUDIO_BASE_URL=http://127.0.0.1:1234/v1
LLMSTUDIO_MODEL=qwen2.5-coder-32b

PORT=3001

# Active adapter: gemini | llmstudio
AI_PROVIDER=llmstudio
```

Notes:

- `AI_PROVIDER=gemini` uses `GEMINI_API_KEY`.
- `AI_PROVIDER=llmstudio` uses LM Studio's OpenAI-compatible local server.
- For LM Studio local runs, start the local API before requesting suggestions (for example: `lms server start`).

Optional frontend metadata (`.env` or `.env.local`):

```env
VITE_APP_TITLE=Family Budget App
VITE_APP_VERSION=0.0.0
```

### 4. Run both apps together

```bash
npm run dev:full
```

Expected local endpoints:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### 5. Optional split mode

Run each process separately in different terminals:

```bash
npm run dev:client
npm run dev:server
```

- `npm run dev:client`: starts the Vite frontend development server.
- `npm run dev:server`: starts the backend server in watch mode with `tsx`.

## Scripts

- `npm run dev`: starts the frontend Vite development server.
- `npm run dev:client`: starts the frontend Vite development server explicitly for split mode.
- `npm run dev:server`: starts the backend with file watching for local backend development.
- `npm run dev:full`: runs frontend and backend together in parallel.
- `npm run server:start`: starts the backend once without watch mode.
- `npm run type-check`: runs TypeScript type checking without emitting files.
- `npm run test`: runs the Vitest suite once.
- `npm run test:watch`: runs Vitest in watch mode for active development.
- `npm run test:coverage`: runs tests once and generates a coverage report.
- `npm run build`: creates the production frontend build with Vite.
- `npm run preview`: serves the production frontend build locally for verification.

## Architecture Summary

1. Frontend computes a sanitized budget summary.
2. Frontend calls `POST /api/ai/suggestions` on the backend.
3. Backend validates input, calls provider adapters, and normalizes output.
4. Frontend renders suggestions and can fall back to mock responses if needed.

For full details, see [docs/architecture/SYSTEM_DESIGN.md](docs/architecture/SYSTEM_DESIGN.md).

## Column Filter (Unified)

- The budget breakdown now has a single page-level filter icon that controls visible columns for all budget tables.
- The same visibility selection is applied to income and expense tables to keep the view consistent.
- Preferences are persisted in local storage under a scoped key for the page.

## Test Coverage For Column Filter

- Hook behavior and persistence are covered in [tests/hooks/useColumnVisibility.test.ts](tests/hooks/useColumnVisibility.test.ts).
- Table rendering with visible/hidden columns is covered in [tests/components/BudgetTable.test.tsx](tests/components/BudgetTable.test.tsx).

## Documentation Sequence

1. [README.md](README.md)
2. [docs/index.md](docs/index.md)
3. `docs/{directory}` content:
   - [docs/architecture/SYSTEM_DESIGN.md](docs/architecture/SYSTEM_DESIGN.md)
   - [docs/automation/CI_CD.md](docs/automation/CI_CD.md)
   - [docs/STATE.md](docs/STATE.md)
   - [docs/STYLEGUIDE.md](docs/STYLEGUIDE.md)

## License

AGPL-3.0. See [LICENSE](LICENSE).

---

Next: [CONTRIBUTING.md](CONTRIBUTING.md)
