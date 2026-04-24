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
| `LLMSTUDIO_API_KEY` | Yes (when `AI_PROVIDER=llmstudio`) | N/A | API key sent to LM Studio OpenAI-compatible endpoint |
| `LLMSTUDIO_BASE_URL` | No | `http://127.0.0.1:1234/v1` | Base URL for LM Studio local server |
| `LLMSTUDIO_MODEL` | No | `qwen2.5-coder-32b` | Model identifier used for completion requests |
| `PORT` | No | `3001` | Backend listening port |
| `AI_PROVIDER` | No | `gemini` | Active provider adapter key |

Example `.env`:

```env
GEMINI_API_KEY=your_api_key_here
LLMSTUDIO_API_KEY=your_llmstudio_api_key_here
LLMSTUDIO_BASE_URL=http://127.0.0.1:1234/v1
LLMSTUDIO_MODEL=qwen2.5-coder-32b
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
