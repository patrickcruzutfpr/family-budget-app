## Task

Phase 3 execution tasks:
1. Add a minimal Node/Express AI proxy under `server/`.
2. Introduce shared AI request/response DTOs for the frontend and backend.
3. Refactor `src/services/geminiService.ts` to call `/api/ai/suggestions` with a sanitized budget summary.
4. Remove frontend Gemini key injection and add dual-process local dev scripts.
5. Add backend and frontend tests covering proxy request mapping, fallback, and provider error handling.
6. Update README and architecture docs to reflect the new AI secret boundary and runtime topology.
7. Publish Phase 3 consulting artifacts and record final verification results.
