import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock, User } from "lucide-react";
import { api } from "@/lib/api";
import { fmtDate, fmtDateTime } from "@/lib/liveTime";
import StatusPill from "@/components/StatusPill";

export default function BatchDetail() {
  const { batchId } = useParams();
  const [batch, setBatch] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get(`/live/batches/${batchId}`)
      .then((r) => setBatch(r.data))
      .catch(() => setError(true));
  }, [batchId]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center text-[#78716C]">
        Couldn't find this batch. <Link to="/batches" className="text-[#7B1E1E] font-semibold">Back to batches</Link>
      </div>
    );
  }
  if (!batch) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10" data-testid="batch-detail-page">
      <Link to={`/batches/${batch.class_level}`} className="text-sm text-[#78716C] hover:text-[#7B1E1E]">
        ← Back to Class {batch.class_level} batches
      </Link>

      <div className="mt-4 bg-white rounded-[20px] border border-[#E7E5E4] p-8 bento-shadow">
        <div className="text-xs uppercase tracking-[0.15em] font-mono-em text-[#78716C]">
          Class {batch.class_level} batch
        </div>
        <h1 className="font-display text-3xl font-bold mt-1">{batch.name}</h1>
        <p className="text-[#78716C] mt-2">{batch.description}</p>

        <div className="flex flex-wrap gap-2 mt-5">
          {batch.subjects.map((s) => (
            <span key={s} className="text-xs font-semibold bg-[#FDE68A]/60 text-[#92400E] rounded-full px-3 py-1">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-[#57534E]"><Clock className="w-4 h-4 text-[#7B1E1E]" /> {batch.schedule}</div>
          <div className="flex items-center gap-2 text-[#57534E]"><Calendar className="w-4 h-4 text-[#7B1E1E]" /> Starts {fmtDate(batch.start_date)}</div>
          <div className="flex items-center gap-2 text-[#57534E]"><User className="w-4 h-4 text-[#7B1E1E]" /> {batch.teacher}</div>
        </div>
      </div>

      <div className="mt-10">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Classes in this batch</div>
        <h2 className="font-display text-2xl font-bold mt-2 mb-5">Schedule & recordings</h2>

        {batch.classes.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-8 text-center text-[#78716C]">
            Classes for this batch will be added soon.
          </div>
        ) : (
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] divide-y divide-[#E7E5E4]">
            {batch.classes.map((c) => (
              <Link
                key={c.id}
                to={`/live/${c.id}`}
                className="flex items-center gap-4 p-5 hover:bg-[#FAF9F6] transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-xs text-[#78716C] mt-0.5">{c.subject} · {fmtDateTime(c.start)}</div>
                </div>
                <StatusPill status={c.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
