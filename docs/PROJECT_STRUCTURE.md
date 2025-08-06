# Project Structure Documentation

## Overview
This Familia Motin Orcamento  has been reorganized following modern React/TypeScript best practices for better maintainability, scalability, and developer experience.

## New Structure

```
family-budget-app/
├── public/
├── src/                          # All source code
│   ├── assets/                   # Static assets
│   │   └── icons/               # SVG icon components
│   │       ├── index.ts         # Icon barrel exports
│   │       ├── ArrowDownIcon.tsx
│   │       ├── ArrowUpIcon.tsx
│   │       ├── LightbulbIcon.tsx
│   │       ├── PlusCircleIcon.tsx
│   │       ├── RefreshCwIcon.tsx
│   │       ├── ScaleIcon.tsx
│   │       ├── SparklesIcon.tsx
│   │       └── Trash2Icon.tsx
│   ├── components/              # React components
│   │   ├── features/           # Feature-specific components
│   │   │   ├── AIFeature.tsx
│   │   │   ├── BudgetChart.tsx
│   │   │   ├── BudgetRow.tsx
│   │   │   ├── BudgetTable.tsx
│   │   │   └── Summary.tsx
│   │   ├── layout/             # Layout components
│   │   │   └── Header.tsx
│   │   ├── ui/                 # Reusable UI components
│   │   │   └── EditableCell.tsx
│   │   └── index.ts            # Component barrel exports
│   ├── hooks/                  # Custom React hooks
│   │   ├── index.ts            # Hook barrel exports
│   │   └── useBudget.ts
│   ├── services/               # API and business logic
│   │   ├── index.ts            # Service barrel exports
│   │   ├── budgetService.ts
│   │   ├── geminiService.ts
│   │   └── geminiServiceMock.ts
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                  # Utility functions (for future use)
│   ├── App.tsx                 # Main App component
│   └── main.tsx                # Application entry point
├── tests/                      # Test files (organized separately)
├── docs/                       # Documentation
├── .env.local                  # Environment variables
├── .env.local.example          # Environment template
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite bundler configuration
```

## Key Improvements

### 1. **Better Organization**
- **Feature-based components**: Related components grouped by functionality
- **Separation of concerns**: UI, layout, and feature components are clearly separated
- **Asset organization**: Icons and other static assets in dedicated folders

### 2. **Path Mapping**
- **Clean imports**: Use `@/` aliases for better import paths
- **TypeScript support**: Full IntelliSense and type checking for all imports
- **Maintainable**: Easy to refactor and move files without breaking imports

### 3. **Barrel Exports**
- **Cleaner imports**: Import multiple items from a single barrel file
- **Better tree-shaking**: Bundler can optimize unused code removal
- **Easier refactoring**: Change internal structure without affecting external imports

## Import Examples

### Before (Old Structure)
```tsx
import { useBudget } from './hooks/useBudget';
import { BudgetTable } from './components/BudgetTable';
import { SparklesIcon } from './components/icons/SparklesIcon';
```

### After (New Structure)
```tsx
import { useBudget } from '@/hooks';
import { BudgetTable } from '@/components';
import { SparklesIcon } from '@/assets/icons';
```

## Environment Setup

The project uses path mapping configured in `tsconfig.json`:

```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["src/*"],
    "@/components/*": ["src/components/*"],
    "@/hooks/*": ["src/hooks/*"],
    "@/services/*": ["src/services/*"],
    "@/types/*": ["src/types/*"],
    "@/utils/*": ["src/utils/*"],
    "@/assets/*": ["src/assets/*"]
  }
}
```

## Benefits

1. **Scalability**: Easy to add new features without cluttering the root
2. **Maintainability**: Clear separation makes code easier to understand
3. **Developer Experience**: Better IntelliSense and import suggestions
4. **Team Collaboration**: Consistent structure for all team members
5. **Build Optimization**: Better tree-shaking and chunk splitting

## Migration Notes

- All import paths have been updated to use the new structure
- The development server automatically handles the new paths
- No breaking changes to the application functionality
- Environment variables and configuration remain unchanged
