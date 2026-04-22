# D. Data Architecture

## Data model

### Core entities
- BudgetItem
  - id, name, projected, actual
- Category
  - id, name, type, items, optional metadata (description, icon, color, timestamps)
- BudgetProfile
  - id, name, description, budget, timestamps, isDefault, optional aiSuggestions
- AISuggestion / SavedAISuggestion
  - title/suggestion and persisted metadata (id, savedAt, language, isFavorite)

## Data stores and ownership
- Primary store: browser localStorage.
- Ownership:
  - Profiles and budget are owned by profileService.
  - Language preference is owned by i18n utilities.
  - Saved suggestions are owned by useSavedSuggestions/profile import logic.

## Storage keys and logical collections
- familyBudgetProfiles: list of profiles and nested budget categories/items.
- currentProfileId: active profile pointer.
- family-budget-language: language preference.
- family-budget-saved-suggestions[-profileId]: saved suggestions grouped by language.
- Legacy/compatibility keys:
  - familyBudget
  - budget_categories
  - budget

## Consistency model
- In-process React state is the immediate source during interaction.
- Persistence is asynchronous side-effect via useEffect/service calls.
- Eventual consistency between modules is maintained via custom window events.
- No transactions across profile + suggestion writes.

## Indexes and query strategy
- No DB indexes (localStorage JSON blobs).
- In-memory filtering and map/reduce per render or operation.

## Data lifecycle
- Creation:
  - Default profile auto-creation if storage is empty.
- Update:
  - Category/item/profile updates mutate state then persist.
- Deletion:
  - Profile/category/suggestion delete operations rewrite local collections.
- Migration:
  - Legacy category key migration and icon/color enrichment on startup.
- Retention:
  - No TTL; retained until user/browser clears storage.
- Backup/export:
  - Profile export/import as JSON; suggestions can be embedded and restored.

## Auditability
- Limited auditability:
  - Timestamps on profile/category optional fields.
  - No immutable change log or event store.

## Data risks
- Recursion risk in profile initialization path:
  - getAllProfiles may call saveProfile, and saveProfile calls getAllProfiles.
- Data integrity mismatch on category deletion:
  - UI warns items move to Other, service currently drops category directly.
- Broad reset logic can remove unrelated keys by pattern matching.

## Unknowns
- Unknown: Required retention period or legal retention policy.
  - Evidence needed: data governance/compliance requirements.
- Unknown: Need for cross-device sync and conflict resolution.
  - Evidence needed: product requirements for account-based sync.

## Evidence
- Type definitions: src/types/index.ts
- Profile data ownership and import/export: src/services/profileService.ts
- Budget state persistence orchestration: src/hooks/useBudget.ts
- Suggestion persistence schema and limits: src/hooks/useSavedSuggestions.ts
- Migration logic and legacy keys: src/utils/categoryMigration.ts
- Category delete behavior: src/services/categoryService.ts
- Category delete warning copy: src/components/features/DeleteConfirmationModal.tsx
