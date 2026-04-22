# H. Security and Privacy Review

## Lightweight threat model

### Assets
- Budget and profile financial data stored locally.
- Saved AI suggestions and language preferences.
- Gemini API key and request payloads.

### Threat actors
- Malicious script running in browser context.
- Casual attacker abusing leaked API keys.
- User-side data loss from browser storage corruption/cleanup.

### Entry points
- Browser localStorage.
- Gemini API requests from client.
- Optional backend API fetch calls.
- Profile JSON import path.

## OWASP-aligned risks
- Sensitive data exposure:
  - API key injected into client build/runtime.
- Insecure design:
  - Secrets handled client-side instead of server-side proxy.
- Data integrity issues:
  - Delete-category warning and implementation mismatch can lead to data loss.
- Input handling risks:
  - Profile import validates basic shape but lacks strict schema and size controls.

## Secrets handling
- Current state: secret appears in client env mapping.
- Recommended baseline:
  - move Gemini calls to backend proxy
  - enforce server-side key vault usage
  - add request quotas and abuse protections

## Privacy considerations
- Current behavior:
  - financial data remains in browser localStorage by default.
  - no explicit consent or privacy policy workflow in codebase.
- Risks:
  - local shared-device exposure
  - lack of defined retention and deletion policy

## Least privilege review
- No role-based authorization model in main app flow.
- Optional backend wrapper has no token/session handling in client code.

## Compliance status
- GDPR/LGPD/PCI applicability: Unknown.
- Evidence needed:
  - data classification inventory
  - lawful basis and consent requirements
  - retention/deletion policy
  - DPA/processor obligations for AI provider

## Recommended controls (priority order)
1. Move AI key and AI call execution server-side.
2. Add strict import schema validation and payload limits.
3. Fix category delete behavior to match user warning.
4. Add privacy notice and local data handling guidance.
5. Add optional encryption-at-rest strategy for local cache if needed.

## Evidence
- Client key exposure path: vite.config.ts, src/services/geminiService.ts
- Import/export profile path: src/services/profileService.ts
- Local persistence keys and suggestion storage: src/services/profileService.ts, src/hooks/useSavedSuggestions.ts
- Category delete mismatch: src/components/features/DeleteConfirmationModal.tsx, src/services/categoryService.ts
- Optional backend wrapper without auth contract in client: src/services/apiService.ts
