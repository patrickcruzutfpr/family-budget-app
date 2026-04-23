# Server Workflows

## Local development

- Install dependencies at repo root: `npm install`
- Start server only: `npm run dev:server`
- Start frontend + server: `npm run dev:full`
- Use `pwsh scripts/run-ai-integration-tests.ps1` for an end-to-end local smoke test.

## Testing

- Unit tests: `npm run test` (Vitest runs server unit and integration tests)
- Integration tests are under `server/tests/integration` and mock external providers.

## CI

- CI pipeline (see `.github/workflows/ci.yml`) runs:
  - `npm ci`
  - `npm run type-check`
  - `npm run test`
  - `npm run build`

## Release / Deployment

- Build and package server as part of the deployment artifact or deploy the server as a small Node service.
- Use environment secrets for `GEMINI_API_KEY`.
- Monitor provider usage and error rates in production.
