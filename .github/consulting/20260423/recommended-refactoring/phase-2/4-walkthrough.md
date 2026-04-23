## Phase 2 Walkthrough

Date: 2026-04-23  
Branch: add-rent-key  
Goal: complete Quick Win 3 (reset whitelist hardening) and Quick Win 4 (minimum CI pipeline), then close the follow-up regressions discovered during build/runtime review.

## A. Task Artifact

Created:
- .github/consulting/20260423/recommended-refactoring/phase-2/2-task.md

Task plan covered:
1. Harden reset logic with explicit key whitelist.
2. Add CI workflow for type-check, tests, and build.
3. Add regression tests for reset logic.
4. Run full type-check, test, and build verification.
5. Update architecture docs and risk register.
6. Follow up on build warnings and runtime regressions discovered after the first pass.

## B. Code Changes

### 1) Reset logic hardening

Changed file:
- src/services/budgetService.ts

Implemented:
1. Added `RESETTABLE_STORAGE_KEYS` with explicit keys only:
- `familyBudget`
- `budget`
- `family-budget-language`
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
2. Added required React type dependencies:
- `@types/react`
- `@types/react-dom`

Outcome:
- Local and CI TypeScript validation run against the real codebase instead of failing on missing ambient types.

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

Outcome:
- The repository now has a minimum automated validation gate for this phase scope.

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
2. Fixed `BudgetChart` typing issues from the earlier implementation.
3. Hardened `geminiService` response/error handling for strict nullability and `unknown` error typing.
4. Removed dead helper code and duplicate unused variables blocking `npm run type-check`.

Outcome:
- `npm run type-check` passes cleanly.

### 5) Build warning cleanup

Changed files:
- index.html
- src/App.tsx
- vite.config.ts

Implemented:
1. Removed stale `index.html` references that caused the `/index.css` build warning:
- obsolete stylesheet link
- obsolete React/Recharts CDN scripts
- obsolete import map
2. Lazy-loaded `BudgetChart` and `AIFeature` from `App.tsx` using `React.lazy` and `Suspense`.
3. Split `@google/genai` into a dedicated vendor chunk through Vite `manualChunks`.

Outcome:
- The old build warnings were eliminated.
- The main bundle became smaller and heavy side-panel features no longer load on first paint.

### 6) Budget chart dependency removal

Changed files:
- src/components/features/BudgetChart.tsx
- package.json
- package-lock.json
- vite.config.ts

Implemented:
1. Replaced the Recharts-based chart with a lightweight native React/SVG implementation.
2. Removed the `recharts` dependency from the project.
3. Removed the temporary `vendor-recharts` split from Vite configuration once that dependency no longer existed.

Outcome:
- The chart feature stays lazy-loaded and no longer ships a full charting library for one panel.
- Build complexity and asset count dropped materially.

### 7) Runtime regression fix

Changed file:
- index.html

Problem found:
1. Removing the Tailwind CDN script initially broke the application UI because this project does not have:
- `tailwind.config.*`
- `postcss.config.*`
- local `tailwindcss` dependency
2. The app still relies on runtime Tailwind utility generation from the CDN script.

Implemented:
1. Restored only the required Tailwind CDN script and the custom `tailwind.config` color extension.
2. Kept the removed dead scripts and broken `/index.css` reference out of the file.

Outcome:
- The app returned to its previous visual/runtime behavior without reintroducing the old build warning sources.

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
- Passed after warning cleanup and chart refactor.

### 5) Runtime verification

Command pattern used:
- `npm run dev -- --host 127.0.0.1`

Checks performed:
1. Confirmed the served HTML no longer contains the broken `/index.css` reference.
2. Confirmed the served HTML still contains the Tailwind CDN script required by the current styling approach.
3. Confirmed the application styling regression introduced during warning cleanup was fixed.

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

Phase 2 is complete for the defined scope, including the follow-up fixes discovered during review.

Delivered:
1. Safe reset strategy with explicit localStorage whitelist.
2. Regression tests validating no unintended key removal.
3. Minimum CI pipeline enforcing type-check, test, and build.
4. Dependency and strict-TypeScript cleanup required to make the CI step pass.
5. Build warning cleanup.
6. Removal of `recharts` in favor of a native chart implementation.
7. Runtime recovery after restoring the Tailwind CDN required by the current architecture.
8. Architecture and risk docs updated to reflect completed mitigations.

Validation state:
1. Type-check: PASS
2. Tests: PASS
3. Build: PASS
4. Local runtime verification: PASS

## Final Asset Snapshot

Post-refactor notable build artifacts:
1. `index-CMlB7ek4.js` about 270.09 kB
2. `vendor-genai-l6pkFSTK.js` about 225.69 kB
3. `BudgetChart-CCjr3SqX.js` about 5.79 kB
4. `AIFeature-Dh81N_E8.js` about 6.41 kB

Key impact:
1. Old `vendor-recharts` chunk removed completely.
2. `BudgetChart` reduced from a large chart-library-backed chunk to a very small native feature chunk.
3. The remaining heavyweight dependency is now the Gemini SDK, not charts.

## Files Changed in Phase 2

1. src/services/budgetService.ts
2. tests/services/budgetService.test.ts
3. package.json
4. package-lock.json
5. .github/workflows/ci.yml
6. docs/architecture/K-recommendations-roadmap.md
7. docs/architecture/J-risks-tech-debt-register.md
8. index.html
9. vite.config.ts
10. src/App.tsx
11. src/components/features/BudgetChart.tsx
12. src/components/features/BudgetTable.tsx
13. src/components/features/LocalizationDemo.tsx
14. src/components/features/ProfileManager.tsx
15. src/components/ui/EditableCell.tsx
16. src/components/ui/LanguageSelector.tsx
17. src/components/ui/Notification.tsx
18. src/hooks/useBudget.ts
19. src/hooks/useDefaultProfileLanguageSync.ts
20. src/hooks/useProfileCategoriesLanguageSync.ts
21. src/hooks/useProfileManager.ts
22. src/hooks/useSavedSuggestions.ts
23. src/services/categoryService.ts
24. src/services/geminiService.ts
25. src/services/profileService.ts
26. .github/consulting/20260423/recommended-refactoring/phase-2/2-task.md
27. .github/consulting/20260423/recommended-refactoring/phase-2/4-walkthrough.md
