# Frontend Style Guide

This document defines frontend composition patterns, including Container vs Presentational separation and UI component usage rules.

## Navigation

- Previous: [docs/frontend/STATE.md](STATE.md)
- Next: [server/README.md](../../server/README.md)
- Root: [README.md](../../README.md)

## 1. Design Principles

- Keep domain behavior in hooks/services.
- Keep components focused and predictable.
- Prefer composition over monolithic components.
- Preserve strict TypeScript typing across props and models.

## 2. Container vs Presentational Pattern

## 2.1 Container components

Container components should:

- orchestrate hooks and services
- handle async workflows and side effects
- map domain state into view props
- keep minimal markup concerns

Typical location:

- `src/components/features/`

## 2.2 Presentational components

Presentational components should:

- receive data via props
- avoid service calls and storage access
- avoid direct side-effect orchestration
- focus on rendering, interaction callbacks, and accessibility

Typical locations:

- `src/components/ui/`
- reusable subcomponents in `src/components/features/` that remain stateless

## 3. UI Component Usage Rules

1. Never call `localStorage` directly inside presentational components.
2. Keep business rules out of JSX.
3. Expose explicit callback props (`onSave`, `onDelete`, `onCancel`) instead of hidden behavior.
4. Reuse shared formatters and utility functions for currency/date/value rendering.
5. Keep text content i18n-ready via translation keys.

## 4. State and Props Rules

- Pass stable primitive props when possible.
- Use memoized callbacks for deeply nested lists when needed.
- Avoid prop drilling when context providers are already available and scoped correctly.
- Keep prop interfaces colocated and strongly typed.

## 5. File Organization Rules

- `src/components/layout/`: app shell and structural components
- `src/components/features/`: domain feature containers and feature-specific views
- `src/components/ui/`: generic reusable UI pieces
- `src/hooks/`: stateful orchestration and domain behavior
- `src/services/`: data access and persistence integrations

## 6. Accessibility and UX Baseline

- Use semantic HTML first.
- Keep actionable controls keyboard accessible.
- Provide explicit labels and meaningful button text.
- Ensure loading and error states are visible and non-ambiguous.

## 7. Review Checklist

Before merging frontend UI changes, validate:

- Clear container/presentational separation
- i18n compatibility
- No direct persistence calls in presentational components
- Type-safe props and callback contracts
- Consistent visual and interaction behavior

## Related Documents

- [docs/frontend/STATE.md](STATE.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [docs/architecture/SYSTEM_DESIGN.md](../architecture/SYSTEM_DESIGN.md)

---

Next: [server/README.md](../../server/README.md)
