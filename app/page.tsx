import Link from "next/link";
import HeroArt from "@/components/HeroArt";
import HowFigure from "@/components/HowFigure";
import Reveal from "@/components/Reveal";
import MetricView, { keepSeparators } from "@/components/MetricView";
import { memory, lineage, emergence } from "@/content/research";
import { mailto } from "@/content/site";

const PROBLEMS = [
  {
    t: "Fragments stay where they are observed.",
    b: "A ticket in support, a deploy in engineering, a reading from a sensor. Each record is accurate. None of them explains the pattern alone.",
  },
  {
    t: "Summaries lose the combinations.",
    b: "Reports that move up an organization keep what mattered locally and drop what mattered together. The link between three ordinary events is the first thing to go.",
  },
  {
    t: "Centralizing everything has a price.",
    b: "Pooling every raw record costs privacy, ownership, and compute, and retrieval alone is not discovery. In our 50,000-agent simulation, perfect retrieval coverage found only 42.4% of hidden patterns. A central long-context system found the most, 78.4%, at 2.6× Mycelic’s modeled compute.",
    note: "50,000 simulated agents · vNext research report",
  },
];

const APPS = [
  {
    t: "Incident causes that span teams",
    b: "Support sees sync failures in one region. Engineering shipped a dependency upgrade to one cluster. Telemetry shows latency drifting at peak. Mycelic links them into one cause, checks the timing against the deploy log, and sends the finding, with its evidence, to the service owner and the support queue.",
    in: "Tickets · deploys · telemetry",
    out: "A verified cause, routed to its owners",
  },
  {
    t: "Equipment failure across sites",
    b: "One plant records a component change. Another logs a delayed temperature anomaly. A third reports a shutdown. Mycelic recognizes the chain across sites without pooling plant data, and asks the site holding the missing reading to confirm it.",
    in: "Maintenance logs · sensors · incident reports",
    out: "A failure pattern, confirmed at its source",
  },
  {
    t: "Shared knowledge for agent fleets",
    b: "When hundreds of agents each work one slice of the business, what one learns rarely reaches the others. Mycelic turns an agent’s verified finding into shared knowledge with lineage, so others can rely on it, and drop it cleanly if its source is retracted.",
    in: "Agent observations · tool results",
    out: "Shared findings with retractable lineage",
  },
];

export default function Home() {
  return (
    <>
      {/* 1 — hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <h1 id="hero-title" className="display">
              See what others miss.
            </h1>
            <p className="lede">
              Mycelic connects what teams, systems, and agents learn into shared enterprise intelligence. Raw data stays
              private and local.
            </p>
            <div className="btn-row">
              <Link className="btn btn-solid" href="/technology">
                Explore the technology{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link className="btn btn-line" href="/research">
                Read the research{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
          <div className="hero-art">
            <HeroArt />
          </div>
        </div>
      </section>

      {/* 2 — the problem */}
      <section className="section">
        <div className="wrap">
          <Reveal className="reveal sec-head">
            <span className="label">
              <span className="idx">01</span> The problem
            </span>
            <h2 className="h2">An organization can know something that no one inside it knows.</h2>
          </Reveal>
          <Reveal as="ol" className="reveal points">
            {PROBLEMS.map((p) => (
              <li key={p.t}>
                <h3 className="h3">{p.t}</h3>
                <p className="body">{p.b}</p>
                {p.note && (
                  <p className="note">
                    <a
                      href={emergence.sources[0].href}
                      target="_blank"
                      rel="noreferrer"
                      style={{ borderBottom: "1px solid var(--line)" }}
                    >
                      {p.note}&nbsp;↗
                    </a>
                  </p>
                )}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 3 — how it works */}
      <section className="section">
        <div className="wrap">
          <Reveal className="reveal sec-head">
            <span className="label">
              <span className="idx">02</span> How it works
            </span>
            <h2 className="h2">Reason locally. Share findings, not records. Keep asking.</h2>
          </Reveal>
          <HowFigure />
          <div style={{ marginTop: "var(--s-7)" }}>
            <Link className="link" href="/technology">
              The full architecture <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 — applications */}
      <section className="section">
        <div className="wrap">
          <Reveal className="reveal sec-head">
            <span className="label">
              <span className="idx">03</span> Applications
            </span>
            <h2 className="h2">Where the answer is split across the organization.</h2>
            <p className="body">
              Three illustrative scenarios. In each, the answer is a pattern no single team could confirm alone.
            </p>
          </Reveal>
          <ol className="apps">
            {APPS.map((a, i) => (
              <Reveal as="li" className="reveal app" key={a.t}>
                <span className="app-idx label">
                  <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <h3 className="app-title h3">{a.t}</h3>
                <p className="app-body body">{a.b}</p>
                <dl className="app-io">
                  <dt>Signals</dt>
                  <dd>{a.in}</dd>
                  <dt>Result</dt>
                  <dd>{a.out}</dd>
                </dl>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 — research evidence (dark) */}
      <section className="section night">
        <div className="wrap">
          <Reveal className="reveal sec-head">
            <span className="label">
              <span className="idx">04</span> Research
            </span>
            <h2 className="h2">Tested in the open, with the scope attached.</h2>
            <p className="body">
              Three connected investigations into how an organization can learn as a system. Every figure below links to
              the artifact it came from.
            </p>
          </Reveal>
          <Reveal className="reveal evidence">
            <article className="ev">
              <div className="ev-track label">
                <span>
                  <span className="idx">Memory</span>
                </span>
                <span>Track 01</span>
              </div>
              <p className="ev-q">How does knowledge survive long interactions?</p>
              <MetricView m={memory.headline} />
              <p className="note">
                {memory.gain}
                <br />
                <a
                  className="src"
                  href={memory.sources[0].href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Memory result source (opens in a new tab)"
                >
                  Source ↗
                </a>
              </p>
            </article>
            <article className="ev">
              <div className="ev-track label">
                <span>
                  <span className="idx">Lineage</span>
                </span>
                <span>Track 02</span>
              </div>
              <p className="ev-q">Does knowing where a claim came from keep it trustworthy?</p>
              <MetricView m={lineage.headline} />
              <p className="note">
                {lineage.ci}. 10,000 simulated agents.
                <br />
                <a
                  className="src"
                  href={lineage.sources[0].href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Lineage result source (opens in a new tab)"
                >
                  Source ↗
                </a>
              </p>
            </article>
            <article className="ev">
              <div className="ev-track label">
                <span>
                  <span className="idx">Emergence</span>
                </span>
                <span>Track 03</span>
              </div>
              <p className="ev-q">Can partial views add up to a discovery none of them holds?</p>
              <MetricView m={emergence.headline} />
              <p className="note">
                {keepSeparators(emergence.ci)}.
                <br />
                <a
                  className="src"
                  href={emergence.sources[0].href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Emergence result source (opens in a new tab)"
                >
                  Source ↗
                </a>
              </p>
            </article>
          </Reveal>
          <div style={{ marginTop: "var(--s-8)" }}>
            <Link className="btn btn-solid" href="/research">
              Read the research{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* contact */}
      <section className="section">
        <div className="wrap contact">
          <Reveal className="reveal contact-title">
            <h2 className="h2">Have signals spread across teams, systems, or agents?</h2>
          </Reveal>
          <div className="contact-side">
            <p className="body">Tell us what you are trying to see, and where the pieces live today.</p>
            <a className="btn btn-solid" href={mailto}>
              Write to us{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
