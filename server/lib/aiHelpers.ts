import type { SupportedLanguage } from '../src/i18n/index';
import type { AISuggestion, AISuggestionsResponse, BudgetSummary } from '../src/types/index';

export class AppApiError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isBudgetSummary = (value: unknown): value is BudgetSummary => {
  if (!isObject(value) || typeof (value as any).totalIncome !== 'number' || !Array.isArray((value as any).expenses)) {
    return false;
  }

  return (value as any).expenses.every(
    (expense: unknown) =>
      isObject(expense) &&
      typeof (expense as any).category === 'string' &&
      typeof (expense as any).projected === 'number' &&
      typeof (expense as any).actual === 'number',
  );
};

export const isSupportedLanguage = (value: unknown): value is SupportedLanguage =>
  value === 'en' || value === 'pt-BR';

export const buildBudgetPrompt = (budgetSummary: BudgetSummary, language: SupportedLanguage): string => {
  if (language === 'en') {
    return `
      You are an expert financial advisor AI. Analyze the following family budget summary in JSON format.
      The data shows total income and projected vs actual spending for expense categories.

      Budget Summary:
      \`\`\`json
      ${JSON.stringify(budgetSummary, null, 2)}
      \`\`\`

      Provide 3 concise, actionable, and encouraging suggestions for saving money or optimizing the budget.
      Focus on categories with the highest actual spend or the largest overruns.
      Return suggestions practical for a family. Respond in English.
    `;
  }

  return `
    Voce e um consultor financeiro especialista em IA. Analise o seguinte resumo do orcamento familiar em JSON.
    Os dados mostram renda total e gastos projetados vs reais para categorias de despesa.

    Resumo do Orcamento:
    \`\`\`json
    ${JSON.stringify(budgetSummary, null, 2)}
    \`\`\`

    Forneca 3 sugestoes concisas, praticas e encorajadoras para economizar dinheiro ou otimizar o orcamento.
    Foque nas categorias com gasto real mais alto ou maior estouro do orcamento.
    Responda em portugues brasileiro.
  `;
};

export const normalizeSuggestions = (payload: unknown): AISuggestionsResponse => {
  if (!isObject(payload) || !Array.isArray((payload as any).suggestions)) {
    throw new AppApiError('AI_BAD_RESPONSE', 'AI provider returned an invalid response.', 502);
  }

  const suggestions = (payload as any).suggestions.filter(
    (entry: unknown): entry is AISuggestion =>
      isObject(entry) && typeof (entry as any).title === 'string' && typeof (entry as any).suggestion === 'string',
  );

  if (suggestions.length === 0) {
    throw new AppApiError('AI_BAD_RESPONSE', 'AI provider returned no valid suggestions.', 502);
  }

  return { suggestions };
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const PROVIDER_UNAVAILABLE_PATTERNS = ['suspended', 'unavailable', 'overloaded', 'quota'];

export const mapProviderError = (error: unknown): AppApiError => {
  const message = getErrorMessage(error).toLowerCase();
  if (PROVIDER_UNAVAILABLE_PATTERNS.some((pattern) => message.includes(pattern))) {
    return new AppApiError('AI_UNAVAILABLE', 'AI suggestions are temporarily unavailable.', 503);
  }

  return new AppApiError('AI_BAD_RESPONSE', 'Failed to process the AI provider response.', 502);
};
