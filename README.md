# 💰 Family Budget App 

A modern React TypeScript application for managing family budgets with AI-powered suggestions and real-time financial insights.

## ✨ Features

- 📊 **Budget Tracking**: Track income and expenses with projected vs actual amounts
- 🤖 **AI Suggestions**: Get personalized financial advice powered by Gemini AI
- 📈 **Visual Charts**: Interactive pie charts and expense visualization with Recharts
- 💾 **Data Persistence**: Automatic saving to local storage with data backup
- 🎨 **Modern UI**: Clean, responsive design with modern CSS styling
- 📱 **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- 🔐 **Type Safety**: Full TypeScript support for robust development
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds
- 🌐 **PWA Ready**: Progressive Web App capabilities for offline usage

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
- Node.js 18+ or higher
- npm 8+ or yarn 1.22+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/patrickcruzutfpr/family-budget-app.git
cd family-budget-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
# For Windows (PowerShell)
copy .env.local.example .env.local

# For macOS/Linux
cp .env.local.example .env.local

# Edit .env.local and add your Gemini API key
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173) to see the app running.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Required: Gemini AI API Key for smart budget suggestions
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: App configuration
VITE_APP_TITLE="Familia Motin Orcamento"
VITE_APP_VERSION="1.0.0"
```

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `.env.local` file

### Troubleshooting Installation

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

## 📝 Usage Guide

### Getting Started with Your Budget

1. **🏠 Set Your Income**
   - Enter your total monthly income
   - Include all income sources (salary, freelance, investments)
   - Update regularly for accuracy

2. **📋 Create Expense Categories**
   - Add categories like Housing, Food, Transportation
   - Set projected amounts for each category
   - Customize categories to fit your lifestyle

3. **💰 Track Your Expenses**
   - Enter actual spending amounts
   - Compare projected vs actual spending
   - Monitor your budget in real-time

4. **🤖 Get AI-Powered Insights**
   - Click "Get Smart Suggestions" for personalized advice
   - Receive budget optimization recommendations
   - Get spending pattern analysis

5. **📊 Analyze with Charts**
   - View interactive pie charts of your expenses
   - Identify spending trends and patterns
   - Make data-driven financial decisions

### Key Features Walkthrough

- **Dashboard**: Overview of your financial health
- **Budget Calculator**: Real-time budget calculations
- **Expense Tracker**: Detailed expense management
- **AI Assistant**: Smart financial recommendations
- **Visual Analytics**: Charts and graphs for insights

## 🤖 AI Features

### Smart Budget Analysis
The app leverages Google's Gemini AI to provide intelligent budget insights:

- **Personalized Recommendations**: Tailored advice based on your spending patterns
- **Expense Optimization**: Suggestions for reducing unnecessary expenses
- **Financial Goal Planning**: Help setting and achieving financial targets
- **Spending Alerts**: Proactive warnings about budget overruns
- **Trend Analysis**: AI-powered insights into your financial habits

### Fallback Intelligence
When AI services are unavailable, the app provides:
- Smart mock suggestions based on financial best practices
- Local calculation-based recommendations
- Offline budget analysis capabilities

## 🛠️ Development

### Tech Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.3.5 for fast development and builds
- **Charts**: Recharts 3.1.2 for data visualization
- **AI Integration**: Google Gemini AI (@google/genai)
- **State Management**: Redux Toolkit for complex state
- **Styling**: Modern CSS with responsive design
- **Package Manager**: npm with Node.js 18+

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

### Project Architecture

```
src/
├── components/
│   ├── features/     # Feature-specific components
│   │   ├── budget/   # Budget management
│   │   ├── expenses/ # Expense tracking
│   │   └── ai/       # AI suggestions
│   ├── layout/       # Layout components
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── services/         # Business logic and API calls
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
└── assets/           # Static files
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
- Check API key permissions in Google AI Studio
- Verify network connectivity for API calls

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue on [GitHub Issues](https://github.com/patrickcruzutfpr/family-budget-app/issues)
- Check existing documentation in the `/docs` folder
- Review the troubleshooting section above

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for intelligent budget suggestions
- [Recharts](https://recharts.org/) for beautiful data visualization
- [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/) communities
- [Vite](https://vitejs.dev/) for the excellent development experience

---

**Built with ❤️ by [Patrick Cruz](https://github.com/patrickcruzutfpr)**

*Making family budget management simple, intelligent, and accessible for everyone.*
