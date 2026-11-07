import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock, User, Users } from "lucide-react";
import { api } from "@/lib/api";
import { fmtDate, fmtDateTime } from "@/lib/liveTime";
import { ENROLL } from "@/lib/enrollConfig";
import StatusPill from "@/components/StatusPill";

function teacherLines(o) {
  const names = [...new Set(o.teachers.map((t) => t.name))];
  return names.length === 1 ? [["All subjects", names[0]]] : o.teachers.map((t) => [t.subject, t.name]);
}

export default function BatchDetail() {
  const { batchId } = useParams();
  const [batch, setBatch] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/live/batches/${batchId}`).then((r) => setBatch(r.data)).catch(() => setError(true));
  }, [batchId]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center text-[#78716C]">
        Couldn't find this batch. <Link to="/batches" className="text-[#7B1E1E] font-semibold">Back to batches</Link>
      </div>
    );
  }
  if (!batch) return null;

  const options = batch.options || [];
  const hasOptions = options.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10" data-testid="batch-detail-page">
      <Link to={`/batches/${batch.class_level}`} className="text-sm text-[#78716C] hover:text-[#7B1E1E]">
        ← Back to Class {batch.class_level} batches
      </Link>

      <div className="mt-4 bg-white rounded-[20px] border border-[#E7E5E4] p-8 bento-shadow">
        <div className="text-xs uppercase tracking-[0.15em] font-mono-em text-[#78716C]">Class {batch.class_level} batch</div>
        <h1 className="font-display text-3xl font-bold mt-1">{batch.name}</h1>
        <p className="text-[#78716C] mt-2">{batch.description}</p>
        <div className="flex flex-wrap gap-2 mt-5">
          {batch.subjects.map((s) => (
            <span key={s} className="text-xs font-semibold bg-[#FDE68A]/60 text-[#92400E] rounded-full px-3 py-1">{s}</span>
          ))}
        </div>
        <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-[#57534E]"><Clock className="w-4 h-4 text-[#7B1E1E]" /> {batch.schedule}</div>
          <div className="flex items-center gap-2 text-[#57534E]"><Calendar className="w-4 h-4 text-[#7B1E1E]" /> Starts {fmtDate(batch.start_date)}</div>
          <div className="flex items-center gap-2 text-[#57534E]">
            {hasOptions ? <Users className="w-4 h-4 text-[#7B1E1E]" /> : <User className="w-4 h-4 text-[#7B1E1E]" />}
            {hasOptions ? "Two teacher options" : batch.teacher}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-[#7B1E1E] text-white rounded-[20px] p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-display text-xl font-bold">Ready to join this batch?</div>
          <div className="text-sm text-white/80 mt-1">Enrol for ₹{ENROLL.fee.toLocaleString("en-IN")}. Log in, fill a short form and pay by UPI.</div>
        </div>
        <Link to={`/enroll/${batch.id}`} className="bg-[#F5B400] hover:bg-[#D99E00] text-[#292524] font-semibold rounded-full px-7 py-3">
          Enrol in this batch
        </Link>
      </div>

      {hasOptions && (
        <div className="mt-10">
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Teachers</div>
          <h2 className="font-display text-2xl font-bold mt-2 mb-1">Choose your teachers</h2>
          <p className="text-sm text-[#78716C] mb-5">Pick the group of teachers you'd like to learn with. You choose in the enrolment form.</p>
          <div className="grid md:grid-cols-2 gap-5">
            {options.map((o) => (
              <div key={o.id} className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 bento-shadow flex flex-col">
                <div className="font-display text-xl font-bold">{o.label}</div>
                {o.tagline && <div className="text-sm text-[#78716C] mt-1">{o.tagline}</div>}
                <div className="mt-4 divide-y divide-[#F0EEEC] flex-1">
                  {teacherLines(o).map(([subject, name]) => (
                    <div key={subject} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <span className="text-[#78716C]">{subject}</span>
                      <span className="font-medium text-right">{name}</span>
                    </div>
                  ))}
                </div>
                <Link to={`/enroll/${batch.id}?option=${o.id}`} className="mt-5 text-center text-sm font-semibold border border-[#7B1E1E] text-[#7B1E1E] hover:bg-[#7B1E1E] hover:text-white rounded-full px-5 py-2.5 transition-colors">
                  Enrol with {o.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Classes in this batch</div>
        <h2 className="font-display text-2xl font-bold mt-2 mb-5">Schedule & recordings</h2>
        {batch.classes.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-8 text-center text-[#78716C]">Classes for this batch will be added soon.</div>
        ) : (
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] divide-y divide-[#E7E5E4]">
            {batch.classes.map((c) => {
              const opt = c.option_id ? options.find((o) => o.id === c.option_id) : null;
              return (
                <Link key={c.id} to={`/live/${c.id}`} className="flex items-center gap-4 p-5 hover:bg-[#FAF9F6] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-[#78716C] mt-0.5">{c.subject} · {fmtDateTime(c.start)}</div>
                  </div>
                  {opt && <span className="text-[10px] font-bold bg-[#E0E7FF] text-[#3730A3] rounded-full px-2.5 py-1">{opt.label.toUpperCase()}</span>}
                  <StatusPill status={c.status} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
