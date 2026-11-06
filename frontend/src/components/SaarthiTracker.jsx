import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      prev.current = target;
      return;
    }
    const from = prev.current;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setVal(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

// Drops into a "relative" box. It draws a pill at the top-left and a panel at the bottom.
export default function SaarthiTracker({ data, demo = false }) {
  const total = data.books.reduce((a, b) => a + b.reserved, 0);
  const goal = data.goal || 0;
  const pct = goal ? Math.min(100, Math.round((total / goal) * 100)) : 0;
  const shown = useCountUp(total);
  const link = data.whatsapp
    ? `https://wa.me/${data.whatsapp}?text=${encodeURIComponent("Hi! I'd like to reserve Saarthi Handwritten Notes (Class 12).")}`
    : null;
  const soon = total === 0 && !demo;

  return (
    <>
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 text-xs font-mono-em uppercase tracking-[0.15em] flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F766E] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0F766E]" />
        </span>
        Saarthi Notes
      </div>

      {demo && (
        <div className="absolute top-4 right-4 bg-[#F5B400] text-[#292524] rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em]">
          Demo
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg">
        {soon ? (
          <>
            <div className="text-xs text-[#78716C] font-mono-em uppercase tracking-[0.15em]">New · Class 12</div>
            <div className="font-display font-semibold text-lg mt-1 leading-snug">Pre-orders opening soon</div>
            <p className="text-sm text-[#78716C] mt-1">Handwritten notes for English and Physical Education. Be among the first to get a copy.</p>
          </>
        ) : (
          <>
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-xs text-[#78716C] font-mono-em uppercase tracking-[0.15em]">{data.label || "Copies reserved"}</div>
                <div className="font-display text-4xl font-bold text-[#7B1E1E] leading-none mt-1">
                  {shown}
                  {goal > 0 && <span className="text-base font-semibold text-[#78716C]"> / {goal}</span>}
                </div>
              </div>
              {goal > 0 && (
                <div className="text-xs font-semibold text-[#0F766E] bg-[#CCFBF1] rounded-full px-2.5 py-1">
                  {total >= goal ? "Goal reached" : `${pct}% of goal`}
                </div>
              )}
            </div>

            {goal > 0 && (
              <div className="h-2 rounded-full bg-[#E7E5E4] overflow-hidden mt-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7B1E1E] to-[#F5B400] transition-[width] duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}

            <div className="flex gap-2 mt-3">
              {data.books.map((b) => (
                <div key={b.id} className="flex-1 bg-[#FAF9F6] border border-[#E7E5E4] rounded-xl px-3 py-1.5">
                  <div className="text-[10px] text-[#78716C] truncate">{b.title}</div>
                  <div className="font-display font-bold text-sm">{b.reserved}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#7B1E1E] hover:underline"
          >
            Reserve my copy <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </>
  );
}
