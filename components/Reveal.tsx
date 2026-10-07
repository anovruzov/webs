"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/** Adds `in-view` once the element scrolls into view. Used for one-shot reveals and diagram draws. */
export default function Reveal({
  as: Tag = "div",
  className = "reveal",
  children,
  threshold = 0.2,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} className={`${className}${seen ? " in-view" : ""}`}>
      {children}
    </Tag>
  );
}
