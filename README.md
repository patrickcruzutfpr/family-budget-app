# 💰 Family Budget App

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://opensource.org/licenses/AGPL-3.0)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node](https://img.shields.io/badge/Node->=18-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/patrickcruzutfpr/family-budget-app/graphs/commit-activity)
[![Code Style: Prettier](https://img.shields.io/badge/Code_Style-Prettier-ff69b4.svg?logo=prettier&logoColor=white)](https://prettier.io)
[![i18n: English & Portuguese](https://img.shields.io/badge/i18n-EN%20%2F%20PT-success.svg)](https://github.com/patrickcruzutfpr/family-budget-app/tree/main/src/i18n/locales)

A modern React + TypeScript application for managing family budgets with profile-aware AI suggestions, multi-language support, and visual insights.

---

## 📑 Index

- [Overview](#overview)
- [Key features](#key-features)
- [Architecture](#architecture)
   - [Project structure](#project-structure)
   - [Key architectural concepts](#key-architectural-concepts)
- [Technical details](#technical-details)
   - [Tech stack](#tech-stack)
   - [Available scripts](#available-scripts)
- [Development](#development)
   - [Getting started (local)](#getting-started-local)
   - [Environment variables](#environment-variables)
   - [Troubleshooting (quick)](#troubleshooting-quick)
- [Features (detailed)](#features-detailed)
   - [Budget management](#budget-management)
   - [Category management](#category-management)
   - [Profile management](#profile-management)
   - [Visualizations](#visualizations)
   - [AI-powered suggestions](#ai-powered-suggestions)
- [AI integration](#ai-integration)
- [Documentation](#documentation)
- [License & Credits](#license--credits)
- [Support](#support)

---

## 🌟 Overview

This project provides a small, local-first budgeting web app with profile and category management, budget tracking, simple visualizations, and optional AI-powered suggestions via Google Gemini. It is implemented in React + TypeScript with Vite.

## 🔑 Key features

- Budget tracking (projected vs actual)
- Category CRUD with icons and colors
- Multiple profiles with import/export
- Interactive charts (Recharts)
- Multi-language support (EN/PT)
- AI-powered suggestions (Gemini) with a mock fallback
- Type-safe codebase (TypeScript)

## 🏛️ Architecture

The application follows a modern component-driven architecture with clear separation of concerns:

- **Frontend**: Single-page React app with TypeScript support
- **State**: Local state management using React hooks
- **Storage**: Browser's LocalStorage with profile system
- **AI**: Google Gemini integration with fallback options
- **i18n**: Context-based translation system

### Project structure

```
src/
├── components/       # React components (features, layout, ui)
├── hooks/            # Custom hooks (useBudget, useCategories, ...)
├── i18n/             # Internationalization provider and locales
├── services/         # Business logic and external integrations
├── types/            # Shared TypeScript types
├── utils/            # Helpers and migration utilities
├── assets/           # Static assets and icons
└── main.tsx          # App entry point
```

### Key architectural concepts

- **Frontend**: React 19.1.1 with TypeScript for type-safe development
- **Build Tool**: Vite 6.3.5 for fast development and builds
- **Charts**: Recharts 3.1.2 for data visualization with category icons
- **AI Integration**: Google Gemini AI (@google/genai) with profile-specific suggestions
- **Internationalization**: Custom i18n system with React Context for multi-language support
- **Profile Management**: Custom profile system with import/export functionality
- **State Management**: Custom hooks pattern with event-driven updates and profile synchronization
- **Data Persistence**: LocalStorage with profile system, migration utilities, and backup capabilities
- **UI Components**: Modal system, form validation, language selector, and responsive design
- **Icon System**: Custom SVG components and emoji-based category icons
- **Visual Design**: Color-coded status indicators and coordinated category color schemes
- **Styling**: Modern CSS with responsive design and intelligent visual feedback
- **Package Manager**: npm with Node.js 18+
- **Translation System**: Dynamic category name translation with fallback support


## 🛠️ Technical details

### Tech stack

- React 19.x
- TypeScript 5.x
- Vite as the build tooling
- Recharts for charts
- Google Gemini for AI suggestions (optional)
- Vitest + Testing Library for tests

### Available scripts

```bash
# Development
npm run dev

# Build / preview
npm run build
npm run preview

# Quality
npm run lint
npm run type-check
```

## ⌨️ Development

### Prerequisites
- Node.js 18+ or higher
- npm 8+ or yarn 1.22+
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git for version control
- Google Gemini API key for AI features

#### Getting Your Gemini API Key 

> ⚠️ **Attention:** You can do this later, but without a Gemini API key, AI-powered features will be disabled.

1. Visit [Google Gemini](https://ai.google.dev/gemini-api/docs)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `.env.local` file

### Getting started (local)

1. Clone the repository

```powershell
git clone https://github.com/patrickcruzutfpr/family-budget-app.git
cd family-budget-app
npm install
```

2. Copy environment variables (optional)

```powershell
copy .env.local.example .env.local
```

3. Start dev server

```powershell
npm run dev
```

Open http://localhost:5173

### Environment variables

- VITE_APP_TITLE, VITE_APP_VERSION: optional metadata
- GEMINI_API_KEY: (optional) API key for Google Gemini AI
> ⚠️ **Attention:** You can do this later, but without a Gemini API key, AI-powered features will be disabled.


### Troubleshooting 

- If npm installs fail: try clearing cache or deleting node_modules and reinstalling
- If AI calls fail: ensure `GEMINI_API_KEY` is set and network access is available

**SSL Certificate Issues (Corporate Networks):**
```bash
npm config set strict-ssl false
npm config set registry http://registry.npmjs.org/
npm install
```

**Permission Issues (Windows):**
```bash
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🔩 Features (detailed)

### Budget management

- Track monthly income and expenses
- Compare projected vs actual values
- Color-coded status per category and overall

### Category management

- Create, edit, delete categories
- Default icons and colors are provided
- Categories translate with the chosen language for default sets

### Profile management

- Create multiple profiles
- Export / import profile data
- Profile-specific settings and AI history

### Visualizations

- Interactive pie charts and simple trend visuals using Recharts

### AI-powered suggestions

- Requests are routed to `services/geminiService` (or a mock implementation in tests)
- Suggestions are profile-aware and multilingual

## AI integration

The AI layer is abstracted behind a service interface. Implementations include:

- `geminiService.ts` — production adapter to Google Gemini APIs
- `geminiServiceMock.ts` — local fallback for offline development/tests

This keeps the UI decoupled from the provider and makes testing deterministic.

---

## 📝 Usage Guide

### Getting Started with Your Budget

1. **� Choose Your Language**
   - Select your preferred language (Portuguese/English) from the header
   - All categories and UI elements will automatically translate
   - Language preference is saved per profile

2. **👥 Set Up Your Profile**
   - Create multiple profiles for different budgets (personal, business, family)
   - Each profile has independent categories and AI suggestions
   - Switch between profiles instantly from the header

3. **�🏠 Set Your Income**
   - Enter your total monthly income with visual feedback
   - Include all income sources (salary, freelance, investments)
   - Update regularly for accuracy with color-coded status indicators

4. **📋 Create and Manage Expense Categories**
   - Default categories come with emoji icons and colors
   - Create custom categories with icon and color selection
   - Edit existing categories with real-time budget updates
   - Delete unused categories with confirmation dialogs
   - Categories automatically translate when switching languages

5. **💰 Track Your Expenses**
   - Enter actual spending amounts with intelligent color coding
   - Compare projected vs actual spending with visual indicators
   - Monitor your budget in real-time with status colors
   - Green indicates positive balance, red shows overspending

6. **🤖 Get AI-Powered Insights**
   - Click "Get Smart Suggestions" for profile-specific personalized advice
   - Save favorite suggestions for future reference
   - Receive budget optimization recommendations in your language
   - Get spending pattern analysis tailored to your profile

7. **📊 Analyze with Charts**
   - View interactive pie charts with category icons
   - Identify spending trends and patterns with visual enhancements
   - Make data-driven financial decisions with color-coded feedback

8. **📤📥 Backup and Share**
   - Export profiles to backup your data
   - Import profiles on other devices or share with family
   - All data including categories, budgets, and AI suggestions are preserved

### Key Features Walkthrough

- **Dashboard**: Overview of your financial health with color-coded status indicators
- **Profile Manager**: Multi-profile support with individual budgets and settings
- **Budget Calculator**: Real-time budget calculations with visual status feedback
- **Category Manager**: Complete CRUD system for expense categories with default icons
- **Expense Tracker**: Detailed expense management with intelligent color coding
- **AI Assistant**: Profile-specific smart financial recommendations
- **Visual Analytics**: Charts and graphs for insights with category icons
- **Language Selector**: Switch between Portuguese and English with automatic category translation

## 🧭 Features in Detail

### Budget Management
- Real-time budget tracking with visual feedback
- Color-coded status indicators for financial health
- Track income and expenses with projected vs actual amounts
- Automatic balance calculations and updates

### Category Management
- Complete CRUD system for expense categories
- Default icons and color schemes
- Custom category creation with icon selection
- Category-based budget organization

### Profile System
- Multiple budget profiles support
- Profile-specific budgets and categories
- Import/export functionality
- Real-time profile switching

### AI-Powered Suggestions
- Financial advice powered by Gemini AI
- Profile-specific recommendations
- Save favorite suggestions
- Multi-language AI responses

### Multi-Language Support
- Full support for Portuguese and English
- Dynamic translation of UI elements
- Automatic category name translation
- Language-specific currency formatting

### Visual Charts
- Interactive pie charts with Recharts
- Category-based expense visualization
- Visual budget breakdowns
- Icon-enhanced data presentation

### Responsive Design and Theming
- Mobile-first responsive layout
- Light and dark mode support
- Clean, modern interface
- Optimized for all devices

### Data and Type Safety
- Full TypeScript implementation
- Type-safe component props
- Strict type checking
- Robust error handling

## 👥 Profile Management System

### Overview
The Profile Management System allows users to create and manage multiple budget profiles, each with independent budgets, categories, and AI suggestions.

### Key Features

**✨ Multi-Profile Support**
- Create unlimited budget profiles for different purposes (personal, business, family)
- Switch between profiles instantly with automatic data synchronization
- Independent budgets and categories for each profile
- Profile-specific AI suggestions and recommendations

**📤📥 Import/Export Functionality**
- Export complete profile data including budgets, categories, and AI suggestions
- Import profiles from backup files or share between devices
- Automatic data validation and migration during import
- Backup and restore capabilities for data security

**🔄 Real-time Profile Switching**
- Instant profile switching with automatic language sync
- Live updates when switching between profiles
- Seamless integration with all app features
- Profile-specific settings and preferences

### How to Use Profile Management

1. **Access Profile Manager**
   - Click the "Profiles" button in the header
   - View all existing profiles in a card layout

2. **Create New Profiles**
   - Click "Create New Profile" button
   - Choose to start fresh or copy from existing profile
   - Add profile name and description
   - Optionally base on current profile data

3. **Switch Between Profiles**
   - Click on any profile card to switch
   - Data automatically loads for selected profile
   - Categories and AI suggestions update accordingly

4. **Export/Import Profiles**
   - Use "Export Profile" to save profile data
   - Use "Import Profile" to restore from backup
   - Share profiles between devices or users

## 🌍 Multi-Language Support (i18n)

### Overview
Complete internationalization system supporting Portuguese (Brazil) and English, with automatic category translation and language-aware AI suggestions.

### Supported Languages

**🇧🇷 Portuguese (Brazil) - pt-BR**
- Complete UI translation
- Brazilian currency formatting (R$)
- Portuguese financial terminology
- Localized date and number formats

**🇺🇸 English - en**
- Full English translation
- USD currency formatting
- International financial terms
- Standard date and number formats

### Key Features

**🔄 Dynamic Language Switching**
- Switch languages instantly from header selector
- Automatic category name translation
- AI suggestions in selected language
- Persistent language preference per profile

**📝 Smart Category Translation**
- Automatic translation of default category names
- Support for both Portuguese and English category names
- Fallback translation system for custom categories
- Real-time updates when language changes

**🤖 Language-Aware AI**
- AI suggestions in selected language
- Cultural and regional financial advice
- Currency-specific recommendations
- Localized financial terminology

### How to Use Multi-Language Support

1. **Change Language**
   - Click the language selector in the header
   - Choose between "Português" and "English"
   - All UI elements update automatically

2. **Category Translation**
   - Default categories automatically translate
   - Custom categories maintain original names
   - New categories use current language setting

3. **AI Suggestions**
   - AI responses match selected language
   - Financial advice considers regional context
   - Currency recommendations in local format

## 🎨 Visual Design Enhancements

### Default Category Icons and Colors

**💰 Income Categories**
- 💰 Income/Renda - Green (#10B981)
- Consistent visual identity across all views

**🏠 Expense Categories**
- 🏠 Housing/Habitação - Blue (#3B82F6)
- 🚗 Transportation/Transporte - Red (#EF4444)
- 🍽️ Food/Alimentação - Green (#10B981)
- 👨‍👩‍👧‍👦 Personal & Family/Pessoal e Família - Yellow (#F59E0B)
- 🎯 Savings & Investments/Poupança e Investimentos - Purple (#8B5CF6)

### Smart Status Indicators

**💚 Positive Balance/Surplus**
- Green text color for positive financial status
- Visual indicators for healthy budget state
- Encouraging color scheme for good financial health

**❤️ Negative Balance/Deficit**
- Red text color for budget overruns
- Warning indicators for attention-needed areas
- Clear visual feedback for budget management

**⚪ Neutral Status**
- Gray colors for balanced or zero states
- Neutral visual indicators for stable conditions

### Enhanced Visual Feedback

**🎯 Category Icons in All Views**
- Budget table displays category icons
- Category manager shows icons and colors
- Consistent visual identity throughout app
- Improved user experience and recognition

**📊 Color-Coded Financial Data**
- Difference calculations with smart color coding
- Balance indicators with status-appropriate colors
- Visual hierarchy for quick financial assessment

## 🏷️ Category Management System

### Overview
The Category Management System provides a comprehensive CRUD (Create, Read, Update, Delete) interface for managing expense categories with default icons, colors, and full integration to the budget system.

### Key Features

**✨ Complete Category CRUD with Visual Design**
- **Create**: Add new categories with custom names, descriptions, icons, and colors
- **Read**: View all categories in an organized card-based layout with visual indicators
- **Update**: Edit category details with real-time validation and icon selection
- **Delete**: Remove categories with confirmation and dependency checks

**🎨 Default Icons and Colors**
- Automatic icon assignment for default categories
- Emoji-based visual recognition system
- Coordinated color schemes for category types
- Migration system for existing categories without icons

**🔄 Real-time Integration**
- Automatic synchronization with budget calculations
- Live updates when categories are modified
- Seamless integration with existing budget data
- Profile-aware category management

**🌍 Multi-Language Category Support**
- Automatic translation of default category names
- Language-aware category display
- Smart translation fallback system
- Consistent naming across language switches

**💾 Advanced Data Management**
- Profile-based category storage
- Local storage persistence with backup
- Data migration and validation utilities
- Category usage tracking and statistics

### How to Use Category Management

1. **Access Category Manager**
   - Click the "Categories" button in the main interface
   - View all existing categories in a card layout with icons and colors

2. **Create New Categories**
   - Click "Add New Category" button
   - Fill in category name (required)
   - Select from available emoji icons
   - Choose a custom color from predefined palette
   - Add optional description
   - Save to see immediate integration with icons

3. **Edit Existing Categories**
   - Click the edit button on any category card
   - Modify name, description, icon, or color
   - Changes are applied instantly to budget calculations
   - Visual updates reflect across all app views

4. **Delete Categories**
   - Click the delete button on category cards
   - Confirm deletion in the modal dialog
   - System checks for dependencies before removal

5. **View Category Statistics**
   - See category usage information
   - Monitor which categories are most used
   - Track category creation and modification dates

### Technical Implementation

**Architecture Components:**
- `CategoryService`: Core business logic for CRUD operations with icon/color support
- `useCategories`: Custom React hook for state management with profile integration
- `useCategoryTranslations`: Translation hook for category name localization
- `CategoryManager`: Main UI component with visual enhancements and modal system
- `CategoryForm`: Reusable form component with icon/color selection and validation
- `CategoryModal`: Modal wrapper for create/edit operations
- `migrateCategoriesToIncludeIcons`: Migration utility for adding icons to existing categories

**Data Integration:**
- Real-time synchronization with `useBudget` hook
- Event-driven updates between components
- Profile system integration for user data
- Migration utilities for backward compatibility and icon assignments
- Translation system integration for multi-language support

**Visual Enhancement:**
- Default icon assignment system
- Color coordination for category types
- Icon display in budget tables and category cards
- Consistent visual identity across all app views
```

## 🤖 AI Features

### Smart Budget Analysis
The app leverages Google's Gemini AI to provide intelligent, profile-specific budget insights:

- **Profile-Specific Recommendations**: Tailored advice based on individual profile spending patterns
- **Language-Aware Suggestions**: AI responses in Portuguese or English based on user preference
- **Expense Optimization**: Suggestions for reducing unnecessary expenses per profile
- **Financial Goal Planning**: Help setting and achieving profile-specific financial targets
- **Spending Alerts**: Proactive warnings about budget overruns
- **Trend Analysis**: AI-powered insights into profile-specific financial habits
- **Favorite Suggestions**: Save and manage favorite AI recommendations per profile
- **Cross-Profile Insights**: Compare and contrast different profile performances

### Profile Integration
- **Individual AI History**: Each profile maintains its own AI suggestion history
- **Favorite Management**: Save and organize favorite suggestions by profile
- **Export/Import AI Data**: Include AI suggestions in profile export/import
- **Language Consistency**: AI suggestions match profile language settings
- **Context-Aware Advice**: Recommendations consider profile-specific budget data

### Fallback Intelligence
When AI services are unavailable, the app provides:
- Smart mock suggestions based on financial best practices
- Local calculation-based recommendations adapted to profile data
- Offline budget analysis capabilities with profile context
- Language-appropriate fallback suggestions

## � Tech Stack

Our application leverages modern technologies for optimal performance and developer experience:

- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build System**: Vite 6.3.5
- **State Management**: Custom hooks pattern
- **UI Components**: Custom component library
- **Data Visualization**: Recharts 3.1.2
- **AI Integration**: Google Gemini AI
- **Styling**: Modern CSS with CSS Modules
- **Testing**: Vitest with React Testing Library
- **Internationalization**: Custom i18n system
- **Package Manager**: npm
- **Development Tools**: ESLint, Prettier

### Available Scripts

```bash
# Development
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally

# Utilities
npm run lint         # Run ESLint (if configured)
npm run type-check   # Run TypeScript compiler check
npm audit            # Check for security vulnerabilities
```

### Development Workflow

1. **Feature Development**:
   ```bash
   git checkout -b feature/your-feature-name
   npm run dev
   # Make your changes
   npm run build  # Test production build
   ```

2. **Code Quality**:
   - Follow TypeScript strict mode
   - Use meaningful component and variable names
   - Write self-documenting code
   - Test in multiple browsers

### Path Mapping

The project uses clean import paths for better maintainability:

```typescript
// ❌ Instead of relative imports
import { useBudget } from '../../../hooks/useBudget';
import { BudgetService } from '../../services/budget';

// ✅ Use clean absolute imports
import { useBudget } from '@/hooks';
import { BudgetService } from '@/services';
```

## 📦 Build & Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

The build creates:
- Optimized and minified JavaScript/CSS bundles
- Tree-shaken dependencies for smaller file sizes
- Source maps for debugging (configurable)
- Static assets with cache-friendly names

### Build Output
```
dist/
├── assets/           # Optimized JS, CSS, and other assets
├── index.html        # Main HTML file
└── vite.config.ts   # Vite configuration
```

### Deployment Options

**Static Hosting (Recommended):**
- Vercel, Netlify, GitHub Pages
- Simply upload the `dist/` folder

**Docker Deployment:**
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Performance Optimization

- Lazy loading for better initial load times
- Code splitting for optimal bundle sizes
- Image optimization for faster loading
- Service worker for offline capabilities (future enhancement)

## 🐛 Troubleshooting

### Common Issues

**Development Server Won't Start:**
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Errors:**
```bash
# Check TypeScript errors
npx tsc --noEmit
# Clear Vite cache
rm -rf node_modules/.vite
```

**API Key Issues:**
- Ensure `.env.local` exists and contains valid `GEMINI_API_KEY`
- Check API key permissions in [Google Gemini](https://ai.google.dev/gemini-api/docs)
- Verify network connectivity for API calls

## 🤖 AI Service Abstraction

Our AI integration with Google's Gemini API provides intelligent budget insights:

### Core Components
- `geminiService.ts`: Main service for AI interactions
- `geminiServiceMock.ts`: Fallback implementation for offline/testing
- Profile-aware suggestion system
- Multi-language support integration

### Features
- Profile-specific financial advice
- Language-aware suggestions (PT/EN)
- Budget optimization recommendations
- Favorite suggestions management

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:
- API Documentation
- Component Library
- Development Guidelines
- Testing Procedures
- Deployment Guide

### 🔨 Credits

**Created by:** [Patrick Motin Cruz](https://github.com/patrickcruzutfpr)  
**Post-Graduate:** Data Scientist Student in Federal University of Technology - Paraná/Brazil (UTFPR) .  
**ML Software Developer** at Prefeitura Municipal de Curitiba. Full-time

## 📞 Support

For support and questions:
- Create an issue on [GitHub Issues](https://github.com/patrickcruzutfpr/family-budget-app/issues)
- Check existing documentation in the `/docs` folder
- Review the troubleshooting section above

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

You are free to use, modify, and distribute this software under the terms of the AGPL-3.0 license. If you run a modified version of this software on a server and allow users to interact with it over a network, you must make the source code of your modified version available to those users.

For more details, see the [LICENSE](LICENSE) file or visit [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.html).

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/gemini-api/docs/) for intelligent budget suggestions
- [Recharts](https://recharts.org/) for beautiful data visualization
- [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/) communities
- [Vite](https://vitejs.dev/) for the excellent development experience

---

© 2025 Patrick Motin Cruz. All rights reserved under AGPL-3.0.
