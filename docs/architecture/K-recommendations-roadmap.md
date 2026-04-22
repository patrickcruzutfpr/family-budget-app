# K. Recommendations and Roadmap

## Planning assumptions
- Product remains local-first in short term.
- Team prioritizes stability and secure AI usage over architectural disruption.

## Quick wins (1-2 weeks)

### 1) Fix profile bootstrap recursion risk
- Effort: Small
- Dependencies: profileService refactor + unit tests
- Measurable outcome:
  - zero first-run bootstrap recursion incidents in test scenarios.

#### Evidence
- src/services/profileService.ts

### 2) Align category delete behavior with warning copy
- Effort: Small to Medium
- Dependencies: categoryService + category tests + i18n confirmation checks
- Measurable outcome:
  - 100% of category deletions preserve items by moving to Other.

#### Evidence
- src/services/categoryService.ts
- src/components/features/DeleteConfirmationModal.tsx
- src/i18n/locales/en.json

### 3) Harden reset logic to explicit key whitelist
- Effort: Small
- Dependencies: budgetService tests
- Measurable outcome:
  - no unintended localStorage key removals in regression tests.

#### Evidence
- src/services/budgetService.ts

### 4) Add minimum CI pipeline
- Effort: Small to Medium
- Dependencies: scripts in package.json + workflow yaml
- Measurable outcome:
  - PR checks running build + tests + type validation.

#### Evidence
- package.json
- vitest.config.ts
- .github/

## Near-term (1-2 months)

### 1) Move Gemini integration to backend proxy
- Effort: Medium
- Dependencies: lightweight backend endpoint, secret management
- Measurable outcome:
  - Gemini key removed from frontend runtime.
  - AI success/failure telemetry available.

#### Evidence
- vite.config.ts
- src/services/geminiService.ts

### 2) Consolidate persistence model
- Effort: Medium
- Dependencies: migration plan and fallback deprecation
- Measurable outcome:
  - removal of legacy budget fallback path in useBudget.
  - reduced persistence-related bug volume.

#### Evidence
- src/hooks/useBudget.ts
- src/services/budgetService.ts
- src/services/profileService.ts

### 3) Formalize event and domain boundaries
- Effort: Medium
- Dependencies: architecture decision and refactor of event propagation
- Measurable outcome:
  - reduced hidden coupling and clearer ownership of state transitions.

#### Evidence
- src/App.tsx
- src/hooks/useSavedSuggestions.ts
- src/utils/categoryMigration.ts

## Longer-term (3-6 months)

### 1) Introduce authoritative backend for profiles and sync (if justified)
- Effort: Medium to High
- Dependencies: auth model, data model, API contracts, migration strategy
- Measurable outcome:
  - cross-device profile sync and centralized governance.

#### Evidence
- Current local-only ownership in src/services/profileService.ts

### 2) Operationalize observability and SLOs
- Effort: Medium
- Dependencies: telemetry stack selection and dashboarding
- Measurable outcome:
  - defined SLOs for key user flows and alert thresholds.

#### Evidence
- absence of telemetry integrations in repository

### 3) Security/compliance hardening
- Effort: Medium
- Dependencies: privacy requirements and data governance alignment
- Measurable outcome:
  - documented controls for data retention, privacy, and secret handling.

#### Evidence
- local persistence and key exposure patterns across services

## Trade-offs
- Stabilize first vs redesign now:
  - Stabilize-first reduces disruption and immediate risk.
  - Full redesign can improve long-term scale but increases short-term complexity.
- Backend proxy for AI:
  - Adds operational overhead but resolves key security issue.
- Keeping local-first model:
  - Low cost and simple UX now; limits collaboration and governance later.

## Evidence
- Evidence sections included per recommendation above.
