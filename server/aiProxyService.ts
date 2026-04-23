import { loadProvider } from './providers';
import { AppApiError, isObject, isBudgetSummary, isSupportedLanguage, normalizeSuggestions } from './lib/aiHelpers';
import type { SupportedLanguage } from '../src/i18n/index';
import type { AISuggestionsResponse, BudgetSummary } from '../src/types/index';

export const getAiSuggestions = async (
  budgetSummary: BudgetSummary,
  language: SupportedLanguage,
): Promise<AISuggestionsResponse> => {
  const provider = await loadProvider(process.env.AI_PROVIDER);
  return provider.getAiSuggestions(budgetSummary, language);
};

export { AppApiError, isObject, isBudgetSummary, isSupportedLanguage, normalizeSuggestions };
