import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Mycelic — See what others miss",
    template: "%s — Mycelic",
  },
  description:
    "Mycelic connects what teams, systems, and agents learn into shared enterprise intelligence. Raw data stays private and local.",
  openGraph: {
    title: "Mycelic — See what others miss",
    description:
      "Mycelic connects what teams, systems, and agents learn into shared enterprise intelligence. Raw data stays private and local.",
    url: SITE.url,
    siteName: "Mycelic",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Reveal effects start hidden only when scripts run, so content never depends on JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="sr-only">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
