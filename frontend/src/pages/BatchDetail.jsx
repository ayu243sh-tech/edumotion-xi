import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Check, Clock, User, Users } from "lucide-react";
import { api } from "@/lib/api";
import { fmtDate, fmtDateTime } from "@/lib/liveTime";
import { useAuth } from "@/lib/useAuth";
import StatusPill from "@/components/StatusPill";
import { InlineLogin } from "@/components/DoubtBox";
import { ENROLL } from "@/lib/enrollConfig";

export default function BatchDetail() {
  const { batchId } = useParams();
  const user = useAuth(); // undefined = checking, null = logged out

  const [batch, setBatch] = useState(null);
  const [error, setError] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [maxSwitches, setMaxSwitches] = useState(null);
  const [view, setView] = useState(null); // null = automatic
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState(null);
  const [needLogin, setNeedLogin] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    api
      .get(`/live/batches/${batchId}`)
      .then((r) => setBatch(r.data))
      .catch(() => setError(true));
  }, [batchId]);

  const authConfig = useCallback(async () => {
    const token = await user.getIdToken();
    return { headers: { Authorization: `Bearer ${token}` } };
  }, [user]);

  useEffect(() => {
    if (!user) {
      setEnrollment(null);
      return;
    }
    setNeedLogin(false);
    (async () => {
      try {
        const cfg = await authConfig();
        const r = await api.get("/live/enrollments/me", cfg);
        setMaxSwitches(r.data.max_switches);
        setEnrollment((r.data.enrollments || []).find((e) => e.batch_id === batchId) || null);
      } catch {
        /* the page still works without this */
      }
    })();
  }, [user, batchId, authConfig]);

  const options = batch ? batch.options || [] : [];
  const hasOptions = options.length > 0;
  const myOption = enrollment ? options.find((o) => o.id === enrollment.option_id) || null : null;
  const effectiveView = view || (myOption ? "mine" : "all");
  const switchesLeft =
    maxSwitches == null ? null : Math.max(0, maxSwitches - ((enrollment && enrollment.switch_count) || 0));

  const classes = useMemo(() => {
    if (!batch) return [];
    if (effectiveView === "mine" && myOption) {
      return batch.classes.filter((c) => !c.option_id || c.option_id === myOption.id);
    }
    return batch.classes;
  }, [batch, effectiveView, myOption]);

  const choose = async (optionId) => {
    if (!user) {
      setNeedLogin(true);
      return;
    }
    const wasEnrolled = Boolean(enrollment);
    setBusy(optionId);
    setMsg(null);
    try {
      const cfg = await authConfig();
      const r = await api.post(`/live/batches/${batchId}/enroll`, { option_id: optionId }, cfg);
      setEnrollment((prev) => ({
        ...(prev || {}),
        batch_id: batchId,
        option_id: r.data.option_id,
        switch_count: r.data.switch_count,
      }));
      setMaxSwitches(r.data.max_switches);
      setView(null);
      setConfirmId(null);
      setMsg({
        type: "ok",
        text: !r.data.changed
          ? "You're already on this option."
          : wasEnrolled
          ? "Teachers changed. Your classes now follow this option."
          : "You're enrolled! Your classes will follow this option.",
      });
    } catch (err) {
      const detail = err && err.response && err.response.data && err.response.data.detail;
      setMsg({ type: "error", text: typeof detail === "string" ? detail : "Something went wrong. Please try again." });
    } finally {
      setBusy(null);
    }
  };

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
          <div className="flex items-center gap-2 text-[#57534E]">
            <Clock className="w-4 h-4 text-[#7B1E1E]" /> {batch.schedule}
          </div>
          <div className="flex items-center gap-2 text-[#57534E]">
            <Calendar className="w-4 h-4 text-[#7B1E1E]" /> Starts {fmtDate(batch.start_date)}
          </div>
          <div className="flex items-center gap-2 text-[#57534E]">
            {hasOptions ? <Users className="w-4 h-4 text-[#7B1E1E]" /> : <User className="w-4 h-4 text-[#7B1E1E]" />}
            {hasOptions ? "Choose your teachers below" : batch.teacher}
          </div>
        </div>
      </div>

            <div className="mt-6 bg-[#7B1E1E] text-white rounded-[20px] p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-display text-xl font-bold">Ready to join this batch?</div>
          <div className="text-sm text-white/80 mt-1">Enrol for ₹{ENROLL.fee.toLocaleString("en-IN")}. Fill a short form and pay by UPI.</div>
        </div>
        <Link to={`/enroll/${batch.id}`} className="bg-[#F5B400] hover:bg-[#D99E00] text-[#292524] font-semibold rounded-full px-7 py-3">
          Enrol in this batch
        </Link>
      </div>

      {hasOptions && (
        <div className="mt-10">
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Teachers</div>
          <h2 className="font-display text-2xl font-bold mt-2 mb-1">
            {myOption ? "Your teachers" : "Choose your teachers"}
          </h2>
          <p className="text-sm text-[#78716C] mb-5">
            {myOption
              ? switchesLeft == null
                ? "You can switch to the other option any time."
                : `You can switch teachers ${switchesLeft} more ${switchesLeft === 1 ? "time" : "times"} in this batch.`
              : "Pick the group of teachers you'd like to learn with. You can switch later."}
          </p>

          {msg && (
            <div className={`text-sm mb-4 ${msg.type === "ok" ? "text-[#0F766E]" : "text-[#B91C1C]"}`}>{msg.text}</div>
          )}

          {needLogin && !user && (
            <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 mb-5 bento-shadow">
              <InlineLogin message="Log in to choose your teachers. You can use the same account as EduMotion Resources." />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {options.map((o) => {
              const mine = Boolean(enrollment) && enrollment.option_id === o.id;
              const confirming = confirmId === o.id;
              const locked = Boolean(enrollment) && !mine && switchesLeft === 0;

              return (
                <div
                  key={o.id}
                  className={`bg-white rounded-[20px] border p-6 bento-shadow ${
                    mine ? "border-[#7B1E1E]" : "border-[#E7E5E4]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-display text-xl font-bold">{o.label}</div>
                    {mine && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#7B1E1E] text-white rounded-full px-2.5 py-1">
                        <Check className="w-3 h-3" /> YOUR TEACHERS
                      </span>
                    )}
                  </div>
                  {o.tagline && <div className="text-sm text-[#78716C] mt-1">{o.tagline}</div>}

                  <div className="mt-4 divide-y divide-[#F0EEEC]">
                    {o.teachers.map((t) => (
                      <div key={t.subject} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                        <span className="text-[#78716C]">{t.subject}</span>
                        <span className="font-medium text-right">{t.name}</span>
                      </div>
                    ))}
                  </div>

                  {o.schedule && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#78716C]">
                      <Clock className="w-3.5 h-3.5" /> {o.schedule}
                    </div>
                  )}

                  <div className="mt-5">
                    {mine ? (
                      <div className="text-sm text-[#0F766E] font-semibold">You're learning with this group.</div>
                    ) : locked ? (
                      <div className="text-sm text-[#78716C]">No teacher changes left for this batch.</div>
                    ) : confirming ? (
                      <div>
                        <div className="text-sm text-[#57534E] mb-3">
                          Switch to {o.label}? Your live classes will follow it.
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => choose(o.id)}
                            disabled={busy === o.id}
                            className="bg-[#7B1E1E] hover:bg-[#611717] disabled:opacity-60 text-white text-sm font-semibold rounded-full px-5 py-2"
                          >
                            {busy === o.id ? "Switching..." : "Yes, switch"}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="text-sm font-semibold border border-[#E7E5E4] rounded-full px-5 py-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : enrollment ? (
                      <button
                        onClick={() => setConfirmId(o.id)}
                        className="text-sm font-semibold border border-[#7B1E1E] text-[#7B1E1E] hover:bg-[#7B1E1E] hover:text-white rounded-full px-5 py-2 transition-colors"
                      >
                        Switch to {o.label}
                      </button>
                    ) : (
                      <button
                        onClick={() => choose(o.id)}
                        disabled={busy === o.id}
                        className="bg-[#7B1E1E] hover:bg-[#611717] disabled:opacity-60 text-white text-sm font-semibold rounded-full px-5 py-2.5"
                      >
                        {busy === o.id ? "Enrolling..." : user ? `Choose ${o.label}` : "Log in to choose"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-10">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Classes in this batch</div>
        <div className="flex items-end justify-between flex-wrap gap-3 mt-2 mb-5">
          <h2 className="font-display text-2xl font-bold">Schedule & recordings</h2>
          {myOption && (
            <div className="flex gap-2">
              {[
                ["mine", "My classes"],
                ["all", "All classes"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`text-xs font-semibold rounded-full px-3.5 py-1.5 ${
                    effectiveView === id ? "bg-[#7B1E1E] text-white" : "bg-white border border-[#E7E5E4]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {classes.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-8 text-center text-[#78716C]">
            Classes for this batch will be added soon.
          </div>
        ) : (
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] divide-y divide-[#E7E5E4]">
            {classes.map((c) => {
              const opt = c.option_id ? options.find((o) => o.id === c.option_id) : null;
              return (
                <Link
                  key={c.id}
                  to={`/live/${c.id}`}
                  className="flex items-center gap-4 p-5 hover:bg-[#FAF9F6] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-[#78716C] mt-0.5">
                      {c.subject} · {fmtDateTime(c.start)}
                    </div>
                  </div>
                  {opt && (
                    <span className="text-[10px] font-bold bg-[#E0E7FF] text-[#3730A3] rounded-full px-2.5 py-1">
                      {opt.label.toUpperCase()}
                    </span>
                  )}
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
