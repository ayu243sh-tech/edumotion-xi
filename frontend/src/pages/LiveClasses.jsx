import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { api } from "@/lib/api";
import { fmtDateTime } from "@/lib/liveTime";
import StatusPill from "@/components/StatusPill";

const FILTERS = ["all", "9", "10", "11", "12"];

function ClassCard({ c }) {
  const cta =
    c.status === "live" ? "Join now →" : c.status === "upcoming" ? "View details →" : "Watch recording →";
  return (
    <Link
      to={`/live/${c.id}`}
      data-testid={`live-card-${c.id}`}
      className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 hover:-translate-y-1 transition-transform bento-shadow bento-shadow-hover"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.15em] font-mono-em text-[#78716C]">
          Class {c.class_level} · {c.subject}
        </span>
        <StatusPill status={c.status} />
      </div>
      <div className="font-display font-semibold text-lg leading-snug">{c.title}</div>
      <div className="mt-3 flex items-center gap-2 text-xs text-[#78716C]">
        <Clock className="w-3.5 h-3.5" /> {fmtDateTime(c.start)} · {c.duration_min} min
      </div>
      <div className="mt-4 text-sm font-semibold text-[#7B1E1E]">{cta}</div>
    </Link>
  );
}

function Section({ number, eyebrow, title, items }) {
  if (items.length === 0) return null;
  return (
    <section className="mb-12">
      <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">
        {number} — {eyebrow}
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-6">{title}</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {items.map((c) => (
          <ClassCard key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
}

export default function LiveClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .get("/live/classes")
      .then((r) => setClasses(r.data || []))
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = classes.filter((c) => filter === "all" || c.class_level === filter);
  const live = visible.filter((c) => c.status === "live");
  const upcoming = visible.filter((c) => c.status === "upcoming");
  const ended = visible.filter((c) => c.status === "ended");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" data-testid="live-classes-page">
      <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Live classes</div>
      <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">Learn live. Revise anytime.</h1>

      <div className="flex flex-wrap gap-2 mt-6 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm font-semibold rounded-full px-4 py-2 transition-colors ${
              filter === f
                ? "bg-[#7B1E1E] text-white"
                : "bg-white border border-[#E7E5E4] hover:border-[#7B1E1E]"
            }`}
          >
            {f === "all" ? "All classes" : `Class ${f}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-[#78716C]">Loading...</div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-10 text-center text-[#78716C]">
          No live classes scheduled yet. Check back soon.
        </div>
      ) : (
        <>
          <Section number="01" eyebrow="LIVE NOW" title="Happening right now." items={live} />
          <Section number="02" eyebrow="UPCOMING" title="Coming up next." items={upcoming} />
          <Section number="03" eyebrow="RECORDINGS" title="Missed a class? Watch it here." items={ended} />
        </>
      )}
    </div>
  );
}
