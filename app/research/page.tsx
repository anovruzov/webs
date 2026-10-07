import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import MetricView, { keepSeparators } from "@/components/MetricView";
import { memory, lineage, emergence, type Source } from "@/content/research";

const DESCRIPTION =
  "Three connected investigations into how an organization can learn as a system: memory, lineage, and emergence. Every figure is sourced and scoped.";

export const metadata: Metadata = {
  title: "Research",
  description: DESCRIPTION,
  alternates: { canonical: "/research" },
  openGraph: {
    title: "Research — Mycelic",
    description: DESCRIPTION,
    url: "/research",
    siteName: "Mycelic",
    type: "website",
  },
};

function Sources({ items }: { items: Source[] }) {
  return (
    <ul className="sources">
      <li className="label">Sources</li>
      {items.map((s) => (
        <li key={s.label}>
          {s.href ? (
            <a href={s.href} target="_blank" rel="noreferrer" title={s.path}>
              <span className="src-label">{s.label}&nbsp;↗</span>
              <span className="note src-path">{s.path}</span>
            </a>
          ) : (
            <>
              <span className="src-label">{s.label}</span>
              <span className="note src-path">{s.path}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function Bars() {
  return (
    <figure>
      <div className="legend" aria-hidden="true">
        <span>
          <i className="lg-before" /> Previous hierarchy
        </span>
        <span>
          <i className="lg-after" /> Current hierarchy
        </span>
      </div>
      <div className="bars">
        {emergence.bars10k.map((b) => (
          <div key={b.label} title={`${b.label}: ${b.before}% → ${b.after}%`}>
            <div className="bar-lbl">
              <span>{b.label}</span>
              <span className="nums">
                <span aria-hidden="true">
                  {b.before.toFixed(1)} → <b>{b.after.toFixed(1)}</b>
                </span>
                <span className="sr-only">
                  Previous hierarchy {b.before.toFixed(1)}%, current hierarchy {b.after.toFixed(1)}%
                </span>
              </span>
            </div>
            <div className="bar-pair" aria-hidden="true">
              <div className="bar before" style={{ width: `${b.before}%` }} />
              <div className="bar" style={{ width: `${b.after}%` }} />
            </div>
          </div>
        ))}
      </div>
      <figcaption className="note" style={{ marginTop: "var(--s-5)" }}>
        Fig. 03 — 10,000 simulated agents, held-out seeds 5–9, percent.
      </figcaption>
    </figure>
  );
}

type Anchor = { dx: number; dy: number; a: "start" | "end" };

const WIDE: Record<string, Anchor> = {
  "Mycelic hierarchy": { dx: 12, dy: 4, a: "start" },
  "Chunked central context": { dx: -12, dy: 18, a: "end" },
  "Oracle retrieval": { dx: 12, dy: 14, a: "start" },
  "Lean hierarchy": { dx: -12, dy: -8, a: "end" },
  "Central triage": { dx: 12, dy: 4, a: "start" },
};

const NARROW: Record<string, Anchor> = {
  "Mycelic hierarchy": { dx: 10, dy: -6, a: "start" },
  "Chunked central context": { dx: -10, dy: 18, a: "end" },
  "Oracle retrieval": { dx: 10, dy: 15, a: "start" },
  "Lean hierarchy": { dx: 10, dy: 15, a: "start" },
  "Central triage": { dx: 10, dy: 4, a: "start" },
};

function ScatterSvg({ W, anchors, className }: { W: number; anchors: Record<string, Anchor>; className: string }) {
  const H = 300;
  const pad = { l: 40, r: 16, t: 16, b: 40 };
  const x = (v: number) => pad.l + (v / 11) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - ((v - 20) / 70) * (H - pad.t - pad.b);
  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Found rate versus modeled compute at 50,000 simulated agents"
    >
      {[30, 50, 70].map((v) => (
        <g key={v}>
          <line className="sc-grid" x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} />
          <text className="sc-tick" x={pad.l - 8} y={y(v) + 4} textAnchor="end">
            {v}%
          </text>
        </g>
      ))}
      <line className="sc-axis" x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} />
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <text key={v} className="sc-tick" x={x(v)} y={H - pad.b + 20} textAnchor="middle">
          {v}M
        </text>
      ))}
      {emergence.scatter.map((p) => {
        const a = anchors[p.name];
        return (
          <g key={p.name}>
            <title>{`${p.name}: ${p.y}% found at ${p.x}M modeled units`}</title>
            <circle className={`sc-pt${p.hl ? " hl" : ""}`} cx={x(p.x)} cy={y(p.y)} r={5} />
            <text className={`sc-lbl${p.hl ? " hl" : ""}`} x={x(p.x) + a.dx} y={y(p.y) + a.dy} textAnchor={a.a}>
              {p.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Scatter() {
  return (
    <figure className="scatter">
      <ScatterSvg W={560} anchors={WIDE} className="sc-wide" />
      <ScatterSvg W={350} anchors={NARROW} className="sc-narrow" />
      <figcaption className="note" style={{ marginTop: "var(--s-3)" }}>
        Fig. 04 — Found rate against modeled compute, 50,000 simulated agents.
      </figcaption>
    </figure>
  );
}

export default function Research() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="label">
            <span className="idx">Research</span>
          </p>
          <h1 className="h1">How can an organization learn as a system?</h1>
          <p className="lede">
            Three investigations into one problem. Memory is the first primitive. Lineage lets knowledge move without
            losing its meaning. Emergence is where the work is headed.
          </p>
        </div>
      </section>

      <div className="wrap" style={{ paddingBottom: "clamp(64px, 8vw, 112px)" }}>
        <nav className="tracks-nav" aria-label="Research tracks">
          <a href="#memory">
            <span className="label">
              <span className="idx">01</span>
            </span>
            <p className="h3">Memory</p>
            <p className="body">How does knowledge survive?</p>
          </a>
          <a href="#lineage">
            <span className="label">
              <span className="idx">02</span>
            </span>
            <p className="h3">Lineage</p>
            <p className="body">How does it stay trustworthy as it moves?</p>
          </a>
          <a href="#emergence">
            <span className="label">
              <span className="idx">03</span>
            </span>
            <p className="h3">Emergence</p>
            <p className="body">How does new knowledge appear?</p>
          </a>
        </nav>
      </div>

      {/* 01 MEMORY */}
      <section className="track" id="memory">
        <div className="wrap">
          <div className="track-head">
            <div className="name">
              <p className="label">
                <span className="idx">01</span> NeuralGraph · long-horizon memory
              </p>
              <h2 className="h1">Memory</h2>
            </div>
            <div className="question">
              <p className="label">Question</p>
              <p className="q">{memory.question}</p>
            </div>
          </div>

          <Reveal className="reveal track-body">
            <div className="main">
              <p className="label">Finding</p>
              <p className="finding" style={{ marginTop: "var(--s-3)" }}>
                Routing memory to the participant it belongs to, and keeping both sides of a conversation linked, did
                more for long-horizon recall than retrieving harder from one flat store.
              </p>
              <p className="body" style={{ marginTop: "var(--s-5)" }}>
                Tested on LoCoMo, a benchmark of very long multi-session conversations. The comparison changes only
                retrieval: same questions, same answering model, same judge.
              </p>
            </div>
            <div className="side">
              <MetricView m={memory.headline} />
            </div>
          </Reveal>

          <div className="metrics" style={{ marginTop: "clamp(48px, 6vw, 80px)" }}>
            <MetricView m={memory.from} small />
            <MetricView m={memory.recall} small />
            <MetricView m={memory.strict} small />
            <MetricView m={memory.fast} small />
          </div>

          <div className="track-body">
            <div className="main">
              <h3 className="label" style={{ marginBottom: "var(--s-5)" }}>
                Benchmark configuration · 744-question evaluation
              </h3>
              <div className="metrics">
                {memory.slice.map((m) => (
                  <MetricView key={m.label} m={m} small />
                ))}
              </div>
            </div>
            <div className="side">
              <h3 className="label" style={{ marginBottom: "var(--s-3)" }}>
                Scope
              </h3>
              <ul className="limits">
                <li>
                  Answering, reranking, and judging use a small local model (gemma-4-e4b) with a lenient judge prompt. A
                  strict judge scores the same 282 answers at 31.2%. The gain over flat retrieval holds under every
                  judge tested.
                </li>
                <li>
                  The 744-question slice covers conversations 1–5. A broader reranked run over 1,112 questions scores
                  68.6%.
                </li>
                <li>
                  The 0.44&nbsp;s fast path drops the LLM reranker and costs about 6.5 points against the reranked
                  stack.
                </li>
                <li>
                  The benchmark harness labels LoCoMo categories 1 and 4 the other way round. This page uses the
                  dataset’s own names.
                </li>
              </ul>
              <Sources items={memory.sources} />
            </div>
          </div>
        </div>
      </section>

      {/* 02 LINEAGE */}
      <section className="track" id="lineage">
        <div className="wrap">
          <div className="track-head">
            <div className="name">
              <p className="label">
                <span className="idx">02</span> Distribution under attack
              </p>
              <h2 className="h1">Lineage</h2>
            </div>
            <div className="question">
              <p className="label">Question</p>
              <p className="q">{lineage.question}</p>
            </div>
          </div>

          <Reveal className="reveal track-body">
            <div className="main">
              <p className="label">Finding</p>
              <p className="finding" style={{ marginTop: "var(--s-3)" }}>
                Lineage-aware placement keeps more independent support alive. Asking questions raises accuracy far more,
                and that gain does not depend on lineage-aware placement.
              </p>
              <p className="body" style={{ marginTop: "var(--s-5)" }}>
                Two separate effects, measured separately. Placement protects how many independent witnesses survive an
                attack. Questioning recovers correctness, at roughly twice the messages per claim.
              </p>
              <div className="table-scroll" style={{ marginTop: "var(--s-7)" }}>
                <table className="dtable">
                  <thead>
                    <tr>
                      <th scope="col">System</th>
                      <th scope="col">Accuracy</th>
                      <th scope="col">Indep. support</th>
                      <th scope="col">Msgs / claim</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineage.rows.map((r) => (
                      <tr key={r.id} className={r.hl ? "hl" : undefined}>
                        <td>
                          {r.name}
                          <span className="tag">{r.id}</span>
                        </td>
                        <td>{r.acc}</td>
                        <td>{r.iss}</td>
                        <td>{r.msgs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="note" style={{ marginTop: "var(--s-3)" }}>
                {keepSeparators(lineage.setup)}
              </p>
            </div>
            <div className="side">
              <MetricView m={lineage.headline} />
              <p className="note" style={{ marginTop: "var(--s-2)" }}>
                {lineage.ci}
              </p>
              <div style={{ marginTop: "var(--s-7)" }}>
                <MetricView m={lineage.questioning} small />
              </div>
              <ul className="limits" style={{ marginTop: "var(--s-7)" }}>
                <li>Pure simulation over symbolic claims. No language models in the loop.</li>
                <li>Placement alone moves accuracy by only +.010. Raw knowledge survival is unchanged.</li>
                <li>Questioning on random placement scores higher accuracy (.628) with less independent support.</li>
                <li>
                  A re-check returns the true value by construction, so the questioning gain shows what re-verifying a
                  source is worth, not how hard it is to ask well.
                </li>
              </ul>
              <Sources items={lineage.sources} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 EMERGENCE — dark */}
      <section className="track night" id="emergence">
        <div className="wrap">
          <div className="track-head">
            <div className="name">
              <p className="label">
                <span className="idx">03</span> Collective discovery · 10,000–50,000 simulated agents
              </p>
              <h2 className="h1">Emergence</h2>
            </div>
            <div className="question">
              <p className="label">Question</p>
              <p className="q">{emergence.question}</p>
            </div>
          </div>

          <Reveal className="reveal track-body">
            <div className="main">
              <p className="label">Setup</p>
              <p className="body" style={{ marginTop: "var(--s-3)" }}>
                Synthetic enterprise worlds hide patterns in fragments spread across users, sites, regions, and time,
                with adversarial decoys and a bounded output register. Raw text never moves up. The kernel finds gaps in
                its hypotheses, sends targeted questions down the hierarchy, merges the answers, and repeats.
              </p>
              <p className="label" style={{ marginTop: "var(--s-7)" }}>
                Finding
              </p>
              <p className="finding" style={{ marginTop: "var(--s-3)" }}>
                A combined update (wider targeted questioning, witness-based link timing, and a learned ranker)
                recovered more of the patterns that hierarchical summaries drop. The study cannot attribute the gain to
                any one of the three.
              </p>
            </div>
            <div className="side">
              <MetricView m={emergence.headline} />
              <p className="note" style={{ marginTop: "var(--s-3)" }}>
                {keepSeparators(emergence.ci)}
              </p>
            </div>
          </Reveal>

          <div className="track-body">
            <div className="main">
              <Bars />
            </div>
            <div className="side">
              <MetricView m={emergence.scale} small />
              <div style={{ marginTop: "var(--s-7)" }}>
                <MetricView m={emergence.oracle} small />
              </div>
              <p className="body" style={{ marginTop: "var(--s-4)", fontSize: 15.5 }}>
                Perfect retrieval is not discovery. Reconstructing, timing, and ranking the evidence is the hard part.
              </p>
            </div>
          </div>

          <div className="track-body">
            <div className="main">
              <h3 className="label" style={{ marginBottom: "var(--s-5)" }}>
                50,000 simulated agents · five architectures · same worlds
              </h3>
              <div className="table-scroll">
                <table className="dtable">
                  <thead>
                    <tr>
                      <th scope="col">Architecture</th>
                      <th scope="col">Found</th>
                      <th scope="col">Coverage</th>
                      <th scope="col">Rare</th>
                      <th scope="col">Compute</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emergence.table50k.map((r) => (
                      <tr key={r.name} className={r.hl ? "hl" : undefined}>
                        <td>{r.name}</td>
                        <td>{r.found}</td>
                        <td>{r.cov}</td>
                        <td>{r.rare}</td>
                        <td>{r.compute}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: "var(--s-8)" }}>
                <Scatter />
              </div>
            </div>
            <div className="side">
              <h3 className="label" style={{ marginBottom: "var(--s-5)" }}>
                Open problems
              </h3>
              <MetricView m={emergence.decoy} small />
              <ul className="limits" style={{ marginTop: "var(--s-6)" }}>
                <li>
                  Centralized long context still finds more: 78.4% against 56.6% at 50K, at 2.6× the modeled compute.
                </li>
                <li>
                  The kernel’s global read exceeds the modeled <span className="nw">1M-token</span> tier. A production
                  claim needs it chunked.
                </li>
                <li>Simulator study. Compute is modeled, not measured. Live-model validation is next.</li>
                <li>
                  The 50K suite reuses development seeds. The 10K <span className="nw">held-out</span> panel is the
                  clean result.
                </li>
              </ul>
              <Sources items={emergence.sources} />
            </div>
          </div>

          <div
            style={{
              marginTop: "clamp(64px, 8vw, 112px)",
              borderTop: "1px solid var(--line)",
              paddingTop: "var(--s-5)",
            }}
          >
            <p className="label">Paper</p>
            <p className="h3" style={{ marginTop: "var(--s-3)", maxWidth: "28em" }}>
              Targeted Evidence Acquisition for Discovery in Hierarchical Agent Memory
            </p>
            <p className="note" style={{ marginTop: "var(--s-2)" }}>
              Mycelic Labs · preprint · 2026
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
