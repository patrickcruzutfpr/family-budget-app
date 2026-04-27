# Usage Guide

This is the canonical end-user guide for the Family Budget App. It explains the normal workflow without repeating category implementation details or backend architecture notes.

## Navigation

- Previous: [docs/project-structure.md](project-structure.md)
- Next: [docs/user-guide-category-management.md](user-guide-category-management.md)
- Root: [README.md](../README.md)

## 1. What the App Does

Family Budget App is a local-first budgeting app with:

- income and expense tracking
- multiple profiles
- category customization
- charts for spending analysis
- optional AI suggestions
- English and Portuguese support

## 2. Daily Workflow

Follow this order for a clean setup:

1. Choose your language in the header.
2. Open the profile manager and create or switch to the budget profile you want to edit.
3. Review income categories first, then update expense categories and line items.
4. Compare projected and actual values in the table and summary.
5. Use charts to spot over-budget categories quickly.
6. Request AI suggestions when you want optimization ideas.
7. Export the profile when you want a backup or need to move data to another device.

## 3. Working With Budget Data

- Income and expense values are tracked separately.
- The main table compares projected versus actual amounts for each item.
- Totals and balance indicators update as you edit the budget.
- Charts provide a faster read on category distribution than the table alone.

### Column visibility filter

- Use the filter icon in the Budget Breakdown header to choose which columns are visible.
- The selection is page-level and affects all budget tables at once.
- Your column preferences are saved for the next session on the same browser.

## 4. Managing Profiles

Profiles let you isolate different budgeting contexts such as personal, family, or side-business budgets.

- Create a new profile from scratch or based on the current profile.
- Switch profiles from the profile manager without mixing their data.
- Export a profile to keep a backup of budget data and saved AI suggestions.
- Import a profile to restore a backup or copy data from another device.
- Duplicate a profile when you want a starting point for a new scenario.

## 5. Managing Categories

Categories control how income and expenses are grouped in the table, charts, and summaries.

- Open the category manager from the main interface.
- Create, rename, recolor, or delete categories as needed.
- Use icons and colors to make category scanning faster.
- Read the detailed category guide here: [user-guide-category-management.md](user-guide-category-management.md)

## 6. AI Suggestions

The app can send a sanitized budget summary to the backend AI proxy and return actionable suggestions.

- Suggestions are generated from the current profile only.
- Results are shown in the active UI language when supported.
- Saved suggestions stay attached to the profile.
- If the external AI provider is unavailable, the app can fall back to mock suggestions instead of blocking the workflow.

## 7. Language and Presentation

- The interface supports English and Portuguese.
- Default category names follow the active language.
- Visual status indicators help distinguish healthy balance, deficit, and neutral states.
- Charts, tables, and saved suggestions all reflect the current profile context.

## 8. Backups and Safe Recovery

- Export profiles regularly if the data matters.
- Import uses validation and creates a new profile rather than overwriting the current one.
- Category deletions preserve linked items by moving them into a fallback category instead of dropping data.

## Related Documents

- Category deep dive: [user-guide-category-management.md](user-guide-category-management.md)
- Frontend state and persistence: [frontend/STATE.md](frontend/STATE.md)
- Runtime architecture: [architecture/SYSTEM_DESIGN.md](architecture/SYSTEM_DESIGN.md)

---

Next: [docs/user-guide-category-management.md](user-guide-category-management.md)
