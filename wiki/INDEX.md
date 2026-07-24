# NM-ZWDS Wiki Index

**Ingested at:** 2026-07-09T08:01:50.378Z  
**How this works:** Edit files in `wiki/raw/`, then run `node scripts/wiki-ingest.mjs` to refresh ingested pages.

---

## Start here (agents)

| Page | Purpose |
|------|---------|
| [alignment-advantage.md](alignment-advantage.md) | **Source of truth** for Alignment Advantage feature: shipped state, copy rules, file map |

---

## Raw source documents

| File | Role |
|------|------|
| [raw/alignment-advantage-implementation-record.md](raw/alignment-advantage-implementation-record.md) | Working draft / detailed spec |
| [raw/alignment-advantage-kheli-feedback-agent-prompts.md](raw/alignment-advantage-kheli-feedback-agent-prompts.md) | Working draft / detailed spec |
| [raw/alignment-advantage-kheli-feedback-spec.md](raw/alignment-advantage-kheli-feedback-spec.md) | Working draft / detailed spec |
| [raw/alignment-advantage-dayun-season-spec.md](raw/alignment-advantage-dayun-season-spec.md) | **Dayun Season chapter** — what to build (placement A, full stack, keep Founder) |
| [raw/alignment-advantage-dayun-season-agent-prompts.md](raw/alignment-advantage-dayun-season-agent-prompts.md) | **Dayun Season chapter** — copy-paste agent prompts (Agent 1 UI → Agent 2 wire) |

---

## Ingestion

```bash
node scripts/wiki-ingest.mjs
```

Raw = detailed specs and history. Ingested = consolidated pages agents should read first.
