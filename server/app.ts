import express, { type NextFunction, type Request, type Response } from 'express';
import type { AppApiError, BudgetSummaryRequest } from '../src/types/index';
import { AppApiError as ApiError, getAiSuggestions, isBudgetSummary, isSupportedLanguage, isObject } from './aiProxyService';
import { loadProvider } from './providers';

const jsonError = (code: AppApiError['error']['code'], message: string): AppApiError => ({
  error: {
    code,
    message,
  },
});

export const createServer = () => {
  const app = express();

  // Use express.json with a `verify` hook to capture the raw bytes while
  // preserving the body for the JSON parser. This avoids consuming the
  // request stream before `express.json()` runs.
  app.use(
    express.json({
      verify: (req: Request, _res, buf: Buffer) => {
        try {
          (req as any).rawBody = buf.toString('utf8');
        } catch (e) {
          (req as any).rawBody = undefined;
        }
      },
    }),
  );

  app.get('/api/health', async (request: Request, response: Response) => {
    // Basic OK response
    const basic = { status: 'ok' } as Record<string, unknown>;

    // Optional deep provider check: ?deep=true
    const deep = String(request.query.deep || '').toLowerCase() === 'true';
    const providerName = (process.env.AI_PROVIDER ?? 'gemini').toLowerCase();

    if (!deep) {
      response.json(basic);
      return;
    }

    // Perform minimal provider readiness checks without making network calls when possible.
    const providerInfo: Record<string, unknown> = { name: providerName };

    try {
      const provider = await loadProvider(providerName);
      providerInfo.status = 'loaded';

      // If provider exposes a lightweight `healthCheck` method, call it.
      if (typeof (provider as any).healthCheck === 'function' && process.env.NODE_ENV !== 'test') {
        try {
          const ok = await (provider as any).healthCheck();
          providerInfo.status = ok ? 'ok' : 'unavailable';
        } catch (err: any) {
          providerInfo.status = 'unavailable';
          providerInfo.details = err?.message ?? String(err);
        }
      } else {
        // No explicit healthCheck: do a lightweight sanity check of required config
        if (providerName === 'gemini' && !process.env.GEMINI_API_KEY) {
          providerInfo.status = 'misconfigured';
          providerInfo.details = 'GEMINI_API_KEY missing';
        } else if (providerName === 'llmstudio' && !process.env.LLMSTUDIO_API_KEY) {
          providerInfo.status = 'misconfigured';
          providerInfo.details = 'LLMSTUDIO_API_KEY missing';
        } else {
          providerInfo.status = 'ok';
        }
      }
    } catch (err: any) {
      providerInfo.status = 'failed_to_load';
      providerInfo.details = err?.message ?? String(err);
    }

    response.json({ ...basic, provider: providerInfo });
  });

  app.post('/api/ai/suggestions', async (request: Request, response: Response) => {
    const body = request.body as BudgetSummaryRequest | undefined;

    // (debug logs removed)

    if (!isObject(body) || !isSupportedLanguage(body.language) || !isBudgetSummary(body.budgetSummary)) {
      response.status(400).json(jsonError('AI_BAD_REQUEST', 'Invalid AI suggestion request payload.'));
      return;
    }

    try {
      const result = await getAiSuggestions(body.budgetSummary, body.language);
      response.json(result);
    } catch (error) {
      if (error instanceof ApiError) {
        response.status(error.status).json(jsonError(error.code, error.message));
        return;
      }

      response.status(500).json(jsonError('AI_UNAVAILABLE', 'AI suggestions are temporarily unavailable.'));
    }
  });

  app.use((error: Error, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof SyntaxError) {
      response.status(400).json(jsonError('AI_BAD_REQUEST', 'Invalid AI suggestion request payload.'));
      return;
    }

    next(error);
  });

  return app;
};
