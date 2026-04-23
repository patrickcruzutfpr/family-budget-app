## Phase 2 Walkthrough

Date: 2026-04-23
Branch: add-rent-key
Goal: complete Quick Win 3 (reset whitelist hardening) and Quick Win 4 (minimum CI pipeline) using workflow A-E.

## A. Task Artifact

Created:
- .github/consulting/20260423/recommended-refactoring/phase-2/task.md

Task plan covered:
1. Harden reset logic with explicit key whitelist.
2. Add CI workflow for type-check, tests, and build.
3. Add regression tests for reset logic.
4. Run full type-check, test, and build verification.
5. Update architecture docs and risk register.

## B. Code Changes

### 1) Reset logic hardening

Changed file:
- src/services/budgetService.ts

Implemented:
1. Added `RESETTABLE_STORAGE_KEYS` constant with explicit keys only:
- familyBudget
- budget
- family-budget-language
2. Refactored `resetBudgetToDefault` to remove only whitelisted keys.
3. Removed broad key scans and destructive profile-related removals.
4. Removed forced page reload side effect from reset flow.

Outcome:
- Reset behavior is deterministic and cannot wipe unrelated localStorage data.

### 2) CI support script and type dependencies

Changed files:
- package.json
- package-lock.json

Implemented:
1. Added script:
- `type-check: tsc --noEmit`
2. Added required React type dependencies so TypeScript validation can run in local and CI environments:
- `@types/react`
- `@types/react-dom`

### 3) Minimum CI pipeline

Created file:
- .github/workflows/ci.yml

Implemented workflow:
1. Triggers on `push` (`main`, `add-rent-key`) and `pull_request` (`main`).
2. Uses Node 20 with npm cache.
3. Runs:
- `npm ci`
- `npm run type-check`
- `npm run test`
- `npm run build`

### 4) Strict TypeScript cleanup needed by the new CI step

Changed files:
- src/App.tsx
- src/components/features/BudgetChart.tsx
- src/components/features/BudgetTable.tsx
- src/components/features/LocalizationDemo.tsx
- src/components/features/ProfileManager.tsx
- src/components/ui/EditableCell.tsx
- src/components/ui/LanguageSelector.tsx
- src/components/ui/Notification.tsx
- src/hooks/useBudget.ts
- src/hooks/useDefaultProfileLanguageSync.ts
- src/hooks/useProfileCategoriesLanguageSync.ts
- src/hooks/useProfileManager.ts
- src/hooks/useSavedSuggestions.ts
- src/services/categoryService.ts
- src/services/geminiService.ts
- src/services/profileService.ts

Implemented:
1. Removed unused locals/imports surfaced by `noUnusedLocals` and `noUnusedParameters`.
2. Fixed `BudgetChart` label formatter typing to satisfy Recharts/TypeScript.
3. Hardened `geminiService` response/error handling for strict nullability and `unknown` error typing.
4. Removed dead helper code and duplicate unused variables blocking `npm run type-check`.

## C. Tests and Verification

### 1) New tests

Created file:
- tests/services/budgetService.test.ts

Cases added:
1. Removes only explicit whitelist keys.
2. Does not remove profile keys.
3. Returns deep copy of default budget each call.

### 2) Type-check run

Command:
- npm run type-check

Result:
- Passed

### 3) Test run

Command:
- npm run test

Result:
- 5 test files passed
- 20 tests passed
- 0 failed

Note:
- The profile corruption recovery test and one fallback hook test intentionally log handled error paths to stderr while still passing.

### 4) Build run

Command:
- npm run build

Result:
- Build passed successfully.
- Vite reported a large chunk warning and a runtime note about `/index.css` remaining unresolved at build time.

## D. Documentation Updates

### 1) Roadmap update

Changed file:
- docs/architecture/K-recommendations-roadmap.md

Updates:
1. Quick Win 3 marked Completed (2026-04-23).
2. Quick Win 4 marked Completed (2026-04-23).
3. Added evidence:
- tests/services/budgetService.test.ts
- .github/workflows/ci.yml

### 2) Risk register update

Changed file:
- docs/architecture/J-risks-tech-debt-register.md

Updates:
1. R4 mitigation marked implemented with test evidence.
2. R7 mitigation marked implemented with CI evidence.

## E. Summary

Phase 2 is complete for the defined scope.

Delivered:
1. Safe reset strategy with explicit localStorage whitelist.
2. Regression tests validating no unintended key removal.
3. Minimum CI pipeline enforcing type-check, test, and build.
4. Dependency and strict-TypeScript cleanup required to make the new CI step pass.
5. Architecture and risk docs updated to reflect completed mitigations.

Validation state:
1. Type-check: PASS
2. Tests: PASS
3. Build: PASS

## Files Changed in Phase 2

1. src/services/budgetService.ts
2. tests/services/budgetService.test.ts
3. package.json
4. package-lock.json
5. .github/workflows/ci.yml
6. docs/architecture/K-recommendations-roadmap.md
7. docs/architecture/J-risks-tech-debt-register.md
8. src/App.tsx
9. src/components/features/BudgetChart.tsx
10. src/components/features/BudgetTable.tsx
11. src/components/features/LocalizationDemo.tsx
12. src/components/features/ProfileManager.tsx
13. src/components/ui/EditableCell.tsx
14. src/components/ui/LanguageSelector.tsx
15. src/components/ui/Notification.tsx
16. src/hooks/useBudget.ts
17. src/hooks/useDefaultProfileLanguageSync.ts
18. src/hooks/useProfileCategoriesLanguageSync.ts
19. src/hooks/useProfileManager.ts
20. src/hooks/useSavedSuggestions.ts
21. src/services/categoryService.ts
22. src/services/geminiService.ts
23. src/services/profileService.ts
24. .github/consulting/20260423/recommended-refactoring/phase-2/task.md
25. .github/consulting/20260423/recommended-refactoring/phase-2/walkthrough.md
