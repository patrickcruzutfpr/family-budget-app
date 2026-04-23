## Phase 1 Implementation Checklist

Status legend: [ ] pending, [x] done

### A. Bootstrap Correctness
- [x] Add non-recursive profile initialization flow in src/services/profileService.ts.
- [x] Persist default profile and current profile id once on first run.
- [x] Ensure getCurrentProfile fallback does not re-trigger recursion.
- [x] Add concise English docstrings/comments for bootstrap guard path.

### B. Category Deletion Data Integrity
- [x] Update deleteCategory logic in src/services/categoryService.ts to transfer items before deletion.
- [x] Ensure transfer target (Other) is resolved or created safely.
- [x] Keep transfer type-safe (income to income target, expense to expense target).
- [x] Confirm behavior remains aligned with delete warning in src/components/features/DeleteConfirmationModal.tsx.

### C. Unit + Integration Tests
- [x] Add tests/services/profileService.test.ts.
- [x] Add tests/services/categoryService.test.ts.
- [x] Add tests/hooks/useCategories.test.ts.
- [x] Add/adjust package test scripts if needed in package.json.

### D. Validate
- [x] Run full test suite successfully.
- [x] Run targeted tests for profileService/categoryService/useCategories.
- [x] Run build/type verification.

### E. Documentation
- [x] Mark quick wins complete in docs/architecture/K-recommendations-roadmap.md.
- [x] Update risk mitigations for R1 and R3 in docs/architecture/J-risks-tech-debt-register.md.
- [x] Update README testing section only if scripts changed.

### Notes
- Security/backend Gemini move remains out of Phase 1 scope by decision.
- Keep changes low-disruption and confined to target modules.
- Build validation completed after fixing src/i18n/locales/en_temp.json syntax.