# L. Open Questions

## Product and users
1. Who are the primary user segments (single household, multiple households, advisor-led)?
- Why needed: to shape access model, sync strategy, and feature prioritization.
- Evidence needed: product personas and usage analytics.

2. What are the top user journeys by business value?
- Why needed: to focus SLOs and roadmap sequencing.
- Evidence needed: prioritized journey map.

## NFRs and scale
3. What reliability and latency targets are required?
- Why needed: to define operational architecture and observability investment.
- Evidence needed: target SLOs for core flows.

4. What are expected scale numbers for next 6-12 months (DAU/MAU, profile size, AI usage)?
- Why needed: to validate local-first viability and backend extraction timing.
- Evidence needed: forecast data and growth assumptions.

## Security and compliance
5. Are there formal LGPD/GDPR requirements for this product?
- Why needed: to define retention, consent, and data processing controls.
- Evidence needed: legal/compliance guidance.

6. Is AI data allowed to be sent to third-party providers for all users?
- Why needed: to determine data minimization and opt-in strategy.
- Evidence needed: privacy policy and vendor risk assessment.

## Engineering and operations
7. Should the backend expand beyond the AI proxy into core domain ownership?
- Why needed: to decide whether profiles/budgets remain local-first or migrate toward sync and centralized governance.
- Evidence needed: product roadmap, backend repo plans, or ADRs.

8. What deployment model and release process should be used (cloud, static host, rollback expectations)?
- Why needed: to define CI/CD and runbooks.
- Evidence needed: infra and DevOps standards.

9. What quality gate policy is required for merges?
- Why needed: to define CI checks and release confidence.
- Evidence needed: team engineering guidelines.

## Data lifecycle
10. What is the expected data retention and deletion policy?
- Why needed: to implement lifecycle controls and user trust guarantees.
- Evidence needed: policy decisions and support requirements.

11. Should profiles synchronize across devices/accounts?
- Why needed: to decide if localStorage-only is acceptable.
- Evidence needed: product requirement decision.

## Evidence
- Existing unknowns identified from: README.md, .github/, src/services/profileService.ts, src/services/apiService.ts, src/services/geminiService.ts, vite.config.ts
