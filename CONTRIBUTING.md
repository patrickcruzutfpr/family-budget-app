# Contributing Guide

Thank you for contributing to Family Budget App.

## Navigation

- Previous: [README.md](README.md)
- Next: [CHANGELOG.md](CHANGELOG.md)
- Docs hub: [docs/index.md](docs/index.md)

## Branch Naming

Use short, descriptive branches with a typed prefix:

- `feature/<short-description>`
- `bugfix/<short-description>`
- `hotfix/<short-description>`
- `chore/<short-description>`
- `docs/<short-description>`
- `refactor/<short-description>`

Examples:

- `feature/profile-export-improvements`
- `bugfix/ai-error-fallback`

## Branch Lifecycle

This repository uses long-lived environment branches to represent the delivery lifecycle:

- `develop`: primary integration branch for ongoing development work
- `staging`: pre-production branch for release candidate validation
- `production`: stable production branch

Use these branches as environment stages, not as feature branch names.

Recommended flow:

1. Create a short-lived branch from `develop`, such as `feature/profile-export-improvements`.
2. Merge completed work back into `develop`.
3. Promote approved changes from `develop` to `staging`.
4. Promote the final release from `staging` to `production`.

Guidelines:

- Do day-to-day feature work in short-lived branches.
- Keep promotion between long-lived branches intentional and reviewable.
- Use `hotfix/*` branches only for urgent fixes, then back-merge them into the earlier lifecycle branches as needed.
- Keep release notes and deployment notes aligned with promotions to `staging` and `production`.

## Commit Message Standard (Conventional Commits)

Follow this format:

```text
<type>(optional-scope): <summary>
```

Common types:

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation changes
- `refactor`: code changes without behavior change
- `test`: tests
- `chore`: maintenance tasks
- `ci`: CI/CD updates
- `build`: build/dependency changes

Examples:

- `feat(frontend): add profile import confirmation`
- `fix(server): map invalid provider payload to AI_BAD_RESPONSE`
- `docs(architecture): add system interaction sequence`

## Pull Request Expectations

1. Keep PRs focused on a single concern.
2. Link related issues in the PR description.
3. Add tests for behavior changes.
4. Update docs when API, behavior, or setup changes.
5. Ensure CI is green before requesting review.

## Code Style and Formatting

This repository uses Prettier and ESLint.

### Prettier (from `.prettierrc.js`)

- Semicolons: required
- Quotes: single quotes
- Print width: 100
- Trailing commas: all
- Indentation: 2 spaces

Run formatting:

```bash
npx prettier --write .
```

### ESLint (from `.eslintrc.js`)

- TypeScript + React + React Hooks + accessibility plugin rules
- Import ordering is enforced
- Unused vars are errors (`_` prefix ignored)
- `console.log` discouraged (`warn`/`error` allowed)

Run linting:

```bash
npx eslint . --ext .ts,.tsx,.js
```

## Local Validation Checklist

Before opening a PR, run:

```bash
npm run type-check
npm run test
npm run build
```

## Documentation Rule

When you change documentation structure, keep the hierarchy connected:

1. Root: [README.md](README.md)
2. Secondary index: [docs/index.md](docs/index.md)
3. Domain docs: `docs/{directory}`

---

Next: [CHANGELOG.md](CHANGELOG.md)
