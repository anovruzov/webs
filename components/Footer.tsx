import Link from "next/link";
import Mark from "./Mark";
import { SITE, mailto } from "@/content/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="f-brand">
          <Link href="/" className="wordmark" aria-label="Mycelic, home">
            <Mark />
            Mycelic
          </Link>
          <p className="body">Shared intelligence from local knowledge. Raw data stays where it lives.</p>
        </div>
        <nav className="f-nav" aria-label="Footer">
          <Link href="/technology">Technology</Link>
          <Link href="/research">Research</Link>
          <Link href="/company">Company</Link>
          <a href={SITE.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
        <div className="f-meta note">
          Mycelic Labs
          <br />
          <a href={mailto}>{SITE.email}</a>
          <br />© 2026
        </div>
      </div>
    </footer>
  );
}
