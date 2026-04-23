## Phase 2 Tasks

Scope:
1. Harden reset logic to explicit localStorage key whitelist (R4).
2. Add minimum CI pipeline (R7).

Workflow:
1. A. Create plan/tasks artifact.
2. B. Implement code changes.
3. C. Create tests, run tests, ensure all pass.
4. D. Update architecture/docs.
5. E. Create walkthrough.md with full execution summary.

Implementation Tasks:
1. Refactor src/services/budgetService.ts resetBudgetToDefault to remove broad key deletion and use explicit whitelist only.
2. Keep behavior deterministic and safe (no unintended key removal side effects).
3. Add/ensure type-check script in package.json for CI validation.
4. Add .github/workflows/ci.yml running install, type-check, tests, and build on push/PR.

Testing Tasks:
1. Add tests/services/budgetService.test.ts covering:
- only whitelisted keys are removed
- unrelated keys remain untouched
- reset returns deep copy of default budget
2. Run npm run test.
3. Run npm run build.

Documentation Tasks:
1. Update docs/architecture/K-recommendations-roadmap.md quick wins 3 and 4 to completed with evidence.
2. Update docs/architecture/J-risks-tech-debt-register.md mitigations for R4 and R7.
3. Optionally update README if scripts changed.

Definition of Ready:
1. All tests green.
2. Build green.
3. Docs and walkthrough updated.
