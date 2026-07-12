#!/usr/bin/env node
/**
 * Wiki ingestion: builds agent-facing pages from wiki/raw/*.md
 *
 * Usage: node scripts/wiki-ingest.mjs
 *
 * Raw docs  = working drafts and detailed specs (wiki/raw/)
 * Ingested  = consolidated source of truth for agents (wiki/*.md)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RAW_DIR = path.join(ROOT, "wiki", "raw");
const WIKI_DIR = path.join(ROOT, "wiki");

function readRaw(name) {
  const filePath = path.join(RAW_DIR, name);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing raw doc: wiki/raw/${name}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function listRawFiles() {
  return fs
    .readdirSync(RAW_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

function extractSection(markdown, heading) {
  const sections = markdown.split(/^## /m);
  const target = sections.find((block) => block.startsWith(`${heading}\n`) || block.startsWith(`${heading}\r\n`));
  if (target === undefined) {
    return "";
  }
  return `## ${target.trim()}`;
}

function buildIndex(rawFiles, ingestedAt) {
  const rows = rawFiles
    .map((f) => `| [raw/${f}](raw/${f}) | Working draft / detailed spec |`)
    .join("\n");

  return `# NM-ZWDS Wiki Index

**Ingested at:** ${ingestedAt}  
**How this works:** Edit files in \`wiki/raw/\`, then run \`node scripts/wiki-ingest.mjs\` to refresh ingested pages.

---

## Start here (agents)

| Page | Purpose |
|------|---------|
| [alignment-advantage.md](alignment-advantage.md) | **Source of truth** for Alignment Advantage feature: shipped state, copy rules, file map |

---

## Raw source documents

| File | Role |
|------|------|
${rows}

---

## Ingestion

\`\`\`bash
node scripts/wiki-ingest.mjs
\`\`\`

Raw = detailed specs and history. Ingested = consolidated pages agents should read first.
`;
}

function buildAlignmentAdvantagePage(ingestedAt) {
  const record = readRaw("alignment-advantage-implementation-record.md");
  const spec = readRaw("alignment-advantage-kheli-feedback-spec.md");

  const repoContext = extractSection(spec, "Repo context");
  const designPrinciples = extractSection(spec, "Design principles (from review)");
  const verification = extractSection(spec, "Verification checklist");
  const outOfScope = extractSection(record, "Out of scope (unchanged)");
  const friendsFollowUp = extractSection(record, "Follow-up change (batch 2): Friends Palace copy");
  const shipped = extractSection(record, "Shipped changes (batch 1)");

  return `# Alignment Advantage — Wiki (Source of Truth)

**Ingested at:** ${ingestedAt}  
**Branch:** \`feature/alignment-advantage\`  
**Status:** Implemented

> Agents: read this page first. Use \`wiki/raw/\` for full spec detail and implementation history.

---

## Quick reference

| Item | Value |
|------|-------|
| Route | \`/alignment-advantage\` |
| Feature flag | \`hasAlignmentAdvantage\` |
| Main page | \`src/pages/alignment-advantage/index.tsx\` |
| People copy data | \`src/components/alignment-advantage/shared/peoplePalaceGuidance.ts\` |
| Mini grid | \`src/components/alignment-advantage/shared/TwelvePalaceMiniGrid.tsx\` |
| Print | \`src/components/alignment-advantage/print/AlignmentAdvancePrintDocument.tsx\` |

${repoContext}

---

## Current shipped behavior

${shipped}

---

${friendsFollowUp}

---

## Copy rules (active)

1. **Layman English** — no jargon (exacting, principled without context, etc.)
2. **No false temporality** — watch-outs must not imply "this week your relationship is fragile" on every revisit
3. **No arbitrary dollar amounts** — use relative scale (major financial commitment)
4. **Friends Palace (交友)** — collaboration and joint work, not paying clients or social friend language
5. **No em dashes** in client-facing copy
6. **Report is read-only** — no clickable checklist inputs in Deal-Flow section

---

${outOfScope}

---

${designPrinciples}

---

${verification}

---

## Raw documents

| Doc | Use when |
|-----|----------|
| [raw/alignment-advantage-implementation-record.md](raw/alignment-advantage-implementation-record.md) | Commit history, Friends Palace follow-up, shipped file list |
| [raw/alignment-advantage-kheli-feedback-spec.md](raw/alignment-advantage-kheli-feedback-spec.md) | Original requirements and file map |
| [raw/alignment-advantage-kheli-feedback-agent-prompts.md](raw/alignment-advantage-kheli-feedback-agent-prompts.md) | Agent task prompts used for batch 1 |
`;
}

function main() {
  const ingestedAt = new Date().toISOString();
  const rawFiles = listRawFiles();

  if (!fs.existsSync(WIKI_DIR)) {
    fs.mkdirSync(WIKI_DIR, { recursive: true });
  }

  const indexPath = path.join(WIKI_DIR, "INDEX.md");
  const aaPath = path.join(WIKI_DIR, "alignment-advantage.md");

  fs.writeFileSync(indexPath, buildIndex(rawFiles, ingestedAt), "utf8");
  fs.writeFileSync(aaPath, buildAlignmentAdvantagePage(ingestedAt), "utf8");

  console.log("Wiki ingestion complete.");
  console.log(`  Raw sources: ${rawFiles.length} file(s) in wiki/raw/`);
  console.log(`  Wrote: wiki/INDEX.md`);
  console.log(`  Wrote: wiki/alignment-advantage.md`);
}

main();
