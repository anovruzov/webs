/** Two branches that grow apart and are rejoined by a third line: local growth, shared structure. */
export default function Mark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor">
      <path d="M9 17.2V10.4" strokeWidth="1.6" />
      <path d="M9 10.4C9 6.8 5.4 6.4 3.2 1.4" strokeWidth="1.4" />
      <path d="M9 10.4C9 6.8 12.6 6.4 14.8 1.4" strokeWidth="1.4" />
      <path d="M4.6 4.9C7.2 5.9 10.8 5.9 13.4 4.9" strokeWidth="1" />
    </svg>
  );
}
