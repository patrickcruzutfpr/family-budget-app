import express, { type NextFunction, type Request, type Response } from 'express';
import type { AppApiError, BudgetSummaryRequest } from '../src/types/index';
import {
  AppApiError as ApiError,
  getAiSuggestions,
  isBudgetSummary,
  isSupportedLanguage,
  isObject,
} from './aiProxyService';

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

  app.get('/api/health', (_request: Request, response: Response) => {
    response.json({ status: 'ok' });
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
