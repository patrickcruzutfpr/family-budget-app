# Data Architecture (DuckLake + dbt)

This document defines the data architecture baseline for analytics and historical processing using DuckLake as the primary data lakehouse engine and dbt for transformations.

## Navigation

- Previous: [server/docs/API.md](API.md)
- Next: [README.md](../../README.md)
- Backend setup: [server/README.md](../README.md)

## 1. Scope and Current State

Current runtime behavior:

- Operational budget/profile data is local-first in the frontend (`localStorage`).
- Backend currently serves AI orchestration endpoints.

Target analytics architecture:

- Centralized lakehouse with DuckLake
- Medallion layers (Bronze, Silver, Gold)
- dbt-managed transformation and modeling lifecycle

## 2. DuckLake Lakehouse Baseline

DuckLake is the primary engine for storing and querying analytical data generated from application events and exports.

### 2.1 Storage tiers (Medallion)

| Layer | Purpose | Data Quality |
| --- | --- | --- |
| Bronze | Raw ingested events and snapshots | Minimal validation |
| Silver | Cleaned, typed, de-duplicated domain tables | Domain-aligned |
| Gold | Business-ready marts for KPIs and reporting | Curated |

### 2.2 Example domain flow

1. Ingest raw profile snapshots and AI interaction events into Bronze.
2. Normalize profile, category, and suggestion entities into Silver.
3. Publish financial marts and AI usage marts into Gold.

## 3. Proposed Data Model

## 3.1 Bronze tables

- `bronze_profile_snapshot_events`
- `bronze_budget_item_events`
- `bronze_ai_request_events`
- `bronze_ai_response_events`

## 3.2 Silver tables

- `silver_profiles`
- `silver_categories`
- `silver_budget_items`
- `silver_ai_suggestions`

## 3.3 Gold marts

- `gold_monthly_budget_summary`
- `gold_category_variance`
- `gold_ai_feature_adoption`

## 4. dbt Transformation Strategy

dbt is used to:

- Define SQL models for Bronze-to-Silver-to-Gold transitions
- Enforce tests (`not_null`, `unique`, `relationships`)
- Track lineage and documentation
- Manage incremental models for large event volumes

Recommended dbt structure:

```text
dbt/
|- models/
|  |- bronze/
|  |- silver/
|  |- gold/
|- tests/
|- snapshots/
|- macros/
```

## 5. Example Financial Metric Contract (US format)

| Metric | Example |
| --- | --- |
| Monthly Income | `$8,500.00` |
| Monthly Expenses | `$6,920.45` |
| Monthly Balance | `$1,579.55` |
| Housing Variance | `$+150.00` |

## 6. Data Quality and Operations

Recommended controls:

- Ingestion schema validation at Bronze load
- Deterministic surrogate keys in Silver
- Daily reconciliation checks between Silver and Gold
- dbt test gate in CI for transformation code

## 7. Security and Privacy

- Keep sensitive provider credentials outside analytical datasets.
- Tokenize or hash user-identifying fields if exported.
- Store only required analytical attributes in Gold marts.

## 8. Implementation Roadmap

1. Define event export contract from app/backend.
2. Stand up DuckLake storage and ingestion jobs.
3. Build dbt Bronze models and quality tests.
4. Add Silver normalization models.
5. Publish Gold finance and AI usage marts.

## Related Documents

- [server/docs/API.md](API.md)
- [docs/automation/CI_CD.md](../../docs/automation/CI_CD.md)
- [docs/architecture/SYSTEM_DESIGN.md](../../docs/architecture/SYSTEM_DESIGN.md)

---

Next: [README.md](../../README.md)
