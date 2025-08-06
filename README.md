# Familia Motin Orcamento 

A modern React TypeScript application for managing family budgets with AI-powered suggestions.

## ✨ Features

- 📊 **Budget Tracking**: Track income and expenses with projected vs actual amounts
- 🤖 **AI Suggestions**: Get personalized financial advice powered by Gemini AI
- 📈 **Visual Charts**: Interactive pie charts for expense visualization
- 💾 **Data Persistence**: Automatic saving to local storage
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS

## 🏗️ Project Structure

```
src/
├── assets/           # Static assets (icons, images)
├── components/       # React components
│   ├── features/    # Feature-specific components
│   ├── layout/      # Layout components
│   └── ui/          # Reusable UI components
├── hooks/           # Custom React hooks
├── services/        # API and business logic
├── types/           # TypeScript definitions
└── utils/           # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/patrickcruzutfpr/family-budget-app.git
cd family-budget-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local and add your Gemini API key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

To get a Gemini API key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

## 📝 Usage

1. **Add Income**: Set your total monthly income
2. **Add Expenses**: Create expense categories and add items
3. **Track Spending**: Enter projected and actual amounts
4. **Get AI Suggestions**: Click "Get Smart Suggestions" for personalized advice
5. **View Charts**: Analyze spending patterns with visual charts

## 🤖 AI Features

The app includes AI-powered budget suggestions with graceful fallback to intelligent mock suggestions when the API is unavailable.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build

### Path Mapping

The project uses clean import paths:

```typescript
// Instead of relative imports
import { useBudget } from '../../../hooks/useBudget';

// Use clean absolute imports
import { useBudget } from '@/hooks';
```

## 📦 Build

To build for production:

```bash
npm run build
```

Built with ❤️ using React, TypeScript, and Vite.
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
