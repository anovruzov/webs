import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import HowFigure from "@/components/HowFigure";

const DESCRIPTION =
  "How Mycelic finds patterns that span an organization while each part of it keeps its own data: local reasoning, lineage, independent support, and targeted questioning.";

export const metadata: Metadata = {
  title: "Technology",
  description: DESCRIPTION,
  alternates: { canonical: "/technology" },
  openGraph: {
    title: "Technology — Mycelic",
    description: DESCRIPTION,
    url: "/technology",
    siteName: "Mycelic",
    type: "website",
  },
};

const PRINCIPLES = [
  {
    t: "Local intelligence",
    claim: "Reason where information lives.",
    body: "Each participant keeps its own records and its own memory. What moves upward is a structured claim about what was observed and when, not the raw record.",
  },
  {
    t: "Lineage",
    claim: "Every finding stays connected to its evidence.",
    body: "Claims carry the source roots they came from. A conclusion can always be walked back to the observations behind it, and retracted when they change.",
  },
  {
    t: "Independent support",
    claim: "Separate sources strengthen a hypothesis. Copies do not.",
    body: "Support is counted by distinct source roots. A report forwarded a thousand times is still one witness. Contradicting observations are kept, not outvoted.",
  },
  {
    t: "Hypothesis formation",
    claim: "Signals too weak alone become meaningful together.",
    body: "Claims about the same entity, from different places and times, are assembled into ordered chains: this changed, then that drifted, then this failed.",
  },
  {
    t: "Continual questioning",
    claim: "The system identifies what it still needs to know.",
    body: "A missing link or thin support becomes a specific, bounded question: which entity, which predicate, where it is likely held, and what it costs to ask.",
  },
  {
    t: "Verification",
    claim: "Questions return to the relevant sources.",
    body: "Requests are routed down the organization to the holders most likely to answer. They reply with structured evidence and its roots, read locally.",
  },
  {
    t: "Distribution",
    claim: "Verified knowledge goes back to the people and systems it affects.",
    body: "A finding travels with its lineage attached, so whoever receives it can act on it, check it, and see when it stops being true.",
  },
  {
    t: "Recursive learning",
    claim: "New knowledge changes what the system investigates next.",
    body: "Each round revises a bounded register of what the organization believes. The new state exposes new gaps, and those become the next questions.",
  },
];

const FLOW = [
  {
    t: "Local evidence holders",
    d: "Raw records and source-root identifiers. They never leave on the upward path.",
    dir: "up",
  },
  {
    t: "Hierarchical abstraction",
    d: "Team, department, site, region. Claims, roots, and validity intervals move up.",
    dir: "up",
  },
  {
    t: "Enterprise kernel",
    d: "Temporal synthesis, learned ranking, and a bounded top-K register of hypotheses.",
    dir: "up",
  },
  {
    t: "Question artifact",
    d: "Entity, missing predicates, estimated gain, estimated cost, routing hint.",
    dir: "down",
  },
  {
    t: "Targeted descent",
    d: "Branch indices route the request to likely holders, who answer from an authorized local read.",
    dir: "down",
  },
  {
    t: "Structured answer",
    d: "Claims with witness roots and timing merge into the pool, and the register is revised.",
    dir: "down",
  },
];

export default function Technology() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="label">
            <span className="idx">Technology</span>
          </p>
          <h1 className="h1">Discovery without centralization.</h1>
          <p className="lede">
            Mycelic finds patterns that span an organization while each part of it keeps its own data. This page
            explains the system from the idea down to what is implemented today.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: "var(--section)" }}>
        <div className="wrap">
          <ol className="rows">
            {PRINCIPLES.map((p, i) => (
              <Reveal as="li" className="reveal row" key={p.t}>
                <span className="row-idx label">
                  <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <h2 className="row-title h3">{p.t}</h2>
                <div className="row-body">
                  <p className="claim">{p.claim}</p>
                  <p className="body">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="label">
              <span className="idx">In one figure</span>
            </span>
            <h2 className="h2">Findings move. Records stay.</h2>
          </div>
          <HowFigure />
        </div>
      </section>

      <section className="section night">
        <div className="wrap">
          <div className="sec-head">
            <span className="label">
              <span className="idx">Underneath</span>
            </span>
            <h2 className="h2">The acquisition loop.</h2>
            <p className="body">
              Hierarchies compress. A summary keeps each event’s local relevance and loses the combination that made it
              useful. Mycelic treats that loss as a target: gaps in a hypothesis become requests routed back down to the
              holders who can fill them.
            </p>
          </div>

          <div className="block" style={{ marginTop: "clamp(48px, 6vw, 88px)" }}>
            <div className="block-head">
              <p className="label">
                <span className="idx">Information flow</span>
              </p>
              <p className="body">Claims rise through the hierarchy. Deficits travel back down as bounded requests.</p>
            </div>
            <div className="block-body">
              <ol className="flow">
                {FLOW.map((f) => (
                  <li className={f.dir === "down" ? "down" : undefined} key={f.t}>
                    <span className="pt" />
                    <div>
                      <div className="t">
                        {f.t} <span className="note">{f.dir === "down" ? "↓ down" : "↑ up"}</span>
                      </div>
                      <div className="d">{f.d}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="note">Repeat after the evidence updates the register.</p>
            </div>
          </div>

          <div className="block">
            <div className="block-head">
              <p className="label">
                <span className="idx">Claims and support</span>
              </p>
            </div>
            <div className="block-body">
              <p className="body">
                A claim is an entity, a predicate, a polarity, a validity interval, its witness signatures, and the
                organizational branches it crossed.
              </p>
              <div className="formula">c = (e, p, y, [t₀, t₁], S, B)</div>
              <p className="body">
                Independent support is the largest set of witnesses whose source roots do not overlap. Adding copies of
                an existing witness cannot raise it. That is a bookkeeping guarantee under correct lineage, not a claim
                that provenance establishes truth.
              </p>
              <div className="formula">
                <span className="seg">n⊥(c) = max |U| over U ⊆ W(c),</span>{" "}
                <span className="seg">such that R(u) ∩ R(v) = ∅ for all u ≠ v</span>
              </div>
              <p className="body">
                Requests are ranked by estimated gain per cost. A class-weighted ranker scores candidate chains on 45
                kernel-side features, including source support, lineage dispersion, lag, and evidence shape. No raw text
                is used.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <span className="label">
              <span className="idx">Implementation</span>
            </span>
            <h2 className="h2">What exists today.</h2>
          </div>

          <div className="block" style={{ marginTop: "clamp(48px, 6vw, 88px)" }}>
            <div className="block-head">
              <p className="label">Runtime</p>
              <h3 className="h3">Mycelic</h3>
              <p className="body">The service that holds claims and their lineage. No model sits in the data path.</p>
            </div>
            <div className="block-body">
              <dl className="spec">
                <div>
                  <dt>Lineage</dt>
                  <dd>
                    A lineage graph that redacts what a caller may not read. Retracting an observation withdraws every
                    claim that depends on it.
                  </dd>
                </div>
                <div>
                  <dt>Aggregation</dt>
                  <dd>Hierarchical roll-up from agent to team to enterprise.</dd>
                </div>
                <div>
                  <dt>Event log</dt>
                  <dd>NATS JetStream with a transactional outbox, over a SQLite store.</dd>
                </div>
                <div>
                  <dt>Interfaces</dt>
                  <dd>HTTP API with scoped auth, a Python SDK, and an MCP endpoint.</dd>
                </div>
                <div>
                  <dt>Deployment</dt>
                  <dd>Docker and Kubernetes manifests.</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="block">
            <div className="block-head">
              <p className="label">Local memory</p>
              <h3 className="h3">NeuralGraph</h3>
              <p className="body">
                Long-horizon memory for each participant, running locally: an MCP server over SQLite with an extraction
                worker driven by a local model. Retrieval fuses vector, keyword (BM25), and entity-graph channels by
                rank.
              </p>
            </div>
            <div className="block-body">
              <dl className="spec">
                <div>
                  <dt>Tesseract (research)</dt>
                  <dd>
                    The retriever used in the LoCoMo campaign: four specialized views of memory (temporal, entity,
                    reasoning, adversarial), fused according to the kind of question asked.
                  </dd>
                </div>
                <div>
                  <dt>Pair routing (research)</dt>
                  <dd>
                    In the benchmark harness, a query goes to the memory of the participant who said it, then back-fills
                    from the other side of the conversation. Per-participant routing alone moved recall@10 from 39.4 to
                    46.8 on LoCoMo’s 282 multi-hop questions.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="block">
            <div className="block-head">
              <p className="label">Status</p>
            </div>
            <div className="block-body">
              <p className="body body-ink">
                The runtime and local memory are implemented. The acquisition loop is evaluated in simulation, with
                10,000 and 50,000 simulated agents. Validation with live models on real records is the next milestone.
              </p>
              <div className="btn-row" style={{ marginTop: "var(--s-6)" }}>
                <Link className="btn btn-solid" href="/research">
                  Research results{" "}
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
                <a
                  className="btn btn-line"
                  href="https://github.com/anovruzov/NeuralGraph"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source on GitHub{" "}
                  <span className="arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
