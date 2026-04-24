# Backend Setup Guide

This document covers backend installation, execution, and environment configuration for the AI proxy in `server/`.

## Navigation

- Previous: [docs/frontend/STYLEGUIDE.md](../docs/frontend/STYLEGUIDE.md)
- Next: [server/docs/API.md](docs/API.md)
- Root: [README.md](../README.md)

## Prerequisites

- Node.js 18+
- npm 8+

## Install

Install dependencies from repository root:

```bash
npm install
```

## Run Backend in Development

From repository root:

```bash
npm run dev:server
```

This starts the backend with watch mode (`tsx watch server/index.ts`).

## Run Backend Once (No Watch)

```bash
npm run server:start
```

## Health Checks

Basic health:

```bash
curl http://localhost:3001/api/health
```

Deep health:

```bash
curl http://localhost:3001/api/health?deep=true
```

## Environment Variables

Define variables in root `.env` (or in your deployment environment):

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Yes (for real AI responses) | N/A | API key used by server-side provider adapter |
| `PORT` | No | `3001` | Backend listening port |
| `AI_PROVIDER` | No | `gemini` | Active provider adapter key |

Example `.env`:

```env
GEMINI_API_KEY=your_api_key_here
PORT=3001
AI_PROVIDER=gemini
```

## Fullstack Run (Frontend + Backend)

If you want both services running together:

```bash
npm run dev:full
```

## Backend Verification Commands

```bash
npm run type-check
npm run test
```

## Related Backend Docs

- [server/docs/API.md](docs/API.md)
- [server/docs/DATABASE.md](docs/DATABASE.md)
- [server/docs/index.md](docs/index.md)

---

Next: [server/docs/API.md](docs/API.md)
