# F. Critical Flows

## Flow 1: Application startup and budget bootstrap
```mermaid
sequenceDiagram
  participant U as User Browser
  participant M as main.tsx
  participant I as I18nProvider
  participant A as App
  participant B as useBudget
  participant P as profileService
  participant G as categoryMigration

  U->>M: Load app
  M->>I: Mount providers
  I->>I: Detect language and load locale
  M->>A: Render App
  A->>G: run migrateCategoryData/ensureDefaultCategories/migrateIcons
  A->>B: initialize budget hook
  B->>P: getCurrentProfile()
  P-->>B: profile with budget
  B-->>A: budget state
```

### Evidence
- main.tsx provider bootstrap: src/main.tsx
- startup migration calls and App orchestration: src/App.tsx
- budget initialization and profile-first load: src/hooks/useBudget.ts
- migration functions: src/utils/categoryMigration.ts

## Flow 2: Update budget item value
```mermaid
sequenceDiagram
  participant U as User
  participant UI as Budget UI
  participant B as useBudget
  participant P as profileService

  U->>UI: Edit projected/actual value
  UI->>B: updateItemValue(...)
  B->>B: setBudget(new state)
  B->>P: updateCurrentProfileBudget(budget) via effect
  P-->>B: Persisted in localStorage
  B-->>UI: Derived totals/charts update
```

### Evidence
- state mutation and persistence effect: src/hooks/useBudget.ts
- total calculations in App: src/App.tsx

## Flow 3: Generate AI suggestions
```mermaid
sequenceDiagram
  participant U as User
  participant AIUI as AIFeature
  participant GS as geminiService
  participant G as Gemini API
  participant S as useSavedSuggestions

  U->>AIUI: Click Get Suggestions
  AIUI->>GS: getBudgetSuggestions(budget, language)
  GS->>G: generateContent(JSON schema)
  alt success
    G-->>GS: suggestions JSON
    GS-->>AIUI: suggestions[]
  else API suspended
    GS->>GS: fallback to mock
    GS-->>AIUI: mock suggestions[]
  end
  U->>AIUI: Save suggestion
  AIUI->>S: saveSuggestion(...)
  S->>S: persist by profile+language
```

### Evidence
- AI UI trigger and save operations: src/components/features/AIFeature.tsx
- Gemini contract and fallback: src/services/geminiService.ts
- saved suggestion persistence: src/hooks/useSavedSuggestions.ts

## Flow 4: Profile import and switch
```mermaid
sequenceDiagram
  participant U as User
  participant PM as ProfileManager UI
  participant H as useProfileManager
  participant P as profileService
  participant B as useBudget
  participant S as useSavedSuggestions

  U->>PM: Import profile JSON
  PM->>H: importProfileData(json)
  H->>P: importProfile(...)
  P-->>H: imported profile
  PM->>H: switchProfile(imported.id)
  PM->>window: dispatch profileChanged event
  B->>P: reload current profile budget
  S->>S: reload profile-specific suggestions
```

### Evidence
- profile management operations: src/components/features/ProfileManager.tsx
- profile import/export and current profile switch: src/services/profileService.ts
- budget/profileChanged reaction: src/hooks/useBudget.ts
- suggestion reload hooks: src/hooks/useSavedSuggestions.ts

## Flow 5: Category deletion
```mermaid
sequenceDiagram
  participant U as User
  participant CM as CategoryManager
  participant DM as DeleteConfirmationModal
  participant CS as CategoryService
  participant P as profileService

  U->>CM: Request delete category
  CM->>DM: Open confirmation modal
  DM-->>U: Warning says items move to Other
  U->>CM: Confirm delete
  CM->>CS: deleteCategory(categoryId)
  CS->>CS: Resolve or create type-safe Other category
  CS->>CS: Move items from source category to Other
  CS->>P: Persist updated budget
  CS-->>CM: Save updated budget
```

### Observation
- Flow is now aligned with the warning copy: items are preserved and moved to Other before deletion.

### Evidence
- warning message in modal and i18n text: src/components/features/DeleteConfirmationModal.tsx, src/i18n/locales/en.json
- actual delete behavior: src/services/categoryService.ts
- hook-level state refresh after delete: src/hooks/useCategories.ts
