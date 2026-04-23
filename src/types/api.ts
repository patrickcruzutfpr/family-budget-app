import type { AISuggestion } from './index';
import type { SupportedLanguage } from '@/i18n';

export interface BudgetExpenseSummary {
  category: string;
  projected: number;
  actual: number;
}

export interface BudgetSummary {
  totalIncome: number;
  expenses: BudgetExpenseSummary[];
}

export interface BudgetSummaryRequest {
  language: SupportedLanguage;
  budgetSummary: BudgetSummary;
}

export interface AISuggestionsResponse {
  suggestions: AISuggestion[];
}

export type AppApiErrorCode =
  | 'AI_BAD_REQUEST'
  | 'AI_UNAVAILABLE'
  | 'AI_MISCONFIGURED'
  | 'AI_BAD_RESPONSE';

export interface AppApiError {
  error: {
    code: AppApiErrorCode;
    message: string;
  };
}
