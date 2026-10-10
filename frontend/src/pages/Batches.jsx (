import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { api } from "@/lib/api";
import { fmtDate } from "@/lib/liveTime";

const CLASSES = [
  { level: "9", name: "Class 9", tag: "Foundation Builder", color: "#7B1E1E" },
  { level: "10", name: "Class 10", tag: "Board Year", color: "#7B1E1E" },
  { level: "11", name: "Class 11", tag: "Stream Choice", color: "#F5B400" },
  { level: "12", name: "Class 12", tag: "Final Push", color: "#F5B400" },
];

function ClassPicker() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10" data-testid="batches-page">
      <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">01 — Batches</div>
      <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-8">Which class are you in?</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {CLASSES.map((c, i) => (
          <Link
            key={c.level}
            to={`/batches/${c.level}`}
            data-testid={`batch-class-${c.level}`}
            className="group relative bg-white rounded-[20px] border border-[#E7E5E4] p-8 hover:-translate-y-1 transition-transform bento-shadow bento-shadow-hover overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20" style={{ background: c.color }} />
            <div className="text-xs font-mono-em uppercase tracking-[0.2em] text-[#78716C]">0{i + 1}</div>
            <div className="font-display text-3xl font-bold mt-4">{c.name}</div>
            <div className="text-sm text-[#78716C] mt-1">{c.tag}</div>
            <ArrowRight className="w-5 h-5 mt-6 text-[#7B1E1E] group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function BatchList({ classLevel }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/live/batches", { params: { class_level: classLevel } })
      .then((r) => setBatches(r.data || []))
      .catch(() => setBatches([]))
      .finally(() => setLoading(false));
  }, [classLevel]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link to="/batches" className="text-sm text-[#78716C] hover:text-[#7B1E1E]">← Back</Link>
      <div className="mt-4 mb-8">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">02 — Class {classLevel}</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">Choose your batch.</h1>
      </div>

      {loading ? (
        <div className="text-sm text-[#78716C]">Loading...</div>
      ) : batches.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-10 text-center text-[#78716C]">
          No batches for this class yet. New batches are coming soon.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {batches.map((b) => (
            <Link
              key={b.id}
              to={`/batch/${b.id}`}
              data-testid={`batch-card-${b.id}`}
              className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 hover:-translate-y-1 transition-transform bento-shadow bento-shadow-hover"
            >
              <h3 className="font-display text-xl font-bold">{b.name}</h3>
              <p className="text-sm text-[#78716C] mt-1">{b.description}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {b.subjects.map((s) => (
                  <span key={s} className="text-xs font-semibold bg-[#FDE68A]/60 text-[#92400E] rounded-full px-3 py-1">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-5 space-y-1.5 text-xs text-[#78716C]">
                <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {b.schedule}</div>
                <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Starts {fmtDate(b.start_date)}</div>
                <div className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> {b.teacher}</div>
              </div>

              <div className="mt-5 text-sm font-semibold text-[#7B1E1E]">View batch →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Batches() {
  const { classLevel } = useParams();
  return classLevel ? <BatchList classLevel={classLevel} /> : <ClassPicker />;
}
