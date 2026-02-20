import { useEffect, useRef, useState } from "react";

/**
 * AnimatedNumber - lightweight JS counter (no external deps)
 * props:
 *  - value: number
 *  - format: (n) => string (optional)
 *  - className: css
 */
const AnimatedNumber = ({ value = 0, duration = 600, format }) => {
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = performance.now();
    const initial = Number(display);
    const target = Number(value);

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // smooth ease
      const current = initial + (target - initial) * eased;
      setDisplay(current);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const out = format ? format(display) : display;
  return <>{out}</>;
};

const StatCard = ({ label, value, suffix = "", large = false, accent = "text-indigo-400" }) => {
  return (
    <div className={`game-stat rounded-xl p-4 ${large ? "col-span-2" : ""}`}>
      <p className="text-xs text-indigo-300/70 uppercase tracking-wider mb-2">{label}</p>
      <div className={`flex items-baseline gap-2 ${large ? "text-4xl" : "text-2xl"} font-bold ${accent}`}>
        <AnimatedNumber
          value={Number(value ?? 0)}
          duration={700}
          format={(n) => {
            // if large display 3 decimals, else integer
            return large ? `${Number(n).toFixed(3)}` : `${Math.round(n)}`;
          }}
        />
        {suffix && <span className="text-sm text-indigo-300/50 font-medium">{suffix}</span>}
      </div>
    </div>
  );
};

export default StatCard;
