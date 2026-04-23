import { SupportedLanguage } from '@/i18n';
import {
  AISuggestion,
  AppApiError,
  BudgetState,
  BudgetSummary,
  BudgetSummaryRequest,
  CategoryType,
} from '@/types';
import { getBudgetSuggestionsMock } from './geminiServiceMock';

const AI_PROXY_ENDPOINT = '/api/ai/suggestions';
const GENERIC_AI_ERROR = 'Failed to get AI-powered suggestions. Please try again later.';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const buildBudgetSummary = (budget: BudgetState): BudgetSummary => ({
  totalIncome:
    budget
      .filter((category) => category.type === CategoryType.INCOME)
      .flatMap((category) => category.items)
      .reduce((sum, item) => sum + item.actual, 0) || 0,
  expenses: budget
    .filter((category) => category.type === CategoryType.EXPENSE)
    .map((category) => ({
      category: category.name,
      projected: category.items.reduce((sum, item) => sum + item.projected, 0),
      actual: category.items.reduce((sum, item) => sum + item.actual, 0),
    })),
});

const isAppApiError = (value: unknown): value is AppApiError =>
  isObject(value) &&
  isObject(value.error) &&
  typeof value.error.code === 'string' &&
  typeof value.error.message === 'string';

const isSuggestionsResponse = (value: unknown): value is { suggestions: AISuggestion[] } =>
  isObject(value) &&
  Array.isArray(value.suggestions) &&
  value.suggestions.every(
    (entry) => isObject(entry) && typeof entry.title === 'string' && typeof entry.suggestion === 'string',
  );

const createRequestBody = (budget: BudgetState, language: SupportedLanguage): BudgetSummaryRequest => ({
  language,
  budgetSummary: buildBudgetSummary(budget),
});

export const getBudgetSuggestions = async (
  budget: BudgetState,
  language: SupportedLanguage = 'pt-BR',
): Promise<AISuggestion[]> => {
  const response = await fetch(AI_PROXY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createRequestBody(budget, language)),
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    if (isAppApiError(payload) && payload.error.code === 'AI_UNAVAILABLE') {
      return getBudgetSuggestionsMock(budget, language);
    }

    throw new Error(GENERIC_AI_ERROR);
  }

  if (!isSuggestionsResponse(payload)) {
    throw new Error(GENERIC_AI_ERROR);
  }

  return payload.suggestions;
};
