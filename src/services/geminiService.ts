import { GoogleGenAI, Type } from "@google/genai";
import { BudgetState, AISuggestion, CategoryType } from "@/types";
import { SupportedLanguage } from "@/i18n";
import { getBudgetSuggestionsMock } from "./geminiServiceMock";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  // This is a fallback for development; in a real deployment, the key should be set.
  console.warn("GEMINI_API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

export const getBudgetSuggestions = async (budget: BudgetState, language: SupportedLanguage = 'pt-BR'): Promise<AISuggestion[]> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  
  const model = "gemini-2.5-flash";

  const simplifiedBudget = {
    totalIncome: budget
      .find(c => c.type === CategoryType.INCOME)
      ?.items.reduce((sum, item) => sum + item.actual, 0) || 0,
    expenses: budget
      .filter(c => c.type === CategoryType.EXPENSE)
      .map(category => ({
        category: category.name,
        projected: category.items.reduce((sum, item) => sum + item.projected, 0),
        actual: category.items.reduce((sum, item) => sum + item.actual, 0),
      })),
  };
  
  // Create language-specific prompts
  const getPrompt = (lang: SupportedLanguage) => {
    if (lang === 'en') {
      return `
        You are an expert financial advisor AI. Analyze the following family budget data, which is provided in JSON format.
        The data shows projected spending vs. actual spending for various categories.

        Budget Data:
        \`\`\`json
        ${JSON.stringify(simplifiedBudget, null, 2)}
        \`\`\`

        Based on this data, provide 3 concise, actionable, and encouraging suggestions for saving money or optimizing the budget.
        Focus on the categories where spending is highest or most over budget.
        Your suggestions should be practical for a family.
        
        Please respond in English.
      `;
    }
    
    // Portuguese (default)
    return `
      Você é um consultor financeiro especialista em IA. Analise os seguintes dados do orçamento familiar, que são fornecidos em formato JSON.
      Os dados mostram gastos projetados vs. gastos reais para várias categorias.

      Dados do Orçamento:
      \`\`\`json
      ${JSON.stringify(simplifiedBudget, null, 2)}
      \`\`\`

      Com base nesses dados, forneça 3 sugestões concisas, práticas e encorajadoras para economizar dinheiro ou otimizar o orçamento.
      Foque nas categorias onde os gastos são mais altos ou estão mais acima do orçamento.
      Suas sugestões devem ser práticas para uma família.
      
      Por favor, responda em português brasileiro.
    `;
  };
  
  const prompt = getPrompt(language);

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
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
                    description: "A short, catchy title for the suggestion.",
                  },
                  suggestion: {
                    type: Type.STRING,
                    description: "The detailed suggestion text.",
                  },
                },
              },
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result.suggestions && Array.isArray(result.suggestions)) {
      return result.suggestions;
    }

    return [];
  } catch (error) {
    console.error("Error fetching suggestions from Gemini API:", error);
    
    // Check if it's an API key suspension error
    if (error.message && error.message.includes("suspended")) {
      console.warn("API key suspended, falling back to mock suggestions");
      return await getBudgetSuggestionsMock(budget, language);
    }
    
    throw new Error("Failed to get AI-powered suggestions. Please try again later.");
  }
};
