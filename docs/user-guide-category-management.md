# Category Management Guide

This document is the canonical reference for category CRUD behavior. It owns category-specific workflow and safeguards so that the main usage guide can stay focused on the overall app flow.

## Navigation

- Previous: [docs/usage-guide-section.md](usage-guide-section.md)
- Next: [docs/components-diagram.md](components-diagram.md)
- Root: [README.md](../README.md)

## 1. What Categories Control

Categories group budget items into income and expense buckets. They affect:

- the main budget table
- summary totals
- charts
- profile-specific storage
- AI budget summaries

## 2. Category Workflow

### Open the manager

- Use the category action in the main interface.
- The manager loads categories from the active profile.

### Create a category

- Provide a unique name.
- Choose whether the category is income or expense.
- Optionally set a description, icon, and color.
- Save the category to make it immediately available in the current profile.

### Edit a category

- Update the name, description, icon, or color.
- Changes are applied to the current profile budget in place.
- The updated category is reflected in dependent views after synchronization.

### Delete a category

- Confirm the deletion before it is applied.
- Empty categories are removed directly.
- Categories with linked items are not dropped. Their items are moved into a fallback category such as `Other` or `Other Income`.

## 3. Validation and Safety Rules

- Category names must be unique across the current profile.
- Category data is stored through the current profile rather than a separate category database.
- Deletion is designed to preserve linked budget items.
- Category changes trigger synchronization so summaries and related views stay aligned.

## 4. Default and Translated Categories

- The app creates a default income category and a core set of expense categories for new profiles.
- Default names follow the active language.
- Language synchronization can update known default category names across profiles.
- Custom category names stay under user control.

## 5. Technical Ownership

These files own category behavior:

- UI: `src/components/features/CategoryManager.tsx`
- Form and modal flow: `src/components/features/CategoryForm.tsx`, `src/components/features/CategoryModal.tsx`
- Delete confirmation: `src/components/features/DeleteConfirmationModal.tsx`
- Hook orchestration: `src/hooks/useCategories.ts`
- Persistence and safeguards: `src/services/categoryService.ts`
- Profile-backed storage: `src/services/profileService.ts`

## 6. Implementation Notes

- Categories are loaded from the current profile budget.
- Creating and editing categories updates the active profile immediately.
- Deleting a category with items resolves or creates a fallback category before the original one is removed.
- Statistics such as item count, projected total, and actual total are derived from the category items already stored in the profile budget.

## Related Documents

- End-user workflow: [usage-guide-section.md](usage-guide-section.md)
- Frontend state and persistence: [frontend/STATE.md](frontend/STATE.md)
- Runtime architecture: [architecture/SYSTEM_DESIGN.md](architecture/SYSTEM_DESIGN.md)

---

Next: [docs/components-diagram.md](components-diagram.md)
