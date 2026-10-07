"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Mark from "./Mark";
import { mailto } from "@/content/site";

const LINKS = [
  { href: "/technology", label: "Technology" },
  { href: "/research", label: "Research" },
  { href: "/company", label: "Company" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="wrap header-inner">
        <Link href="/" className="wordmark" aria-label="Mycelic, home">
          <Mark />
          Mycelic
        </Link>
        <nav className="nav" aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname?.startsWith(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
          <a className="nav-cta" href={mailto}>
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
