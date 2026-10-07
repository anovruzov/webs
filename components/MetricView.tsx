import type { Metric } from "@/content/research";

/** Glue each " · " separator to the word before it, so a wrapped line never starts with a dot. */
export const keepSeparators = (t: string) => t.replace(/ · /g, "\u00a0· ");

export default function MetricView({ m, small }: { m: Metric; small?: boolean }) {
  return (
    <div className="metric">
      <div className={`val${small ? " sm" : ""}`}>{m.value}</div>
      <div className="lbl">{m.label}</div>
      <div className="scope note">{keepSeparators(m.scope)}</div>
    </div>
  );
}
