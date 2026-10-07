// Mycelic hero artwork, final (refined "field").
//
// Three colonies with distinct growth habits hold their own local structure:
//   A  a feathered radial disc
//   B  a plume combed along the field, rising from a small radial origin; its distal
//      hyphae aggregate into a short twisted cord (rhizomorph) before parting again
//   C  an anastomosing net whose curved hyphae home on each other and fuse into cells
// Only a few explorer hyphae leave each colony, from its margin. They meet a shared
// contour tangentially, settle into perfectly regular lanes and run around it; where
// two colonies' contributions overlap the band grows denser. Every strand ends by
// fusing onto a neighbouring lane, so the ring closes without loose ends.
//
// Pure ES module, no dependencies, deterministic (seeded mulberry32).
//
// generate({ w, h, seed }) -> { viewBox, w, h, duration, fontSize,
//   paths: [{ d, w, o, group, order, dur, len, kind, tone?, dash? }],
//   texts: [{ x, y, t, anchor, order }] }
//   group: 'local-a' | 'local-b' | 'local-c' | 'bridge' | 'emergent' | 'annotation'
//   order: start time as a fraction (0..1) of `duration` seconds; dur: draw time, same units
//   kind:  'draw' (pathLength=1 dash reveal) | 'fade' (opacity) ; tone: 'muted' | 'datum'
// renderSVG(opts) -> SVG string with a CSS-only reveal (reduced motion shows the final state).

const TAU = Math.PI * 2;
const DW = 640;
const DH = 720;

export function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const mod = (v, m) => ((v % m) + m) % m;
function angDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= TAU;
  while (d < -Math.PI) d += TAU;
  return d;
}

// ---------------------------------------------------------------- the shared contour
// A slightly elliptical closed contour. Its major axis passes through A's landing, so the
// radius drawn there is exactly normal to the strands (the right-angle mark is true).
export function makeRing(o = {}) {
  const ring = { cx: 322, cy: 398, R0: 117, e: 0.045, phi: -0.9, ...o };
  const R = (th) => ring.R0 * (1 + ring.e * Math.cos(2 * (th - ring.phi)));
  const dR = (th) => -2 * ring.R0 * ring.e * Math.sin(2 * (th - ring.phi));
  const pt = (th, d = 0) => {
    const r = R(th) + d;
    return [ring.cx + r * Math.cos(th), ring.cy + r * Math.sin(th)];
  };
  const tan = (th) => {
    const r = R(th);
    const dr = dR(th);
    const tx = dr * Math.cos(th) - r * Math.sin(th);
    const ty = dr * Math.sin(th) + r * Math.cos(th);
    const l = Math.hypot(tx, ty);
    return [tx / l, ty / l];
  };
  const polar = (x, y) => {
    const dx = x - ring.cx;
    const dy = y - ring.cy;
    const th = Math.atan2(dy, dx);
    const r = Math.hypot(dx, dy);
    return { th, r, e: R(th) - r };
  };
  // the underlying field the colonies feel: tangent of the contour family (clockwise)
  const flow = (x, y) => {
    const p = polar(x, y);
    const [tx, ty] = tan(p.th);
    return Math.atan2(ty, tx);
  };
  return { ...ring, R, pt, tan, polar, flow };
}

// ---------------------------------------------------------------- spatial grid
export class Grid {
  constructor(cell) {
    this.c = cell;
    this.m = new Map();
  }
  add(x, y, id) {
    const k = ((x / this.c) | 0) + ',' + ((y / this.c) | 0);
    let b = this.m.get(k);
    if (!b) this.m.set(k, (b = []));
    b.push(x, y, id);
  }
  near(x, y, r, a, b) {
    const ci = (x / this.c) | 0;
    const cj = (y / this.c) | 0;
    const n = Math.ceil(r / this.c);
    let best = null;
    let bd = r * r;
    for (let i = ci - n; i <= ci + n; i++) {
      for (let j = cj - n; j <= cj + n; j++) {
        const bk = this.m.get(i + ',' + j);
        if (!bk) continue;
        for (let q = 0; q < bk.length; q += 3) {
          const id = bk[q + 2];
          if (id === a || id === b) continue;
          const dx = bk[q] - x;
          const dy = bk[q + 1] - y;
          const d = dx * dx + dy * dy;
          if (d < bd) {
            bd = d;
            best = [bk[q], bk[q + 1], id];
          }
        }
      }
    }
    return best;
  }
}

// ---------------------------------------------------------------- colonies
// n / slots: explorer strands that leave the colony and the lanes they take in the band.
// ov: how far past the next colony's landing a colony's strands keep running (radians).
export const COLONIES = [
  // A: radial, fine, evenly fanned disc
  {
    id: 'a', label: 'A', cx: 142, cy: 146, R: 94, shape: 'disc', n0: 11, step: 2.4, pB: 0.13,
    beta: 0.72, betaJ: 0.16, minD: 4.4, fw: 0.08, pull: 0.06, jit: 0.04, maxGen: 6, maxHy: 140,
    anast: 0.1, start: 0, w0: 0.78, o0: 0.84, void: 7, avoid: 0.18,
    n: 3, lead: 0.1, stagger: 0.07, ov: 0.62, sep: 18,
  },
  // B: a plume combed along the flow from a small radial origin; acute branching. Its distal
  // hyphae gather into a cord that twists for a short run (tw0..tw1 of its length)
  {
    id: 'b', label: 'B', cx: 406, cy: 166, R: 190, inward: 0.3, shape: 'plume', n0: 7, step: 2.8, pB: 0.1,
    beta: 0.3, betaJ: 0.08, minD: 3.6, fw: 0.92, pull: 0.2, jit: 0.02, maxGen: 5, maxHy: 110,
    anast: 0.04, start: 3, w0: 0.78, o0: 0.82, void: 4.5, avoid: 0.08, stubs: 8,
    n: 5, lead: 0.04, cable: true, ov: 0.9, k1: 0.45, k2: 0.5, twist: 3.3, tw0: 0.06, tw1: 0.5, period: 24, land0: -0.05, land1: 0.2,
  },
  // C: open reticulum; wide branching, curved hyphae, every meeting fuses into closed cells
  {
    id: 'c', label: 'C', cx: 168, cy: 600, R: 92, shape: 'disc', n0: 5, step: 2.8, pB: 0.25,
    beta: 1.15, betaJ: 0.3, minD: 5.5, fw: 0.15, pull: 0.03, jit: 0.08, curl: 0.03, smooth: 2, rseed: 5,
    maxGen: 9, maxHy: 160, anast: 1, fuseA: 1.6, start: 6, w0: 0.66, wDecay: 0.9, o0: 0.84, void: 9, hJ: 1.2,
    avoid: 0.03, n: 4, lead: 0.12, stagger: 0.06, ov: 0.72, sep: 11, sector: 0.8,
  },
];

function colonyInside(c, x, y, ring, bnd) {
  if (c.shape === 'disc') {
    const dx = x - c.cx;
    const dy = y - c.cy;
    const a = Math.atan2(dy, dx);
    const R = c.R * (1 + 0.07 * Math.sin(3 * a + bnd[0]) + 0.05 * Math.sin(5 * a + bnd[1]));
    return Math.hypot(dx, dy) < R;
  }
  // plume: measured along the contour family (arc coordinate) and across it
  const p0 = ring.polar(c.cx, c.cy);
  const p = ring.polar(x, y);
  const along = angDiff(p.th, p0.th) * p0.r;
  const across = p.r - (p0.r - Math.max(0, along) * Math.tan(c.inward ?? 0));
  if (along < -6 || along > c.R) return false;
  const u = along / c.R;
  const half = 6 + 44 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.9 + 0.05)), 0.85) * (0.9 + 0.1 * Math.sin(along * 0.05 + bnd[0]));
  return Math.abs(across) < half;
}

export function growColonies(rng, ring, grid, cols = COLONIES) {
  const hyphae = [];
  let nextId = 1;
  const tips = [];
  for (const c of cols) {
    c.rng = mulberry32(((rng() * 4294967296) >>> 0) ^ (c.rseed ?? 0));
    c.bnd = [c.rng() * TAU, c.rng() * TAU];
    c.hy = [];
    const base = c.shape === 'plume' ? ring.flow(c.cx, c.cy) : c.rng() * TAU;
    c.base = base;
    for (let i = 0; i < c.n0; i++) {
      let h;
      if (c.shape === 'plume') h = base + (i / (c.n0 - 1) - 0.5) * 1.15 + (c.rng() - 0.5) * 0.12;
      else h = base + (i / c.n0) * TAU + (c.rng() - 0.5) * (c.hJ ?? 0.35);
      const rr = c.void + c.rng() * (c.shape === 'plume' ? 2 : 4);
      const x0 = c.cx + Math.cos(h) * rr;
      const y0 = c.cy + Math.sin(h) * rr;
      const hy = { id: nextId++, col: c, gen: 0, pts: [[x0, y0]], born: c.start, end: c.start, parent: 0, stop: null };
      hyphae.push(hy);
      c.hy.push(hy);
      const curl = c.curl ? (c.rng() - 0.5) * 2 * c.curl : 0;
      tips.push({ hy, x: x0, y: y0, h, om: 0, age: 0, side: c.rng() < 0.5 ? 1 : -1, sinceB: 0, curl });
    }
  }
  let iter = 0;
  let active = tips;
  while (active.length && iter < 500) {
    iter++;
    const next = [];
    for (const t of active) {
      const c = t.hy.col;
      const rnd = c.rng;
      if (iter < c.start) {
        next.push(t);
        continue;
      }
      // heading: radial from the inoculum blended with the underlying flow
      const ra = Math.atan2(t.y - c.cy, t.x - c.cx);
      const fa = ring.flow(t.x, t.y) + (c.inward ?? 0);
      const vx = (1 - c.fw) * Math.cos(t.age < 2 ? t.h : ra) + c.fw * Math.cos(fa);
      const vy = (1 - c.fw) * Math.sin(t.age < 2 ? t.h : ra) + c.fw * Math.sin(fa);
      const desired = Math.atan2(vy, vx);
      t.om += (rnd() - 0.5) * c.jit;
      t.om *= c.omDecay ?? 0.82;
      t.h += t.om + t.curl + c.pull * angDiff(desired, t.h) * (t.hy.gen === 0 ? 1 : 0.6);
      // tropism: most colonies turn away from neighbours ahead; C's tips home on them to fuse
      if (Math.hypot(t.x - c.cx, t.y - c.cy) > c.minD * 2.2) {
        const lx = t.x + Math.cos(t.h) * c.minD;
        const ly = t.y + Math.sin(t.h) * c.minD;
        const nb = grid.near(lx, ly, c.minD * (c.home ? 2.4 : 1.7), t.hy.id, t.age < 7 ? t.hy.parent : -1);
        if (nb) {
          const na = Math.atan2(nb[1] - t.y, nb[0] - t.x);
          const da = angDiff(na, t.h);
          if (c.home && t.age > 4 && Math.abs(da) < 1.1) t.h += c.home * da;
          else t.h += (da > 0 ? -1 : 1) * (c.avoid ?? 0.22);
        }
      }
      const nx = t.x + Math.cos(t.h) * c.step;
      const ny = t.y + Math.sin(t.h) * c.step;
      t.age++;
      t.sinceB++;
      let stop = null;
      if (!colonyInside(c, nx, ny, ring, c.bnd)) stop = 'edge';
      else if (Math.abs(ring.polar(nx, ny).e) < 34) stop = 'ring';
      else if (nx < 10 || ny < 10 || nx > DW - 10 || ny > DH - 10) stop = 'frame';
      else {
        const rc = Math.hypot(nx - c.cx, ny - c.cy);
        const immune = rc < c.minD * 2.6 || (t.hy.gen === 0 && rc < (c.shape === 'plume' ? 0.6 : 0.45) * c.R);
        const hit = immune ? null : grid.near(nx, ny, c.minD, t.hy.id, t.age < 7 ? t.hy.parent : -1);
        if (hit) {
          stop = 'hit';
          const ha = Math.atan2(hit[1] - t.y, hit[0] - t.x);
          if (rnd() < c.anast && Math.abs(angDiff(ha, t.h)) < (c.fuseA ?? 0.9)) {
            t.hy.pts.push([hit[0], hit[1]]);
            t.hy.fused = true;
          }
        }
      }
      if (stop) {
        t.hy.stop = stop;
        t.hy.end = iter;
        t.hy.endH = t.h;
        continue;
      }
      grid.add(t.x, t.y, t.hy.id);
      t.x = nx;
      t.y = ny;
      t.hy.pts.push([nx, ny]);
      t.hy.end = iter;
      t.hy.endH = t.h;
      next.push(t);
      // lateral branching
      if (t.sinceB > 4 && t.hy.gen < c.maxGen && c.hy.length < c.maxHy && rnd() < c.pB) {
        t.sinceB = 0;
        t.side = -t.side;
        const bh = t.h + t.side * (c.beta + (rnd() - 0.5) * 2 * c.betaJ);
        const hy = { id: nextId++, col: c, gen: t.hy.gen + 1, pts: [[t.x, t.y]], born: iter, end: iter, parent: t.hy.id, stop: null };
        hyphae.push(hy);
        c.hy.push(hy);
        const curl = c.curl ? (rnd() - 0.5) * 2 * c.curl : 0;
        next.push({ hy, x: t.x, y: t.y, h: bh, om: 0, age: 0, side: t.side, sinceB: 0, curl });
      }
    }
    active = next;
  }
  // B's origin: short radial hyphae around the root, turned away from the plume, so the
  // plume reads as a colony growing from a point rather than a brush stroke
  for (const c of cols) {
    if (!c.stubs) continue;
    const rnd = c.rng;
    for (let k = 0; k < c.stubs; k++) {
      const u = k / (c.stubs - 1) - 0.5;
      let h = c.base + Math.PI + u * 3.4 + (rnd() - 0.5) * 0.25;
      const r0 = c.void + rnd() * 1.5;
      const pts = [[c.cx + Math.cos(h) * r0, c.cy + Math.sin(h) * r0]];
      const n = Math.round(1 + rnd() * 2.5 + (1 - Math.abs(u) * 2) * 1.5);
      const om = (rnd() - 0.5) * 0.3;
      for (let j = 0; j < n; j++) {
        h += om;
        const [x, y] = pts[pts.length - 1];
        pts.push([x + Math.cos(h) * 2.2, y + Math.sin(h) * 2.2]);
      }
      const born = c.start + 1 + k * 0.6;
      const hy = { id: nextId++, col: c, gen: 3, pts, born, end: born + n * 1.4, parent: 0, stop: 'stub', stub: true };
      hyphae.push(hy);
      c.hy.push(hy);
    }
  }
  return { hyphae, iters: iter };
}

// ---------------------------------------------------------------- explorers and the band
function tangentPoint(ring, mx, my) {
  let thT = 0;
  let best = -2;
  for (let q = 0; q < 1440; q++) {
    const th = (q / 1440) * TAU - Math.PI;
    const [px, py] = ring.pt(th, 0);
    const [tx, ty] = ring.tan(th);
    const dx = px - mx;
    const dy = py - my;
    const al = (dx * tx + dy * ty) / Math.hypot(dx, dy);
    if (al > best) {
      best = al;
      thT = th;
    }
  }
  return thT;
}

function bezier(P0, P1, P2, P3, n) {
  const pts = [];
  for (let k = 0; k <= n; k++) {
    const u = k / n;
    const v = 1 - u;
    pts.push([
      v * v * v * P0[0] + 3 * v * v * u * P1[0] + 3 * v * u * u * P2[0] + u * u * u * P3[0],
      v * v * v * P0[1] + 3 * v * v * u * P1[1] + 3 * v * u * u * P2[1] + u * u * u * P3[1],
    ]);
  }
  return pts;
}

// resample a polyline at a fixed arc-length step; returns points with tangent/normal/dist
function resample(pts, ds) {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = cum[cum.length - 1];
  const n = Math.max(2, Math.round(L / ds));
  const out = [];
  let j = 1;
  for (let k = 0; k <= n; k++) {
    const d = (k / n) * L;
    while (j < pts.length - 1 && cum[j] < d) j++;
    const a = pts[j - 1];
    const b = pts[j];
    const f = (d - cum[j - 1]) / (cum[j] - cum[j - 1] || 1);
    const tx = b[0] - a[0];
    const ty = b[1] - a[1];
    const tl = Math.hypot(tx, ty) || 1;
    out.push({ x: a[0] + tx * f, y: a[1] + ty * f, tx: tx / tl, ty: ty / tl, nx: -ty / tl, ny: tx / tl, d, s: d / L });
  }
  return { pts: out, L };
}

// Lanes in the band. Each colony's strands keep a fixed, regular spacing. A colony arrives
// on the outer tier (outside the strands already there), so arrivals never cross anything;
// once the previous colony's strands have faded out on the inner tier, the newcomer drifts
// inward and takes its place. The band is densest where two contributions overlap.
export const LANE = 1.35;
const GAP = 1.15 * LANE;
const DRIFT = [-0.5, 0.42]; // window of the inward drift around the predecessor's end
const FADE = 0.34; // angular length of each strand's fading tail
const dIn = (n, j) => (j - (n - 1) / 2) * LANE;

function curvatureCost(pts) {
  const r = resample(pts, 2).pts;
  let worst = 0;
  for (let i = 2; i < r.length; i++) {
    const a = Math.atan2(r[i].ty, r[i].tx);
    const b = Math.atan2(r[i - 2].ty, r[i - 2].tx);
    worst = Math.max(worst, Math.abs(angDiff(a, b)) / 4);
  }
  return worst;
}

function pickMargin(ring, c) {
  const thC = tangentPoint(ring, c.cx, c.cy);
  const [Lx, Ly] = ring.pt(thC, 0);
  const cands = [];
  for (const h of c.hy) {
    if (h.stub || h.gen > 3 || h.pts.length < 5 || h.stop === 'hit') continue;
    const [x, y] = h.pts[h.pts.length - 1];
    const rc = Math.hypot(x - c.cx, y - c.cy);
    if (rc < c.R * 0.72) continue;
    const rad = Math.atan2(y - c.cy, x - c.cx);
    const toL = Math.atan2(Ly - y, Lx - x);
    if (Math.cos(angDiff(toL, rad)) < 0.25) continue;
    if (c.sector && Math.abs(angDiff(rad, Math.atan2(Ly - c.cy, Lx - c.cx))) > c.sector) continue;
    const al = Math.cos(angDiff(toL, h.endH));
    if (al < -0.1) continue;
    cands.push({ h, x, y, hl: h.endH, score: Math.hypot(Lx - x, Ly - y) - al * 50 });
  }
  cands.sort((p, q) => p.score - q.score);
  const picks = [];
  for (const o of cands) {
    if (picks.length >= c.n) break;
    if (picks.every((q) => Math.hypot(q.x - o.x, q.y - o.y) > c.sep)) picks.push(o);
  }
  const mx = picks.reduce((v, o) => v + o.x, 0) / picks.length;
  const my = picks.reduce((v, o) => v + o.y, 0) / picks.length;
  const thT = tangentPoint(ring, mx, my);
  // earlier tangents land first and take the inner lanes, so a colony's strands never cross
  for (const o of picks) o.tth = angDiff(tangentPoint(ring, o.x, o.y), thT);
  picks.sort((p, q) => p.tth - q.tth);
  return { picks, th: thT + c.lead };
}

function pickCable(ring, c) {
  const p0 = ring.polar(c.cx, c.cy);
  const tips = [];
  for (const h of c.hy) {
    if (h.stub || h.pts.length < 10 || h.stop !== 'edge') continue;
    const [x, y] = h.pts[h.pts.length - 1];
    const p = ring.polar(x, y);
    tips.push({ h, x, y, hl: h.endH, along: angDiff(p.th, p0.th) * p0.r });
  }
  tips.sort((p, q) => q.along - p.along);
  const picks = [];
  for (const o of tips) {
    if (picks.length >= c.n) break;
    if (picks.every((q) => Math.hypot(q.x - o.x, q.y - o.y) > 3.2)) picks.push(o);
  }
  let tx0 = 0;
  let ty0 = 0;
  for (const o of picks) {
    tx0 += Math.cos(o.hl);
    ty0 += Math.sin(o.hl);
  }
  const tl = Math.hypot(tx0, ty0);
  tx0 /= tl;
  ty0 /= tl;
  const mx = picks.reduce((v, o) => v + o.x, 0) / picks.length;
  const my = picks.reduce((v, o) => v + o.y, 0) / picks.length;
  for (const o of picks) {
    o.a = (o.x - mx) * tx0 + (o.y - my) * ty0;
    o.o = (o.x - mx) * -ty0 + (o.y - my) * tx0;
  }
  const amax = Math.max(...picks.map((o) => o.a));
  const Q0 = [mx + tx0 * (amax + 3), my + ty0 * (amax + 3)];
  // land where the cord can turn into the contour with the gentlest curvature
  const thT = tangentPoint(ring, Q0[0], Q0[1]);
  let best = null;
  const k0 = Math.round((c.land0 ?? -0.16) / 0.02);
  const k1 = Math.round((c.land1 ?? 0.56) / 0.02);
  for (let k = k0; k <= k1; k++) {
    const th = thT + k * 0.02;
    const P3 = ring.pt(th, 0);
    const [tx, ty] = ring.tan(th);
    const D = Math.hypot(P3[0] - Q0[0], P3[1] - Q0[1]);
    const pts = bezier(Q0, [Q0[0] + tx0 * D * c.k1, Q0[1] + ty0 * D * c.k1], [P3[0] - tx * D * c.k2, P3[1] - ty * D * c.k2], P3, 80);
    const cost = curvatureCost(pts);
    if (!best || cost < best.cost) best = { cost, th };
  }
  picks.sort((p, q) => p.o - q.o);
  return { picks, th: best.th + c.lead, Q0, t0: [tx0, ty0] };
}

export function growBridges(rng, ring, colonies) {
  // pass 1: where each colony's explorers leave and where they meet the contour
  const plan = colonies.map((c) => ({ c, ...(c.cable ? pickCable(ring, c) : pickMargin(ring, c)) }));
  const order = plan.slice().sort((p, q) => mod(p.th, TAU) - mod(q.th, TAU));
  order.forEach((p, i) => {
    p.prev = order[(i + order.length - 1) % order.length];
    p.next = order[(i + 1) % order.length];
  });
  for (const p of plan) {
    const nW = p.prev.picks.length;
    const nX = p.picks.length;
    p.shift = ((nW - 1) / 2 + (nX - 1) / 2) * LANE + GAP;
  }
  // pass 2: the explorer paths
  const strands = [];
  for (const p of plan) {
    const c = p.c;
    const n = p.picks.length;
    if (c.cable) {
      strands.push(...cableStrands(rng, ring, c, p));
      continue;
    }
    p.picks.forEach((o, j) => {
      const thL = p.th + j * c.stagger;
      const d = dIn(n, j) + p.shift;
      const P3 = ring.pt(thL, d);
      const [tx, ty] = ring.tan(thL);
      const D = Math.hypot(P3[0] - o.x, P3[1] - o.y);
      const toP = Math.atan2(P3[1] - o.y, P3[0] - o.x);
      const h0 = o.hl + clamp(angDiff(toP, o.hl), -0.55, 0.55);
      const P1 = [o.x + Math.cos(h0) * D * 0.3, o.y + Math.sin(h0) * D * 0.3];
      const P2 = [P3[0] - tx * D * 0.44, P3[1] - ty * D * 0.44];
      const pts = bezier([o.x, o.y], P1, P2, P3, Math.max(10, Math.round(D / 3)));
      // a faint meander near the colony that dies away completely before the contour
      const mk = 1.2 + rng() * 1.2;
      const mp = rng() * TAU;
      const ma = 0.5 + rng() * 0.7;
      for (let k = 1; k < pts.length - 1; k++) {
        const u = k / (pts.length - 1);
        const [ax, ay] = pts[k - 1];
        const [bx, by] = pts[k + 1];
        const L = Math.hypot(bx - ax, by - ay) || 1;
        const off = ma * Math.sin(u * mk * TAU + mp) * Math.sin(Math.PI * u) * Math.pow(1 - smooth(0.2, 0.75, u), 2);
        pts[k] = [pts[k][0] - ((by - ay) / L) * off, pts[k][1] + ((bx - ax) / L) * off];
      }
      const twigs = [];
      if (rng() < 0.45) {
        const u = 0.1 + rng() * 0.25;
        const k = Math.max(1, Math.min(pts.length - 2, Math.round(u * (pts.length - 1))));
        const [ax, ay] = pts[k - 1];
        const [bx, by] = pts[k + 1];
        const sd = rng() < 0.5 ? 1 : -1;
        let h = Math.atan2(by - ay, bx - ax) + sd * (0.5 + rng() * 0.25);
        const len = 3 + Math.floor(rng() * 3);
        const tw = [pts[k].slice()];
        const om = -sd * (0.06 + rng() * 0.05);
        for (let q = 0; q < len; q++) {
          h += om;
          const [x, y] = tw[tw.length - 1];
          tw.push([x + Math.cos(h) * 2.6, y + Math.sin(h) * 2.6]);
        }
        twigs.push({ pts: tw, u });
      }
      strands.push({ col: c, plan: p, from: o.h, i: j, j, n, thL, approach: pts, twigs });
    });
  }
  return { strands, plan };
}

// B's explorers: the distal hyphae of the plume gather into one cord, twist about each other
// for a short run (a rhizomorph), then part into parallel lanes that meet the contour together
function cableStrands(rng, ring, c, p) {
  const { picks, Q0, t0 } = p;
  const n = picks.length;
  const thL = p.th;
  const dMid = p.shift;
  const P3 = ring.pt(thL, dMid);
  const [tx, ty] = ring.tan(thL);
  const D = Math.hypot(P3[0] - Q0[0], P3[1] - Q0[1]);
  const P1 = [Q0[0] + t0[0] * D * c.k1, Q0[1] + t0[1] * D * c.k1];
  const P2 = [P3[0] - tx * D * c.k2, P3[1] - ty * D * c.k2];
  const C = resample(bezier(Q0, P1, P2, P3, 240), 1.6);
  // normal sign so that +offset at the end means "outward" on the contour
  const e = C.pts[C.pts.length - 1];
  const sg = Math.sign(e.nx * Math.cos(thL) + e.ny * Math.sin(thL)) || 1;
  const nsg = Math.sign(C.pts[0].nx * -t0[1] + C.pts[0].ny * t0[0]) || 1;
  const period = c.period ?? 24;
  const out = [];
  picks.forEach((o, i) => {
    const j = sg > 0 ? i : n - 1 - i;
    const ph = (i / n) * TAU + (rng() - 0.5) * 0.3;
    const amp = c.twist * (0.9 + rng() * 0.2);
    const pts = [[o.x, o.y]];
    for (const q of C.pts) {
      const env = Math.pow(Math.sin(Math.PI * clamp((q.s - c.tw0) / (c.tw1 - c.tw0), 0, 1)), 1.3);
      const off =
        nsg * o.o * (1 - smooth(0, c.tw0 + 0.06, q.s)) +
        amp * env * Math.sin((TAU * q.d) / period + ph) +
        sg * dIn(n, j) * smooth(c.tw1 - 0.02, 0.97, q.s);
      pts.push([q.x + q.nx * off, q.y + q.ny * off]);
    }
    pts[pts.length - 1] = ring.pt(thL, dIn(n, j) + p.shift);
    out.push({ col: c, plan: p, from: o.h, i, j, n, thL, approach: pts, twigs: [], cable: true });
  });
  return out;
}

// the band: each strand runs clockwise from its landing, drifts to the inner tier once the
// previous colony has faded, and fades out itself a little past the next colony's landing
export function growCords(rng, ring, strands) {
  for (const s of strands) {
    const p = s.plan;
    const c = s.col;
    const thNext = s.thL + mod(p.next.th - s.thL, TAU);
    const thPrevEnd = p.th + p.prev.c.ov; // where the previous colony's strands fade out
    const thEnd = thNext + c.ov + s.j * 0.045;
    const d0 = dIn(s.n, s.j);
    const off = (th) => d0 + p.shift * (1 - smooth(thPrevEnd + DRIFT[0], thPrevEnd + DRIFT[1], th));
    const sample = (a, b) => {
      const pts = [];
      const q = Math.max(1, Math.ceil((b - a) / 0.012));
      for (let k = 0; k <= q; k++) {
        const th = a + ((b - a) * k) / q;
        pts.push(ring.pt(th, off(th)));
      }
      return pts;
    };
    s.th0 = s.thL;
    s.thE = thEnd;
    s.off = off;
    s.cord = sample(s.thL, thEnd - FADE);
    // fading tail in short steps
    s.tail = [];
    const NT = 6;
    for (let k = 0; k < NT; k++) {
      const a = thEnd - FADE + (FADE * k) / NT;
      const b = thEnd - FADE + (FADE * (k + 1)) / NT;
      s.tail.push({ pts: sample(a, b), f: 1 - (k + 0.6) / NT });
    }
  }
}

// ---------------------------------------------------------------- path utils
function rdp(pts, eps) {
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const L = Math.hypot(dx, dy) || 1e-9;
    let md = -1;
    let mi = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / L;
      if (d > md) {
        md = d;
        mi = i;
      }
    }
    if (md > eps) {
      keep[mi] = 1;
      stack.push([a, mi], [mi, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

// corner-cutting that keeps the end points, so fusions and junctions stay exact
function chaikin(pts, iters = 1) {
  let p = pts;
  for (let it = 0; it < iters; it++) {
    if (p.length < 3) return p;
    const out = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, ay] = p[i];
      const [bx, by] = p[i + 1];
      if (i > 0) out.push([ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25]);
      if (i < p.length - 2) out.push([ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75]);
    }
    out.push(p[p.length - 1]);
    p = out;
  }
  return p;
}

const fmt = (v) => {
  let s = (Math.round(v * 10) / 10).toFixed(1);
  if (s.endsWith('.0')) s = s.slice(0, -2);
  s = s.replace(/^(-?)0\./, '$1.');
  return s === '-0' ? '0' : s;
};

function toD(pts) {
  const r = pts.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
  let d = 'M' + fmt(r[0][0]) + ' ' + fmt(r[0][1]) + 'l';
  let first = true;
  for (let i = 1; i < r.length; i++) {
    const dx = fmt(r[i][0] - r[i - 1][0]);
    const dy = fmt(r[i][1] - r[i - 1][1]);
    if (dx === '0' && dy === '0') continue;
    d += (first || dx[0] === '-' ? '' : ' ') + dx + (dy[0] === '-' ? '' : ' ') + dy;
    first = false;
  }
  if (first) d += '0 0';
  return d;
}

function plen(pts) {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return L;
}

// ---------------------------------------------------------------- generate
export function generate({ w = 640, h = 720, seed = 11, tweak = {}, ring: ringOpts = {}, fontSize } = {}) {
  const rng = mulberry32(seed);
  const ring = makeRing(ringOpts);
  const grid = new Grid(10);
  const cols = COLONIES.map((c) => ({ ...c, ...(tweak[c.id] || {}) }));
  const { hyphae } = growColonies(rng, ring, grid, cols);
  const { strands, plan } = growBridges(rng, ring, cols);
  growCords(rng, ring, strands);
  const colIdx = Object.fromEntries(cols.map((c, i) => [c.id, i]));

  // ---- reveal timeline (seconds): the datum is set out, colonies grow, explorers leave,
  // the band winds round and closes everywhere at once, then the drafting layer appears
  const T_COL0 = 0.35;
  const T_COL1 = 2.05;
  const T_CLOSE = 3.6;
  const IC = Math.max(...hyphae.map((q) => q.end));
  const colT = (it) => T_COL0 + (T_COL1 - T_COL0) * (1 - Math.pow(1 - clamp(it / IC, 0, 1), 1.35));
  const items = [];
  const minW = 0.62;
  for (const hy of hyphae) {
    if (hy.pts.length < 2 || plen(hy.pts) < 4) continue;
    const c = hy.col;
    const t0 = colT(hy.born);
    items.push({
      pts: chaikin(hy.pts, c.smooth ?? 1),
      w: Math.max(minW, c.w0 * Math.pow(c.wDecay ?? 0.82, hy.gen)),
      o: Math.max(0.5, c.o0 * Math.pow(c.oDecay ?? 0.88, hy.gen)),
      group: 'local-' + c.id,
      kind: 'draw',
      t0,
      t1: Math.max(colT(hy.end), t0 + 0.08),
    });
  }
  const byEnd = strands.slice().sort((p, q) => mod(p.thE, TAU) - mod(q.thE, TAU));
  for (const st of strands) {
    const ci = colIdx[st.col.id];
    const tb0 = Math.max(1.3 + ci * 0.16 + st.j * (st.cable ? 0 : 0.08), colT(st.from.end) + 0.05);
    const tb1 = tb0 + plen(st.approach) / (st.cable ? 190 : 250);
    items.push({ pts: chaikin(st.approach, 1), w: st.cable ? 0.66 : 0.68, o: 0.86, group: 'bridge', kind: 'draw', t0: tb0, t1: tb1 });
    for (const tw of st.twigs) {
      const ta = tb0 + (tb1 - tb0) * tw.u;
      items.push({ pts: tw.pts, w: minW, o: 0.62, group: 'bridge', kind: 'draw', t0: ta, t1: ta + 0.3, ease: 'out' });
    }
    // the band closes everywhere at once: every strand finishes within a short window
    const tc1 = Math.max(T_CLOSE + byEnd.indexOf(st) * 0.015, tb1 + 0.8);
    const W = 0.74;
    const O = 0.92;
    items.push({ pts: st.cord, w: W, o: O, group: 'emergent', kind: 'draw', ease: 'close', t0: tb1, t1: tc1 });
    st.tail.forEach((tl, k) => {
      items.push({ pts: tl.pts, w: W, o: O * tl.f, group: 'emergent', kind: 'draw', cap: 'butt', t0: tc1 + k * 0.045, t1: tc1 + (k + 1) * 0.045 });
    });
  }
  const T_ANN = T_CLOSE + 0.3;

  // ---- drafting layer (design units)
  const ann = [];
  const texts = [];
  const bboxOf = (ptsList) => {
    const b = [Infinity, Infinity, -Infinity, -Infinity];
    for (const pts of ptsList)
      for (const [x, y] of pts) {
        if (x < b[0]) b[0] = x;
        if (y < b[1]) b[1] = y;
        if (x > b[2]) b[2] = x;
        if (y > b[3]) b[3] = y;
      }
    return b;
  };
  const cb = Object.fromEntries(cols.map((c) => [c.id, bboxOf(c.hy.map((q) => q.pts))]));
  // centre: registration cross with an open centre, set out with the datum
  {
    const a = 7;
    const g = 2.4;
    const { cx, cy } = ring;
    ann.push({ pts: [[cx - a, cy], [cx - g, cy]], kind: 'fade', at: 0.25 });
    ann.push({ pts: [[cx + g, cy], [cx + a, cy]], kind: 'fade', at: 0.25 });
    ann.push({ pts: [[cx, cy - a], [cx, cy - g]], kind: 'fade', at: 0.25 });
    ann.push({ pts: [[cx, cy + g], [cx, cy + a]], kind: 'fade', at: 0.25 });
  }
  // radius along the contour's major axis, which passes through A's junction, to the innermost
  // strand there; the axis makes the radius exactly normal, so the right-angle mark is true
  {
    const th = ring.phi;
    let dmin = Infinity;
    for (const st of strands) {
      const u = mod(th - st.thL, TAU);
      if (u <= st.thE - st.thL) dmin = Math.min(dmin, st.off(st.thL + u));
    }
    const u = [Math.cos(th), Math.sin(th)];
    const [tx, ty] = ring.tan(th);
    const q = ring.pt(th, dmin - 1.5);
    const p0 = [ring.cx + u[0] * 11, ring.cy + u[1] * 11];
    ann.push({ pts: [p0, q], kind: 'draw', at: T_ANN, dur: 0.45, w: 0.6 });
    const m = 6;
    const sd = -1; // mark on the side the strands arrive from
    const c1 = [q[0] - u[0] * m, q[1] - u[1] * m];
    const c2 = [c1[0] + sd * tx * m, c1[1] + sd * ty * m];
    const c3 = [q[0] + sd * tx * m, q[1] + sd * ty * m];
    ann.push({ pts: [c1, c2, c3], kind: 'fade', at: T_ANN + 0.4, w: 0.6 });
    const mid = [(p0[0] + q[0]) / 2, (p0[1] + q[1]) / 2];
    texts.push({ x: mid[0] - sd * tx * 9, y: mid[1] - sd * ty * 9 + 4, t: 'r', anchor: 'middle', at: T_ANN + 0.45 });
  }
  // construction lines: the tangent at B's and C's junctions continued past the contour
  for (const id of ['b', 'c']) {
    const ss = strands.filter((x) => x.col.id === id);
    const st = ss.reduce((m, x) => (x.j > m.j ? x : m), ss[0]);
    const th = st.thL;
    const [px, py] = ring.pt(th, st.off(th));
    const [tx, ty] = ring.tan(th);
    const L0 = 5;
    const L1 = id === 'b' ? 56 : 48;
    ann.push({ pts: [[px + tx * L0, py + ty * L0], [px + tx * L1, py + ty * L1]], kind: 'fade', at: T_ANN + 0.1, dash: true, w: 0.6 });
  }
  // colony letters
  const rootB = cols.find((c) => c.id === 'b');
  texts.push({ x: cb.a[0] + 2, y: cb.a[1] + 9, t: 'A', anchor: 'start', at: 0.75 });
  texts.push({ x: rootB.cx - 22, y: rootB.cy + 4, t: 'B', anchor: 'end', at: 0.95 });
  texts.push({ x: cb.c[0] + 2, y: cb.c[1] + 9, t: 'C', anchor: 'start', at: 1.15 });

  // ---- fit into the requested box, keeping a caption band along the bottom
  const mobile = w < 520;
  const fs = fontSize ?? (mobile ? 12 : 12.5);
  const gx = mobile ? 6 : 14;
  const gt = mobile ? 6 : 10;
  const gb = fs * 2 + (mobile ? 30 : 34);
  const b = bboxOf(items.map((it) => it.pts).concat(ann.map((a) => a.pts)));
  for (const t of texts) {
    const tw = t.t.length * 7.4;
    const x0 = t.anchor === 'end' ? t.x - tw : t.anchor === 'middle' ? t.x - tw / 2 : t.x;
    b[0] = Math.min(b[0], x0);
    b[2] = Math.max(b[2], x0 + tw);
    b[1] = Math.min(b[1], t.y - 10);
  }
  const iw = w - 2 * gx;
  const ih = h - gt - gb;
  const S = Math.min(iw / (b[2] - b[0]), ih / (b[3] - b[1]));
  const ox = gx + (iw - (b[2] - b[0]) * S) / 2 - b[0] * S;
  const oy = gt + (ih - (b[3] - b[1]) * S) / 2 - b[1] * S;
  // line weights: optically even on desktop, about 15% lighter on a phone-sized drawing
  const ks = clamp(0.4 + 0.6 * S, 0.7, 1.04);
  const wMin = mobile ? 0.5 : 0.62;
  const T = (pts) => pts.map(([x, y]) => [ox + x * S, oy + y * S]);

  const tEnd = Math.max(...items.map((it) => it.t1));
  const DUR = Math.max(tEnd, T_ANN + 0.95);
  const paths = [];
  const push = (p) => paths.push(p);
  // datum: one hairline through the centre of the shared contour, inside the art box
  {
    const yy = oy + ring.cy * S;
    push({ d: toD([[0.5, yy], [w - 0.5, yy]]), w: 1, o: 1, group: 'annotation', tone: 'datum', kind: 'draw', ease: 'out', order: 0, dur: +(0.9 / DUR).toFixed(4), len: +(w - 1).toFixed(1) });
  }
  for (const it of items) {
    const p = rdp(T(it.pts), 0.16);
    push({
      d: toD(p),
      w: +Math.max(wMin, it.w * ks).toFixed(2),
      o: +it.o.toFixed(2),
      group: it.group,
      kind: it.kind,
      ease: it.ease,
      cap: it.cap,
      order: +(it.t0 / DUR).toFixed(4),
      dur: +((it.t1 - it.t0) / DUR).toFixed(4),
      len: +plen(p).toFixed(1),
    });
  }
  for (const a of ann) {
    const p = T(a.pts);
    push({
      d: toD(p),
      w: +Math.max(0.55, (a.w ?? 0.7) * Math.min(1, ks)).toFixed(2),
      o: 1,
      group: 'annotation',
      tone: 'muted',
      kind: a.kind,
      dash: a.dash || undefined,
      order: +(a.at / DUR).toFixed(4),
      dur: +((a.dur ?? 0.6) / DUR).toFixed(4),
      len: +plen(p).toFixed(1),
    });
  }
  const outTexts = texts.map((t) => {
    const [[X, Y]] = T([[t.x, t.y]]);
    return { x: +X.toFixed(1), y: +Y.toFixed(1), t: t.t, anchor: t.anchor, order: +(t.at / DUR).toFixed(4) };
  });
  // caption band (output units): figure caption bottom-left, scale bar bottom-right,
  // both standing on the same baseline
  {
    const base = h - (mobile ? 6 : 8);
    const tc = (T_ANN + 0.5) / DUR;
    outTexts.push({ x: 0, y: base - fs * 1.45, t: 'Fig. 01', anchor: 'start', order: +tc.toFixed(4), caption: true });
    outTexts.push({ x: 0, y: base, t: 'Local growth, shared structure', anchor: 'start', order: +tc.toFixed(4), caption: true });
    // Right side of the caption band names the three local structures.
    // (No scale bar: this is a drawing, not a micrograph.)
    if (!mobile) outTexts.push({ x: w - 0.5, y: base, t: 'A · B · C  local colonies', anchor: 'end', order: +tc.toFixed(4), caption: true });
  }

  return {
    viewBox: `0 0 ${fmt(w)} ${fmt(h)}`,
    w,
    h,
    duration: +DUR.toFixed(2),
    fontSize: fs,
    scale: +S.toFixed(3),
    landings: plan.map((p) => ({ id: p.c.id, th: +p.th.toFixed(3), n: p.picks.length })),
    paths,
    texts: outTexts,
  };
}

// ---------------------------------------------------------------- render
export function renderSVG(opts = {}) {
  const g = generate(opts);
  const total = g.duration;
  const cls = opts.className || 'mf';
  const C = '.' + cls;
  const css =
    `${C} path{fill:none;stroke:#111;stroke-linecap:round;stroke-linejoin:round}` +
    `${C} .an path{stroke:#666}${C} .dt path{stroke:#E5E5E5}${C} path.ds{stroke-dasharray:2 3}${C} path.bt{stroke-linecap:butt}` +
    `${C} text{fill:#666;font:400 ${g.fontSize}px 'Geist Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.02em}` +
    `@media (prefers-reduced-motion:no-preference){` +
    `${C}.play .g path,${C}.play path.g,${C}.play .e path{stroke-dasharray:1 1.02;stroke-dashoffset:1.01;animation:${cls}-draw var(--d) linear var(--t) both}` +
    `${C}.play path.o{animation-timing-function:cubic-bezier(.2,.6,.3,1)}` +
    `${C}.play .e path{animation-timing-function:cubic-bezier(.4,.15,.25,1)}` +
    `${C}.play path.f,${C}.play text{animation:${cls}-fade .7s ease-out var(--t) both}` +
    `}` +
    `@keyframes ${cls}-draw{to{stroke-dashoffset:0}}@keyframes ${cls}-fade{from{opacity:0}}` +
    (opts.debug ? `${C} .local-a path{stroke:#c33}${C} .local-b path{stroke:#36c}${C} .local-c path{stroke:#3a3}${C} .bridge path{stroke:#c90}${C} .emergent path{stroke:#909}` : '');
  const label =
    'Three separate mycelial colonies, each with its own growth pattern, send a few fine hyphae into a shared contour. ' +
    'Their lines settle into regular lanes and close into one ring that none of the colonies forms alone.';
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${g.viewBox}" class="${cls}${opts.animate === false ? '' : ' play'}" role="img" aria-label="${label}">`;
  out += `<style>${css}</style>`;
  const sec = (v) => num((Math.round(v * total * 100) / 100).toString()) + 's';
  const pathEl = (p, extraCls) => {
    const draw = p.kind === 'draw';
    const c = [extraCls, p.dash ? 'ds' : '', draw && p.ease === 'out' ? 'o' : '', p.cap === 'butt' ? 'bt' : ''].filter(Boolean).join(' ');
    const st = draw ? `--t:${sec(p.order)};--d:${sec(Math.max(p.dur, 0.05 / total))}` : `--t:${sec(p.order)}`;
    return `<path${c ? ` class="${c}"` : ''} d="${p.d}" stroke-width="${num(p.w)}"${p.o < 1 ? ` stroke-opacity="${num(p.o)}"` : ''}${draw ? ' pathLength="1"' : ''} style="${st}"/>`;
  };
  const datum = g.paths.filter((p) => p.tone === 'datum');
  if (datum.length) out += `<g class="an dt">${datum.map((p) => pathEl(p, 'g')).join('')}</g>`;
  for (const grp of ['local-a', 'local-b', 'local-c', 'bridge', 'emergent']) {
    const ps = g.paths.filter((p) => p.group === grp);
    if (!ps.length) continue;
    out += `<g class="${grp} ${grp === 'emergent' ? 'e' : 'g'}">${ps.map((p) => pathEl(p)).join('')}</g>`;
  }
  const an = g.paths.filter((p) => p.group === 'annotation' && p.tone !== 'datum');
  out += `<g class="an">${an.map((p) => pathEl(p, p.kind === 'draw' ? 'g' : 'f')).join('')}`;
  for (const t of g.texts) {
    out += `<text x="${fmt(t.x)}" y="${fmt(t.y)}"${t.anchor !== 'start' ? ` text-anchor="${t.anchor}"` : ''} style="--t:${sec(t.order)}">${t.t}</text>`;
  }
  out += '</g></svg>';
  return out;
}

const num = (v) => String(v).replace(/^0\./, '.');
