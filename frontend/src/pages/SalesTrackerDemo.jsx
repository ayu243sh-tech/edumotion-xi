import { useEffect, useState } from "react";
import { Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";
import SaarthiTracker from "@/components/SaarthiTracker";

const BOOKS = [
  { id: "english", title: "English" },
  { id: "pe", title: "Physical Education" },
];
const fresh = () => BOOKS.map((b) => ({ ...b, reserved: 0 }));

export default function SalesTrackerDemo() {
  const [books, setBooks] = useState(fresh());
  const [goal, setGoal] = useState(100);
  const [auto, setAuto] = useState(false);
  const [feed, setFeed] = useState([]);

  const add = (id, n) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, reserved: Math.max(0, b.reserved + n) } : b)));
    if (n > 0) {
      const title = BOOKS.find((b) => b.id === id).title;
      setFeed((f) =>
        [{ key: Date.now() + Math.random(), text: `${n} new pre-order${n > 1 ? "s" : ""}: ${title}`, time: new Date().toLocaleTimeString() }, ...f].slice(0, 6)
      );
    }
  };

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => add(Math.random() < 0.5 ? "english" : "pe", 1), 2200);
    return () => clearInterval(t);
  }, [auto]);

  const reset = () => { setBooks(fresh()); setFeed([]); setAuto(false); };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10" data-testid="sales-demo-page">
      {/* This banner is part of the page and cannot be switched off */}
      <div className="rounded-2xl bg-[#FDE68A] border border-[#F5B400] px-5 py-4 mb-8">
        <div className="font-display font-bold text-[#92400E]">DEMO MODE</div>
        <p className="text-sm text-[#92400E]/90 mt-1">
          Sample numbers for a school project. Nothing on this page is real, and nothing here changes the live website.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-3">What visitors see</div>
          <div className="relative rounded-[28px] overflow-hidden h-[420px] bg-gradient-to-br from-[#2A0A0A] via-[#7B1E1E] to-[#3B0D0D] bento-shadow">
            <SaarthiTracker data={{ goal, whatsapp: "", books }} demo />
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Controls</div>

          {books.map((b) => (
            <div key={b.id} className="bg-white rounded-[20px] border border-[#E7E5E4] p-5 bento-shadow">
              <div className="flex items-center justify-between">
                <div className="font-display font-semibold">{b.title}</div>
                <div className="font-display text-2xl font-bold text-[#7B1E1E]">{b.reserved}</div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => add(b.id, -1)} className="w-10 h-10 rounded-full border border-[#E7E5E4] hover:border-[#7B1E1E] flex items-center justify-center" aria-label="Remove one">
                  <Minus className="w-4 h-4" />
                </button>
                <button onClick={() => add(b.id, 1)} className="flex-1 rounded-full bg-[#7B1E1E] hover:bg-[#611717] text-white text-sm font-semibold flex items-center justify-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add 1 order
                </button>
                <button onClick={() => add(b.id, 5)} className="px-4 rounded-full bg-[#FDE68A] hover:bg-[#F5B400] text-sm font-semibold">
                  +5
                </button>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-5 bento-shadow">
            <div className="text-sm font-semibold mb-3">Goal</div>
            <div className="flex gap-2">
              {[50, 100, 300].map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`text-sm font-semibold rounded-full px-5 py-2 ${goal === g ? "bg-[#7B1E1E] text-white" : "border border-[#E7E5E4] hover:border-[#7B1E1E]"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setAuto((a) => !a)}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#0F766E] hover:bg-[#0B5F58] text-white font-semibold py-3"
            >
              {auto ? <><Pause className="w-4 h-4" /> Stop simulation</> : <><Play className="w-4 h-4" /> Simulate incoming orders</>}
            </button>
            <button onClick={reset} className="flex items-center gap-2 rounded-full border border-[#E7E5E4] hover:border-[#7B1E1E] px-5 font-semibold">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>

          {feed.length > 0 && (
            <div className="bg-white rounded-[20px] border border-[#E7E5E4] divide-y divide-[#F0EEEC]">
              {feed.map((f) => (
                <div key={f.key} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span>{f.text}</span>
                  <span className="text-xs text-[#78716C]">{f.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
