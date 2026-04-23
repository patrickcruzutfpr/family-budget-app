import { GoogleGenAI, Type } from '@google/genai';
import type { SupportedLanguage } from '../src/i18n/index';
import type {
  AISuggestion,
  AISuggestionsResponse,
  AppApiErrorCode,
  BudgetSummary,
} from '../src/types/index';

const MODEL_NAME = 'gemini-2.5-flash';

const PROVIDER_UNAVAILABLE_PATTERNS = ['suspended', 'unavailable', 'overloaded', 'quota'];

export class AppApiError extends Error {
  public readonly code: AppApiErrorCode;
  public readonly status: number;

  constructor(code: AppApiErrorCode, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isBudgetSummary = (value: unknown): value is BudgetSummary => {
  if (!isObject(value) || typeof value.totalIncome !== 'number' || !Array.isArray(value.expenses)) {
    return false;
  }

  return value.expenses.every(
    (expense) =>
      isObject(expense) &&
      typeof expense.category === 'string' &&
      typeof expense.projected === 'number' &&
      typeof expense.actual === 'number',
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
  if (!isObject(payload) || !Array.isArray(payload.suggestions)) {
    throw new AppApiError('AI_BAD_RESPONSE', 'AI provider returned an invalid response.', 502);
  }

  const suggestions = payload.suggestions.filter(
    (entry): entry is AISuggestion =>
      isObject(entry) && typeof entry.title === 'string' && typeof entry.suggestion === 'string',
  );

  if (suggestions.length === 0) {
    throw new AppApiError('AI_BAD_RESPONSE', 'AI provider returned no valid suggestions.', 502);
  }

  return { suggestions };
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

const mapProviderError = (error: unknown): AppApiError => {
  const message = getErrorMessage(error).toLowerCase();

  if (PROVIDER_UNAVAILABLE_PATTERNS.some((pattern) => message.includes(pattern))) {
    return new AppApiError('AI_UNAVAILABLE', 'AI suggestions are temporarily unavailable.', 503);
  }

  return new AppApiError('AI_BAD_RESPONSE', 'Failed to process the AI provider response.', 502);
};

export const getAiSuggestions = async (
  budgetSummary: BudgetSummary,
  language: SupportedLanguage,
): Promise<AISuggestionsResponse> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AppApiError('AI_MISCONFIGURED', 'AI service is not configured.', 500);
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildBudgetPrompt(budgetSummary, language);

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                  },
                  suggestion: {
                    type: Type.STRING,
                  },
                },
              },
            },
          },
        },
      },
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
      throw new AppApiError('AI_BAD_RESPONSE', 'AI provider returned an empty response.', 502);
    }

    return normalizeSuggestions(JSON.parse(jsonText));
  } catch (error) {
    if (error instanceof AppApiError) {
      throw error;
    }

    throw mapProviderError(error);
  }
};
