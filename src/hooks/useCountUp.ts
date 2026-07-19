import { useEffect, useRef, useState } from "react";

/**
 * Counts a number from 0 to `target` with ease-out cubic timing
 * when the element scrolls into view.
 * `suffix` is appended (e.g. "+", "%").
 * Returns [ref, displayValue].
 */
export function useCountUp(
  target: number,
  {
    duration = 1400,
    decimals = 0,
    suffix = "",
  }: { duration?: number; decimals?: number; suffix?: string } = {},
): [React.RefObject<HTMLElement | null>, string] {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState("0" + suffix);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          io.disconnect();
          animate();
        }
      },
      { threshold: 0.3 },
    );

    io.observe(el);

    function animate() {
      const start = performance.now();

      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        setValue(current.toFixed(decimals) + suffix);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setValue(target.toFixed(decimals) + suffix);
        }
      }

      requestAnimationFrame(tick);
    }

    return () => io.disconnect();
  }, [target, duration, decimals, suffix]);

  return [ref, value];
}
