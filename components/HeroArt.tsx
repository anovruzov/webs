import { renderSVG } from "@/lib/mycelium.mjs";

/*
 * Fig. 01 — three local colonies whose explorer hyphae close into one shared ring.
 * Generated once at build time from a seeded growth model; the reveal is CSS-only
 * and is skipped entirely under prefers-reduced-motion.
 */
const SEED = 11;
const desktop = renderSVG({ w: 640, h: 720, seed: SEED, className: "mf" });
const mobile = renderSVG({ w: 350, h: 438, seed: SEED, fontSize: 12, className: "mfm" });

export default function HeroArt() {
  return (
    <>
      <div className="art-desktop" dangerouslySetInnerHTML={{ __html: desktop }} />
      <div className="art-mobile" dangerouslySetInnerHTML={{ __html: mobile }} />
    </>
  );
}
