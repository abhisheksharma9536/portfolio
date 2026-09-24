"use client";

import { useEffect, useRef } from "react";

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  grouped?: boolean;
  className?: string;
};

function format(n: number, grouped?: boolean) {
  return grouped ? n.toLocaleString("en-US") : String(n);
}

/**
 * Server-renders the final value (correct for SEO and no-JS). After
 * hydration, if the number is still below the fold, it resets to 0 off-screen
 * and counts up once when scrolled into view. Writes to the DOM directly so
 * the animation never re-renders React.
 */
export function CountUp({ value, prefix = "", suffix = "", grouped, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const numberNode = el.querySelector<HTMLSpanElement>("[data-count]");
    if (!numberNode) return;
    numberNode.textContent = format(0, grouped);

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          numberNode.textContent = format(Math.round(value * eased), grouped);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      numberNode.textContent = format(value, grouped);
    };
  }, [value, grouped]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span data-count className="tabular-nums">
        {format(value, grouped)}
      </span>
      {suffix}
    </span>
  );
}
