import Reveal from "./Reveal";

/** A drawing label knocked out of the linework behind it, as on a plan. */
function Tag({ x, y, t, end }: { x: number; y: number; t: string; end?: boolean }) {
  const w = t.length * 6.65 + 6;
  const rx = end ? x - w + 3 : x - 3;
  return (
    <g>
      <rect className="fill-paper" x={rx} y={y - 10} width={w} height={14} />
      <text className="svg-note" x={x} y={y} textAnchor={end ? "end" : undefined}>
        {t}
      </text>
    </g>
  );
}

/*
 * Fig. 02 — four stages drawn as one line of reasoning:
 * local reasoning → shared findings → evidence lineage → continued discovery.
 * Each panel is a 240×192 drawing; strokes draw in once when the figure enters view.
 */

function Records({ x, y, n = 3, w = 40 }: { x: number; y: number; n?: number; w?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <line key={i} className="ink-mute" x1={x} y1={y + i * 8} x2={x + w - (i % 2) * 12} y2={y + i * 8} />
      ))}
    </>
  );
}

function Local() {
  return (
    <svg viewBox="0 0 240 192" preserveAspectRatio="xMinYMin meet" aria-hidden="true">
      <rect className="ink-1 ink-dash" x="8" y="22" width="96" height="66" />
      <Records x={20} y={42} />
      <rect className="fill-ink" x="84" y="34" width="8" height="8" />
      <Tag x={8} y={14} t="support" />

      <rect className="ink-1 ink-dash" x="128" y="8" width="104" height="70" />
      <Records x={140} y={30} n={4} w={46} />
      <rect className="fill-ink" x="212" y="20" width="8" height="8" />
      <Tag x={232} y={94} t="engineering" end />

      <rect className="ink-1 ink-dash" x="52" y="114" width="112" height="66" />
      <Records x={64} y={134} n={3} w={52} />
      <rect className="fill-ink" x="144" y="126" width="8" height="8" />
      <Tag x={172} y={178} t="operations" />
    </svg>
  );
}

function Shared() {
  return (
    <svg viewBox="0 0 240 192" preserveAspectRatio="xMinYMin meet" aria-hidden="true">
      <line className="ink-2 draw" pathLength={1} x1="0" y1="52" x2="240" y2="52" />
      <Tag x={0} y={40} t="shared layer" />

      {[30, 102, 174].map((x, i) => (
        <g key={x}>
          <rect className="ink-faint ink-dash" x={x - 26} y="128" width="52" height="52" />
          <rect className="fill-ink" x={x - 4} y="150" width="8" height="8" />
          <line className={`ink-1 draw d${i + 2}`} pathLength={1} x1={x} y1="150" x2={x} y2="70" />
          <rect className="ink-1 fill-paper" x={x - 15} y="60" width="30" height="14" />
          <line className="ink-mute" x1={x - 9} y1="67" x2={x + 9} y2="67" />
        </g>
      ))}
      <line className="ink-mute" x1="0" y1="112" x2="240" y2="112" />
      <Tag x={240} y={106} t="boundary" end />
    </svg>
  );
}

function Lineage() {
  const roots = [
    { x: 30, y: 166 },
    { x: 120, y: 176 },
    { x: 190, y: 162 },
  ];
  return (
    <svg viewBox="0 0 240 192" preserveAspectRatio="xMinYMin meet" aria-hidden="true">
      {roots.map((r, i) => (
        <path
          key={i}
          className={`ink-1 draw d${i + 2}`}
          pathLength={1}
          d={`M120,40 C120,${100 + i * 4} ${r.x},${r.y - 70} ${r.x},${r.y - 6}`}
        />
      ))}
      <path className="ink-faint draw d4" pathLength={1} d="M120,40 C126,104 200,90 200,144" />
      <g transform="translate(120 34) rotate(45)">
        <rect className="fill-ink" x="-7" y="-7" width="14" height="14" />
      </g>
      <Tag x={134} y={22} t="finding" />
      {roots.map((r, i) => (
        <rect key={i} className="ink-1 fill-paper" x={r.x - 5} y={r.y - 5} width="10" height="10" />
      ))}
      <rect className="ink-faint fill-paper" x="195" y="148" width="10" height="10" />
      <Tag x={0} y={191} t="source roots" />
      <Tag x={212} y={157} t="copy" />
    </svg>
  );
}

function Discovery() {
  return (
    <svg viewBox="0 0 240 192" preserveAspectRatio="xMinYMin meet" aria-hidden="true">
      <g transform="translate(64 40) rotate(45)">
        <rect className="ink-1 fill-paper" x="-7" y="-7" width="14" height="14" />
      </g>
      <Tag x={0} y={16} t="gap in finding" />
      <path className="ink-1 ink-dash" d="M76,48 C120,64 168,104 178,146" />
      <path className="ink-1" d="M172,140 L178,147 L182,138" />
      <Tag x={150} y={78} t="question" />
      <rect className="ink-1 ink-dash" x="150" y="152" width="58" height="34" />
      <rect className="fill-ink" x="190" y="160" width="8" height="8" />
      <path className="ink-2 draw d3" pathLength={1} d="M160,150 C140,118 104,82 80,58" />
      <path className="ink-2" d="M88,58 L79,57 L81,66" />
      <Tag x={106} y={116} t="answer" end />
      <path className="ink-mute draw d4" pathLength={1} d="M44,58 C10,90 18,150 70,160 C96,165 118,150 126,132" />
      <path className="ink-mute" d="M120,134 L127,131 L129,139" />
      <Tag x={0} y={184} t="next question" />
    </svg>
  );
}

const STAGES = [
  {
    t: "Local reasoning",
    b: "Each team, system, or agent reasons over its own records, where they already live. Raw data does not move.",
    Art: Local,
  },
  {
    t: "Shared findings",
    b: "What crosses the boundary is a structured finding: what was observed, about what, and when. Not the record behind it.",
    Art: Shared,
  },
  {
    t: "Evidence lineage",
    b: "Every finding keeps its links to the sources that support it. Copies of one source count once, so repetition is not evidence.",
    Art: Lineage,
  },
  {
    t: "Continued discovery",
    b: "Gaps in a finding become targeted questions to the sources that can close them. Each answer changes the next question.",
    Art: Discovery,
  },
];

export default function HowFigure() {
  return (
    <Reveal className="figure" threshold={0.15}>
      <ol className="stages">
        {STAGES.map(({ t, b, Art }, i) => (
          <li className="stage" key={t}>
            <span className="label">
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
            </span>
            <div className="stage-art">
              <Art />
            </div>
            <h3 className="h3">{t}</h3>
            <p className="body">{b}</p>
          </li>
        ))}
      </ol>
      <div className="return-line" aria-hidden="true">
        <svg viewBox="0 0 1200 28" preserveAspectRatio="none">
          <path className="ink-mute draw d4" pathLength={1} d="M1188,0 V14 H12" />
          <path className="ink-mute" d="M20,8 L10,14 L20,20" />
        </svg>
      </div>
      <div className="figure-foot">
        <span className="note">Fig. 02 — The loop. Findings move; records stay.</span>
        <span className="note">04 → 01</span>
      </div>
    </Reveal>
  );
}
