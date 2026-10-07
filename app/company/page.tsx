import type { Metadata } from "next";
import Link from "next/link";
import { SITE, mailto } from "@/content/site";

export const metadata: Metadata = {
  title: "Company",
  description: "Mycelic builds systems that let organizations learn collectively.",
};

export default function Company() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="label">
            <span className="idx">Company</span>
          </p>
          <h1 className="h1">We build systems that let organizations learn collectively.</h1>
        </div>
      </section>

      <section className="section" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="block" style={{ borderTop: 0, paddingTop: 0 }}>
            <div className="block-head">
              <p className="label">Why</p>
            </div>
            <div className="block-body">
              <p className="lede" style={{ color: "var(--ink)" }}>
                Companies are becoming networks of people, models, agents, software, and machines. No single model will
                understand everything happening inside them.
              </p>
              <p className="lede" style={{ marginTop: "var(--s-5)" }}>
                Mycelic is building the infrastructure that lets knowledge emerge across that system, be verified at its
                source, and return to the network so the organization can learn from it.
              </p>
            </div>
          </div>

          <div className="block">
            <div className="block-head">
              <p className="label">At a glance</p>
            </div>
            <div className="block-body">
              <dl className="spec">
                <div>
                  <dt>Name</dt>
                  <dd>Mycelic Labs</dd>
                </div>
                <div>
                  <dt>Focus</dt>
                  <dd>Continuous discovery across teams, systems, and agents</dd>
                </div>
                <div>
                  <dt>Principle</dt>
                  <dd>Raw data stays private and local. Findings travel with their evidence.</dd>
                </div>
                <div>
                  <dt>Research</dt>
                  <dd>
                    Memory, lineage, and emergence.{" "}
                    <Link href="/research" className="link" style={{ fontSize: "inherit" }}>
                      Read it
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt>Code</dt>
                  <dd>
                    <a
                      href={SITE.github}
                      target="_blank"
                      rel="noreferrer"
                      className="link"
                      style={{ fontSize: "inherit" }}
                    >
                      NeuralGraph ↗
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap contact">
          <div className="contact-title">
            <h2 className="h2">Talk to us.</h2>
          </div>
          <div className="contact-side">
            <p className="body">For research collaboration, early deployments, or questions about the work.</p>
            <a className="btn btn-solid" href={mailto}>
              {SITE.email} <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
