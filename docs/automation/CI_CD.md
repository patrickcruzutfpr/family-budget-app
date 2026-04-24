# CI/CD

This document describes the current GitHub Actions automation available in this repository and how it relates to the repository branch lifecycle.

## Navigation

- Previous: [docs/architecture/SYSTEM_DESIGN.md](../architecture/SYSTEM_DESIGN.md)
- Next: [docs/frontend/STATE.md](../frontend/STATE.md)
- Root: [README.md](../../README.md)

## Workflow Inventory

Current workflow file:

- `.github/workflows/ci.yml`

## Branch Lifecycle Context

The repository uses long-lived lifecycle branches:

- `develop`
- `staging`
- `production`

The branch policy itself is defined in [CONTRIBUTING.md](../../CONTRIBUTING.md). This CI/CD document should only describe how automation interacts with those branches.

## Workflow: CI

### Trigger rules

- `pull_request` targeting `main`
- `push` to `main`
- `push` to `add-rent-key`

These triggers reflect the workflow file as it exists today. If the project adopts branch-specific automation for `develop`, `staging`, or `production`, document that mapping here.

### Runtime

- Runner: `ubuntu-latest`
- Node version: `20`
- Package manager cache: npm

### Pipeline steps

1. Checkout repository
2. Setup Node.js
3. Install dependencies with `npm ci`
4. Type check with `npm run type-check`
5. Run tests with `npm run test`
6. Build frontend with `npm run build`

## Quality Gates

The CI pipeline currently enforces:

- Type safety validation
- Test pass requirement
- Build integrity check

A pull request is considered merge-ready when all CI steps pass.

## Suggested Evolution (Roadmap)

- Add a lint step (`npx eslint . --ext .ts,.tsx,.js`)
- Add test coverage threshold checks
- Add dependency vulnerability scanning
- Add preview deployment for pull requests

## Local Pre-CI Checklist

Run these commands before pushing:

```bash
npm ci: install dependencies
npm run type-check: type checker
npm run test: run vite automated tests
npm run build: build frontend
```

## Related Documents

- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [CHANGELOG.md](../../CHANGELOG.md)
- [server/docs/API.md](../../server/docs/API.md)

---

Next: [docs/frontend/STATE.md](../frontend/STATE.md)
