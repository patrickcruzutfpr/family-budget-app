# CI/CD

This document describes the current GitHub Actions automation available in this repository.

## Navigation

- Previous: [docs/architecture/SYSTEM_DESIGN.md](../architecture/SYSTEM_DESIGN.md)
- Next: [docs/frontend/STATE.md](../frontend/STATE.md)
- Root: [README.md](../../README.md)

## Workflow Inventory

Current workflow file:

- `.github/workflows/ci.yml`

## Workflow: CI

### Trigger rules

- `pull_request` targeting `main`
- `push` to `main`
- `push` to `add-rent-key`

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
npm ci
npm run type-check
npm run test
npm run build
```

## Related Documents

- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [CHANGELOG.md](../../CHANGELOG.md)
- [server/docs/API.md](../../server/docs/API.md)

---

Next: [docs/frontend/STATE.md](../frontend/STATE.md)
