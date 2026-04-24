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
GEMINI_API_KEY=your_api_key_here
PORT=3001
AI_PROVIDER=gemini
```

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

## Scripts

```bash
npm run dev
npm run dev:client
npm run dev:server
npm run dev:full
npm run server:start
npm run type-check
npm run test
npm run test:watch
npm run test:coverage
npm run build
npm run preview
```

## Architecture Summary

1. Frontend computes a sanitized budget summary.
2. Frontend calls `POST /api/ai/suggestions` on the backend.
3. Backend validates input, calls provider adapters, and normalizes output.
4. Frontend renders suggestions and can fall back to mock responses if needed.

For full details, see [docs/architecture/SYSTEM_DESIGN.md](docs/architecture/SYSTEM_DESIGN.md).

## Documentation Sequence

1. [README.md](README.md)
2. [docs/index.md](docs/index.md)
3. `docs/{directory}` content:
   - [docs/architecture/SYSTEM_DESIGN.md](docs/architecture/SYSTEM_DESIGN.md)
   - [docs/automation/CI_CD.md](docs/automation/CI_CD.md)
   - [docs/frontend/STATE.md](docs/frontend/STATE.md)
   - [docs/frontend/STYLEGUIDE.md](docs/frontend/STYLEGUIDE.md)

## License

AGPL-3.0. See [LICENSE](LICENSE).

---

Next: [CONTRIBUTING.md](CONTRIBUTING.md)
