## Plan: Phase 1 Stability Fixes
Stabilize architecture with low-disruption fixes focused on bootstrap correctness and category deletion data integrity (security change deferred by decision). Implement service-level behavior fixes first, then add unit/integration tests, run verification, and finally update architecture documentation with completion evidence.

**Steps**
1. Phase A: Bootstrap correctness fix in profile service.

1.1. Update profile bootstrap flow to remove recursive call paths between getAllProfiles and saveProfile by introducing a non-recursive initialization path that persists default profile and current profile id exactly once. This blocks all later steps.
1.2. Add defensive behavior in getCurrentProfile to reuse initialized profiles and avoid secondary fallback recursion paths. Depends on step 2.
1.3. Add concise English docstrings/comments only where flow is non-obvious (bootstrap guard/initializer rationale). Parallel with step 3.

2. Phase B: Data integrity fix for category deletion.
2.1 Refactor CategoryService.deleteCategory to preserve items by transferring them to an appropriate Other category before deletion. Depends on step 2 only for stable profile persistence.
2.2 Add explicit handling for edge cases: deleting a category with no items, missing Other category (create one), and preventing destructive behavior if transfer target cannot be resolved. Depends on step 6.
2.3. Keep UI behavior and copy aligned with service behavior (DeleteConfirmationModal warning remains valid). Verify no copy changes needed; only update if behavior/copy mismatch remains. Parallel with step 7.

3. Phase C: Test implementation (unit + integration).
3.1 Add unit tests for profileService bootstrap logic: empty storage initialization, no recursion/re-entry, current profile id assignment, and stable return behavior. Depends on steps 2-4.
3.2 Add unit tests for CategoryService.deleteCategory: transfer items to Other, preserve totals, no item loss, correct behavior when Other missing, and category-type-safe transfer. Depends on steps 6-7.
3.3 Add integration tests at hook/service boundary (useCategories and/or useBudget interactions) validating that delete flow keeps data consistent after syncCategoryChanges and callback execution. Depends on steps 10-11.
3.4 Ensure test tooling exists in package scripts/devDependencies (Vitest + Testing Library) and is runnable in CI/local context without changing app runtime behavior. Parallel with steps 10-12.

4. Phase D: Verification and documentation.
4.1 Run type-check and targeted/full test suites; fix any regressions until green. Depends on steps 10-13.
4.2 Update architecture docs to mark Phase 1 completed items and add evidence links to tests/files changed. Depends on step 15.
4.4 Update README testing section only if scripts/commands changed. Parallel with step 16.

**Relevant files**
- c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/src/services/profileService.ts — fix bootstrap initialization path and recursion risks in getAllProfiles, saveProfile interactions, and getCurrentProfile fallback.
- c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/src/services/categoryService.ts — implement item transfer to Other category in deleteCategory with edge-case handling.
- c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/src/hooks/useCategories.ts — integration behavior validation surface for deleteCategory and syncCategoryChanges.
- c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/src/components/features/DeleteConfirmationModal.tsx — verify warning text remains accurate with implemented behavior.
- c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/tests/services/profileService.test.ts — new unit tests for bootstrap correctness.
- c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/tests/services/categoryService.test.ts — new unit tests for data integrity during category deletion.
- c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/tests/hooks/useCategories.test.ts — integration tests for category deletion flow and synchronization behavior.
- c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/tests/setup.ts — shared localStorage/browser mocks for new tests.
- c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/package.json — test scripts and devDependencies if missing.
- c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/docs/architecture/K-recommendations-roadmap.md — mark completed quick wins and evidence.
- c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/docs/architecture/J-risks-tech-debt-register.md — update mitigation status for R1 and R3 with validation evidence.
- c:/Users/patrickcruz/Documents/2026/Pessoal/Github/family-budget-app/README.md — update testing commands section if changed.

**Verification**
1. Run npm install (if test dependencies are missing).
2. Run npm run test (or vitest run) and ensure all existing/new tests pass.
3. Run targeted tests: profileService, categoryService, useCategories integration.
4. Run npm run build and type-check equivalent to confirm no TS/runtime regressions.
5. Manual sanity check in app: delete category with items and confirm items appear in Other category and totals remain consistent.

**Decisions**
- Included scope: bootstrap correctness + category deletion data integrity.
- Excluded scope: Gemini security/backend proxy changes in this phase (explicitly deferred).
- Test scope: unit + integration tests required.
- Documentation language for docstrings/comments: English.

**Further Considerations**
1. Define canonical Other category naming/lookup strategy per language (name-based vs stable internal flag/id) to avoid future i18n regressions.
2. Consider adding a regression guard test for deleting the Other category itself (block or auto-recreate behavior) to prevent silent data loss paths.
3. If package scripts are expanded, align with future CI workflow in a later phase to enforce quality gates automatically.