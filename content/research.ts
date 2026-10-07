/*
 * Every number on the site comes from this file, and every number here was
 * checked against a research artifact. Scope travels with the value; numbers
 * from different scopes are never placed side by side as if comparable.
 *
 * Non-breaking spaces ( ) keep statistics such as confidence intervals
 * on one line.
 *
 * LoCoMo naming: the benchmark harness inherited category constants that swap
 * single-hop and multi-hop. This file uses the dataset's own names: category 1
 * (n=282, ~3.1 evidence messages per question) is multi-hop; category 4 is
 * single-hop. See docs/BENCHMARKS.md in NeuralGraph.
 */

const REPO = "https://github.com/anovruzov/NeuralGraph";
const blob = (path: string, branch = "main") => `${REPO}/blob/${branch}/${path}`;

export type Source = { label: string; path: string; href?: string };

export type Metric = {
  value: string;
  label: string;
  scope: string;
};

export const memory = {
  question:
    "Can a system keep knowledge across long interactions while preserving structure, provenance, and local context?",
  headline: {
    value: "73.8%",
    label: "Multi-hop accuracy on LoCoMo",
    scope: "282 questions · lenient local judge (gemma-4-e4b)",
  },
  gain: "Up from 64.9% with flat retrieval on the same questions. The gain holds under all four judges tested.",
  from: { value: "64.9%", label: "Same questions, flat retrieval", scope: "282 multi-hop questions · same judge" },
  recall: { value: "39.4 → 46.8", label: "Recall@10 from routing alone", scope: "Same 282 questions" },
  strict: {
    value: "+9.6 points",
    label: "The same gain under a strict judge",
    scope: "qwen3.6-35b strict · 21.6% → 31.2%",
  },
  slice: [
    { value: "72.2%", label: "Overall", scope: "744 questions · conversations 1–5" },
    { value: "72.8%", label: "Single-hop", scope: "400 questions · same slice" },
    { value: "73.7%", label: "Temporal", scope: "156 questions · same slice" },
  ] as Metric[],
  fast: { value: "0.44 s", label: "End-to-end, without the reranker", scope: "All 1,540 questions · 61.9% accuracy" },
  sources: [
    { label: "Benchmark summary", path: "docs/BENCHMARKS.md", href: blob("docs/BENCHMARKS.md") },
    {
      label: "Pair-routing results",
      path: "research/results/local_pairs_single_hop.json",
      href: blob("research/results/local_pairs_single_hop.json"),
    },
    {
      label: "Flat-retrieval results",
      path: "research/results/flat_single_hop.json",
      href: blob("research/results/flat_single_hop.json"),
    },
    {
      label: "744-question evaluation",
      path: "research/results/capstone_full.json",
      href: blob("research/results/capstone_full.json"),
    },
    {
      label: "Fast-path campaign report",
      path: "docs/research/RESULTS_ALL.md",
      href: blob("docs/research/RESULTS_ALL.md", "research/retrieval-campaign-2026-09"),
    },
  ] as Source[],
};

export const lineage = {
  question:
    "When knowledge is spread across thousands of agents and an attacker takes out half of them, does knowing where a claim came from keep it trustworthy?",
  setup: "10,000 simulated agents · 50% targeted attack · 30 paired seeds · 4 replicas per claim",
  rows: [
    { id: "B3", name: "Random placement", acc: ".441", iss: ".504", msgs: "8.0" },
    { id: "B6", name: "Lineage-aware placement", acc: ".451", iss: ".550", msgs: "8.0", hl: true },
    { id: "B7", name: "Lineage-aware, with questioning", acc: ".594", iss: ".550", msgs: "14.5", hl: true },
    { id: "B3Q", name: "Random, with questioning", acc: ".628", iss: ".507", msgs: "15.7" },
  ],
  headline: {
    value: ".504 → .550",
    label: "Independent support surviving a 50% targeted attack",
    scope: "Random → lineage-aware placement · 30 paired seeds",
  },
  ci: "Δ +.046, 95% CI [.046, .047]",
  questioning: {
    value: ".451 → .594",
    label: "Task accuracy with questioning",
    scope: "Same placement · 8.0 → 14.5 messages per claim",
  },
  sources: [
    {
      label: "Agentic-web stress test",
      path: "experiments/large_scale_agentic_web/RESULTS.md",
      href: blob("experiments/large_scale_agentic_web/RESULTS.md", "claude/agentic-web-stress-test-2czsv3"),
    },
  ] as Source[],
};

export const emergence = {
  question:
    "Can thousands of private agents combine partial evidence into discoveries that no single agent has enough evidence to make, and learn what to ask next?",
  headline: {
    value: "57.0%",
    label: "Hidden patterns found, up from 39.5%",
    scope: "10,000 simulated agents · held-out seeds 5–9",
  },
  ci: "+17.5 points · 95% CI [+12.5, +21.0] · 5 of 5 seeds improve",
  bars10k: [
    { label: "Found rate", before: 39.5, after: 57.0 },
    { label: "Evidence coverage", before: 66.5, after: 93.0 },
    { label: "Rare-pattern recall", before: 22.0, after: 34.8 },
    { label: "Average precision", before: 3.6, after: 17.6 },
  ],
  table50k: [
    { name: "Mycelic hierarchy", found: "56.6%", cov: "70.8%", rare: "31.5%", compute: "3.86M", hl: true },
    { name: "Chunked central context", found: "78.4%", cov: "100%", rare: "69.2%", compute: "10.20M" },
    { name: "Oracle retrieval", found: "42.4%", cov: "100%", rare: "21.0%", compute: "2.43M" },
    { name: "Lean hierarchy", found: "50.2%", cov: "55.6%", rare: "24.5%", compute: "2.68M" },
    { name: "Central triage", found: "31.4%", cov: "46.2%", rare: "11.6%", compute: "1.07M" },
  ],
  scatter: [
    { name: "Mycelic hierarchy", x: 3.86, y: 56.6, hl: true },
    { name: "Chunked central context", x: 10.2, y: 78.4 },
    { name: "Oracle retrieval", x: 2.43, y: 42.4 },
    { name: "Lean hierarchy", x: 2.68, y: 50.2 },
    { name: "Central triage", x: 1.07, y: 31.4 },
  ],
  scale: {
    value: "56.6%",
    label: "Found at 50,000 simulated agents",
    scope: "3.86M modeled compute units, against 10.2M for central context",
  },
  oracle: {
    value: "42.4%",
    label: "Found with 100% retrieval coverage",
    scope: "Oracle retrieval · 50,000 simulated agents",
  },
  decoy: {
    value: "36.0% → 74.4%",
    label: "Stale-chain decoys accepted",
    scope: "50,000 simulated agents · a regression, reported as one",
  },
  sources: [
    {
      label: "vNext research report",
      path: "docs/mycelic_vnext/NEXT_RESEARCH_REPORT.md",
      href: blob("docs/mycelic_vnext/NEXT_RESEARCH_REPORT.md"),
    },
    { label: "vNext full results", path: "docs/mycelic_vnext/ALL.md", href: blob("docs/mycelic_vnext/ALL.md") },
    {
      label: "Preprint",
      path: "Targeted Evidence Acquisition for Discovery in Hierarchical Agent Memory",
    },
  ] as Source[],
};
