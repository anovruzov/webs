import type { Metric } from "@/content/research";

export default function MetricView({ m, small }: { m: Metric; small?: boolean }) {
  return (
    <div className="metric">
      <div className={`val${small ? " sm" : ""}`}>{m.value}</div>
      <div className="lbl">{m.label}</div>
      <div className="scope note">{m.scope}</div>
    </div>
  );
}
