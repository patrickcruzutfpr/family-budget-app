## Phase 1 Task Backlog

Source plan: phase-1-plan.md
Scope: bootstrap correctness + category deletion data integrity.

### Workstream A - Bootstrap Correctness (profileService)

| ID | Task | Target Files | Priority | Estimate | Depends On |
|---|---|---|---|---|---|
| A1 | Add non-recursive initialization path for first-run profiles | src/services/profileService.ts | Critical | 2-3h | - |
| A2 | Ensure current profile id is set exactly once during initialization | src/services/profileService.ts | Critical | 1h | A1 |
| A3 | Harden getCurrentProfile fallback to avoid secondary recursion path | src/services/profileService.ts | High | 1h | A1 |
| A4 | Add concise English docstrings/comments on bootstrap guard flow | src/services/profileService.ts | Medium | 30m | A1-A3 |

### Workstream B - Data Integrity on Category Deletion

| ID | Task | Target Files | Priority | Estimate | Depends On |
|---|---|---|---|---|---|
| B1 | Implement transfer-before-delete behavior | src/services/categoryService.ts | Critical | 2h | A1 |
| B2 | Create/reuse Other category when transfer target missing | src/services/categoryService.ts | High | 1-2h | B1 |
| B3 | Preserve category type consistency during transfer | src/services/categoryService.ts | High | 1h | B1 |
| B4 | Validate UI warning text remains behavior-accurate | src/components/features/DeleteConfirmationModal.tsx | Medium | 30m | B1-B3 |

### Workstream C - Tests (Unit + Integration)

| ID | Task | Target Files | Priority | Estimate | Depends On |
|---|---|---|---|---|---|
| C1 | Unit tests for profile bootstrap behavior (first run, no recursion, current id set) | tests/services/profileService.test.ts | Critical | 2-3h | A1-A3 |
| C2 | Unit tests for category delete transfer (no data loss, missing Other, type-safe transfer) | tests/services/categoryService.test.ts | Critical | 2-3h | B1-B3 |
| C3 | Integration tests for hook/service boundary on delete flow and sync callbacks | tests/hooks/useCategories.test.ts | High | 2h | B1-B3 |
| C4 | Ensure test tooling/scripts are available and stable | package.json | High | 30m-1h | - |

### Workstream D - Verification and Documentation

| ID | Task | Target Files | Priority | Estimate | Depends On |
|---|---|---|---|---|---|
| D1 | Run tests + build/type checks and fix regressions | package.json scripts | Critical | 1-2h | C1-C4 |
| D2 | Update roadmap and risk register with completion evidence | docs/architecture/K-recommendations-roadmap.md, docs/architecture/J-risks-tech-debt-register.md | High | 1h | D1 |
| D3 | Update README test section only if scripts changed | README.md | Medium | 30m | D1 |

## Delivery Sequence
1. A1 -> A2 -> A3
2. B1 -> B2 -> B3
3. C1 and C2 in parallel
4. C3
5. D1 -> D2 -> D3

## Constraints
- Keep disruption low and local to target services/hooks.
- Do not introduce backend/API changes in this phase.
- Keep docstrings/comments in English.
- Preserve existing behavior outside defined risk fixes.