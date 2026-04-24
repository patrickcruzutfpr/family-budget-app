# API Documentation

This document describes REST route patterns, middleware strategy (including authentication middleware contract), and response/error formats for the backend.

## Navigation

- Previous: [server/README.md](../README.md)
- Next: [server/docs/DATABASE.md](DATABASE.md)
- Root: [README.md](../../README.md)

## 1. API Style

- Protocol: HTTP/JSON
- Base path: `/api`
- Content-Type: `application/json`
- Error envelope: standardized `error.code` and `error.message`

## 2. Current Routes

| Method | Route | Purpose | Success |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Service health check | `200` |
| `GET` | `/api/health?deep=true` | Provider-aware readiness check | `200` |
| `POST` | `/api/ai/suggestions` | Generate AI budget suggestions | `200` |

## 3. Middleware Pipeline

Current middleware chain in `server/app.ts`:

1. `express.json(...)` with raw body capture
2. Route handlers
3. Syntax error handler for malformed JSON

### Authentication middleware contract

Current status:

- Authentication middleware is not active in the current backend implementation.

Recommended insertion point:

- Place `authMiddleware` after JSON parsing and before protected routes.

Suggested contract:

- Input: `Authorization: Bearer <token>`
- Validation: JWT signature, issuer, audience, expiration
- Failure response: `401` with standardized error payload

Example future middleware order:

```text
express.json -> authMiddleware -> routeHandler -> errorHandler
```

## 4. Request and Response Formats

### 4.1 `POST /api/ai/suggestions`

Request:

```json
{
  "language": "en",
  "budgetSummary": {
    "totalIncome": 8500.00,
    "expenses": [
      {
        "category": "Food",
        "projected": 950.00,
        "actual": 1080.50
      }
    ]
  }
}
```

Success response:

```json
{
  "suggestions": [
    {
      "title": "Reduce variable costs",
      "suggestion": "Spending is $130.50 over projection in Food. Consider a weekly cap."
    }
  ]
}
```

### 4.2 Error response envelope

```json
{
  "error": {
    "code": "AI_BAD_REQUEST",
    "message": "Invalid AI suggestion request payload."
  }
}
```

## 5. Error Code Reference

| Code | HTTP | Meaning |
| --- | --- | --- |
| `AI_BAD_REQUEST` | `400` | Invalid payload or malformed input |
| `AI_BAD_RESPONSE` | `502` | Provider returned invalid or unparsable output |
| `AI_UNAVAILABLE` | `503` | Provider temporarily unavailable |
| `AI_MISCONFIGURED` | `500` | Backend/provider configuration issue |

## 6. REST Conventions for Future Endpoints

Use these conventions for new routes:

- Resource naming: plural nouns (`/api/profiles`, `/api/categories`)
- HTTP verbs: `GET`, `POST`, `PUT/PATCH`, `DELETE`
- Status usage:
  - `200` for successful reads/updates
  - `201` for successful creations
  - `204` for successful deletes with no body
  - `400`/`401`/`403`/`404`/`409`/`500` as needed
- Keep response envelopes consistent for both success and error contracts

## 7. Versioning Recommendation

If API surface grows, introduce URI versioning:

- `/api/v1/...`

Maintain backward compatibility within each major API version.

## Related Documents

- [server/docs/DATABASE.md](DATABASE.md)
- [docs/architecture/SYSTEM_DESIGN.md](../../docs/architecture/SYSTEM_DESIGN.md)

---

Next: [server/docs/DATABASE.md](DATABASE.md)
