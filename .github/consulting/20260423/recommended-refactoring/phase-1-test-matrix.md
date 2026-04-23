## Phase 1 Test Matrix

### Coverage Goals
- Validate bootstrap correctness without recursive save/load loops.
- Guarantee no item loss during category deletion.
- Confirm integration path (hook + service + sync callback) remains consistent.

### Unit Tests - profileService

| Case ID | Scenario | Expected Outcome | File |
|---|---|---|---|
| PS-01 | getAllProfiles with empty storage | Default profile persisted once; returns one profile | tests/services/profileService.test.ts |
| PS-02 | saveProfile called during initialization path | No recursive re-entry into initialization logic | tests/services/profileService.test.ts |
| PS-03 | getCurrentProfile with invalid/missing current id | First available profile returned and current id set | tests/services/profileService.test.ts |
| PS-04 | Corrupted profile storage payload | Fallback profile returned safely; no crash | tests/services/profileService.test.ts |

### Unit Tests - categoryService

| Case ID | Scenario | Expected Outcome | File |
|---|---|---|---|
| CS-01 | Delete category without items | Category removed; no other categories changed | tests/services/categoryService.test.ts |
| CS-02 | Delete category with items and existing Other | Items transferred to Other; source removed | tests/services/categoryService.test.ts |
| CS-03 | Delete category with items and missing Other | Other category created and receives transferred items | tests/services/categoryService.test.ts |
| CS-04 | Delete category preserves type semantics | Income items transfer to income Other, expense items to expense Other | tests/services/categoryService.test.ts |
| CS-05 | Delete non-existing category id | No destructive write; stable return behavior | tests/services/categoryService.test.ts |

### Integration Tests - useCategories

| Case ID | Scenario | Expected Outcome | File |
|---|---|---|---|
| UC-01 | deleteCategory through hook | State updates reflect transferred items and deleted category | tests/hooks/useCategories.test.ts |
| UC-02 | deleteCategory triggers sync callback | onBudgetChange and sync path are invoked | tests/hooks/useCategories.test.ts |
| UC-03 | Service throws during delete | Hook error state populated; no partial state corruption | tests/hooks/useCategories.test.ts |

### Verification Commands
1. npm run test
2. npm run test -- profileService
3. npm run test -- categoryService
4. npm run test -- useCategories
5. npm run build

### Exit Criteria
- All critical test cases PS-01..PS-03 and CS-02..CS-04 pass.
- No regression in existing test suite.
- Build succeeds after changes.