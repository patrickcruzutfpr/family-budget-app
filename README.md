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
   - [Tech Stack](#tech-stack)
   - [Available Scripts](#available-scripts)
- [Development](#development)
   - [Prerequisites](#prerequisites)
   - [Getting Your Gemini API Key](#getting-your-gemini-api-key)
   - [Getting started (local)](#getting-started-local)
   - [Environment variables](#environment-variables)
   - [Troubleshooting (quick)](#troubleshooting-quick)
- [AI Features](#ai-features)
   - [Smart Budget Analysis](#smart-budget-analysis)
   - [Profile Integration](#profile-integration)
   - [Fallback Intelligence](#fallback-intelligence)
- [Build & Deployment](#build--deployment)
   - [Production Build](#production-build)
   - [Build Output](#build-output)
   - [Deployment Options](#deployment-options)
   - [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)
   - [Common Issues](#common-issues)
- [AI Service Abstraction](#ai-service-abstraction)
   - [Core Components](#core-components)
   - [Features](#features)
- [Development Workflow](#development-workflow)
   - [Path Mapping](#path-mapping)
- [Documentation](#-documentation)
- [Credits](#credits)
- [Support](#support-1)
- [License](#license)
- [Acknowledgments](#acknowledgments)

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


## 🧑‍💻 Technical details

### Tech Stack

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

---
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

## 📱 Technical Implementation

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

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:
- [Usage Guide](./docs/usage-guide-section.md)
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
