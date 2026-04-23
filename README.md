# Family Budget App

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://opensource.org/licenses/AGPL-3.0)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node](https://img.shields.io/badge/Node->=18-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org)
[![i18n: English & Portuguese](https://img.shields.io/badge/i18n-EN%20%2F%20PT-success.svg)](https://github.com/patrickcruzutfpr/family-budget-app/tree/main/src/i18n/locales)

Local-first family budgeting app built with React, TypeScript, and Vite. It supports multiple profiles, category management, native React/SVG charts, bilingual UI, and AI-powered suggestions through an in-repo Node proxy for Google Gemini.

## Index

- [Overview](#overview)
- [Recent Changes](#recent-changes)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Available Scripts](#available-scripts)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [AI Features](#ai-features)
- [Build and Deployment](#build-and-deployment)
- [Documentation](#documentation)
- [Support](#support)
- [License](#license)

## Overview

The app keeps the main budget domain local-first in `localStorage`: budgets, profiles, categories, language, and saved AI suggestions remain browser-owned. The only backend responsibility currently in scope is AI suggestion generation through `/api/ai/suggestions`, which protects the Gemini key from the browser bundle.

## Recent Changes

- Phase 1 stabilized bootstrap behavior and aligned category deletion so items move safely to `Other`
- Phase 2 added CI quality gates, removed `recharts`, and replaced charts with a native React/SVG implementation
- Phase 3 moved Gemini calls behind a Node/Express proxy so `GEMINI_API_KEY` no longer belongs in the browser bundle
- Local development now supports a dual-process workflow: Vite frontend plus backend AI proxy

## Key Features

- Budget tracking with projected vs actual values
- Category CRUD with icons and colors
- Safe category deletion with automatic transfer to `Other`
- Multiple profiles with import and export
- Native React/SVG charts with lazy loading
- English and pt-BR support
- AI-powered suggestions via backend Gemini proxy with mock fallback
- Type-safe codebase and automated CI quality gates

## Architecture

Current runtime shape:

- Frontend: React 19 + TypeScript + Vite SPA
- Backend: minimal Node/Express AI proxy for Gemini
- Storage: browser `localStorage` for profiles, budgets, language, and saved suggestions
- AI path: frontend sends a sanitized budget summary to `/api/ai/suggestions`
- i18n: custom context-based translation system

Project structure:

```text
src/       React app, hooks, services, types, styles, assets
server/    Node/Express AI proxy for Gemini
tests/     Vitest coverage for frontend services, hooks, and backend proxy logic
docs/      Project and architecture documentation
.github/   CI workflow and consulting/refactoring artifacts
```

Important implementation notes:

- Charts are implemented with native React/SVG, not `recharts`
- AI requests are proxied server-side; the browser no longer imports `@google/genai`
- Tailwind is still provided through the CDN configured in [index.html](/c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/index.html)

## Tech Stack

- React 19.1.1
- TypeScript 5.x
- Vite 6.x
- Node.js 18+
- Express 5
- Google Gemini via `@google/genai` on the backend only
- Vitest + React Testing Library

## Available Scripts

```bash
# Frontend / backend development
npm run dev          # alias for frontend dev server
npm run dev:client   # frontend only
npm run dev:server   # backend AI proxy only
npm run dev:full     # frontend + backend together
npm run server:start # backend AI proxy without watch mode

# Verification
npm run type-check
npm run test
npm run test:watch
npm run test:coverage
npm run build
npm run preview
```

## Getting Started

Prerequisites:

- Node.js 18+
- npm 8+
- Modern browser
- Optional Gemini API key for real AI suggestions

Install and run:

```powershell
git clone https://github.com/patrickcruzutfpr/family-budget-app.git
cd family-budget-app
npm install
Copy-Item .env.example .env.local
npm run dev:full
```

Default local endpoints:

- Frontend: `http://localhost:5173`
- Backend AI proxy: `http://localhost:3001`

Notes:

- If port `5173` is busy, Vite will move to the next available port
- The current styling setup still depends on the Tailwind CDN injected in `index.html`
- Without a Gemini key, the app still runs, but real AI suggestions are unavailable

## Environment Variables

Backend:

- `GEMINI_API_KEY`: required for real Gemini suggestions
- `PORT`: optional backend port, defaults to `3001`

Frontend metadata:

- `VITE_APP_TITLE`
- `VITE_APP_VERSION`

## AI Features

The AI flow is now:

1. The frontend builds a sanitized budget summary from the current `BudgetState`
2. The frontend sends that payload to `POST /api/ai/suggestions`
3. The backend proxy calls Gemini server-side
4. The backend normalizes responses to `AISuggestion[]`
5. If the proxy returns `AI_UNAVAILABLE`, the frontend falls back to `geminiServiceMock`

Current AI-related capabilities:

- Profile-aware suggestions
- Language-aware responses in EN/PT
- Backend-owned secret boundary for Gemini
- Stable app-level error responses for the AI path
- Mock fallback for provider unavailability

Relevant files:

- [src/services/geminiService.ts](/c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/src/services/geminiService.ts)
- [src/services/geminiServiceMock.ts](/c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/src/services/geminiServiceMock.ts)
- [server/app.ts](/c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/server/app.ts)
- [server/aiProxyService.ts](/c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/server/aiProxyService.ts)

## Build and Deployment

Frontend build:

```bash
npm run build
npm run preview
```

Build output:

```text
dist/
  assets/
  index.html
```

Deployment guidance:

- Full AI-enabled deployment requires both the frontend build and the Node AI proxy
- Static frontend-only hosting is still possible, but real Gemini suggestions will not work without the backend proxy
- `GEMINI_API_KEY` should exist only in the backend environment

## Documentation

Project documentation:

Refactoring artifacts:

- [Phase 1 Walkthrough](./.github/consulting/20260423/recommended-refactoring/phase-1/6-walkthrough.md)
- [Phase 2 Walkthrough](./.github/consulting/20260423/recommended-refactoring/phase-2/4-walkthrough.md)
- [Phase 3 Walkthrough](./.github/consulting/20260423/recommended-refactoring/phase-3/6-walkthrough.md)

## Support

- Open an issue at [GitHub Issues](https://github.com/patrickcruzutfpr/family-budget-app/issues)
- Check the docs in `docs/`
- Review the troubleshooting and architecture notes before reporting regressions

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

See [LICENSE](./LICENSE) for details.
