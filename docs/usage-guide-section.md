# 🙋🏻 Usage Guide Section

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://opensource.org/licenses/AGPL-3.0)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node](https://img.shields.io/badge/Node->=18-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/patrickcruzutfpr/family-budget-app/graphs/commit-activity)
[![Code Style: Prettier](https://img.shields.io/badge/Code_Style-Prettier-ff69b4.svg?logo=prettier&logoColor=white)](https://prettier.io)
[![i18n: English & Portuguese](https://img.shields.io/badge/i18n-EN%20%2F%20PT-success.svg)](https://github.com/patrickcruzutfpr/family-budget-app/tree/main/src/i18n/locales)

This document is a comprehensive usage guide for the Family Budget App. It explains how to get started, from setting up your language and profile to tracking income and expenses. The guide also details key features like multi-profile management with import/export, category customization with icons and colors, AI-powered financial suggestions, and data visualization through charts

---

## 📑 Index

- [Overview](#overview)
- [Key features](#key-features)
- [Usage Guide](#usage-guide)
   - [Getting Started with Your Budget](#getting-started-with-your-budget)
   - [Key Features Walkthrough](#key-features-walkthrough)
- [Features in Detail](#features-in-detail)
   - [Budget Management](#budget-management)
   - [Category Management](#category-management)
   - [Profile System](#profile-system)
   - [AI-Powered Suggestions](#ai-powered-suggestions)
   - [Multi-Language Support](#multi-language-support)
   - [Visual Charts](#visual-charts)
   - [Responsive Design and Theming](#responsive-design-and-theming)
   - [Data and Type Safety](#data-and-type-safety)
- [Profile Management System](#profile-management-system)
   - [Overview](#overview-1)
   - [Key Features](#key-features-1)
   - [How to Use Profile Management](#how-to-use-profile-management)
- [Multi-Language Support (i18n)](#multi-language-support-i18n)
   - [Overview](#overview-2)
   - [Supported Languages](#supported-languages)
   - [Key Features](#key-features-2)
   - [How to Use Multi-Language Support](#how-to-use-multi-language-support)
- [Visual Design Enhancements](#visual-design-enhancements)
   - [Default Category Icons and Colors](#default-category-icons-and-colors)
   - [Smart Status Indicators](#smart-status-indicators)
   - [Enhanced Visual Feedback](#enhanced-visual-feedback)
- [Category Management System](#category-management-system)
   - [Overview](#overview-3)
   - [Key Features](#key-features-3)
   - [How to Use Category Management](#how-to-use-category-management)
   - [Technical Implementation](#technical-implementation)
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

## 🙋🏻 Usage Guide

### Getting Started with Your Budget

1. **🌐 Choose Your Language**
   - Select your preferred language (Portuguese/English) from the header
   - All categories and UI elements will automatically translate
   - Language preference is saved per profile

2. **👥 Set Up Your Profile**
   - Create multiple profiles for different budgets (personal, business, family)
   - Each profile has independent categories and AI suggestions
   - Switch between profiles instantly from the header

3. **🏠 Set Your Income**
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

8. **📤 Backup and Share**
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
