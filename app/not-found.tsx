import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-head" style={{ minHeight: "70vh" }}>
      <div className="wrap">
        <p className="label">
          <span className="idx">404</span>
        </p>
        <h1 className="h1">Nothing has grown here yet.</h1>
        <div className="btn-row" style={{ marginTop: "var(--s-7)" }}>
          <Link className="btn btn-solid" href="/">
            Back to home <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
