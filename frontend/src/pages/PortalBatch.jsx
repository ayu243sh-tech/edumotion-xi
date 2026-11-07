import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, ClipboardList, Clock, FileText, Megaphone } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { InlineLogin } from "@/components/DoubtBox";
import StatusPill from "@/components/StatusPill";
import { fmtDate, fmtDateTime } from "@/lib/liveTime";
import { errText, ppost, useLoad } from "@/lib/portalApi";

const CARD = "bg-white rounded-[20px] border border-[#E7E5E4] bento-shadow";
const TABS = [["overview", "Overview"], ["classes", "Classes"], ["materials", "Study material"], ["homework", "Homework"], ["tests", "Tests"]];
const KIND = { ppt: "Slides", notes: "Notes", other: "Material" };

const Empty = ({ children }) => <div className={`${CARD} p-10 text-center text-[#78716C] text-sm`}>{children}</div>;

function Chips({ items, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {["all", ...items].map((s) => (
        <button key={s} onClick={() => onChange(s)}
          className={`text-xs font-semibold rounded-full px-3.5 py-1.5 ${value === s ? "bg-[#7B1E1E] text-white" : "bg-white border border-[#E7E5E4] hover:border-[#7B1E1E]"}`}>
          {s === "all" ? "All subjects" : s}
        </button>
      ))}
    </div>
  );
}

function Overview({ d, batchId }) {
  const s = d.stats;
  const n = d.next_class;
  const names = d.option ? [...new Set(d.option.teachers.map((t) => t.name))] : [];
  const lines = d.option ? (names.length === 1 ? [`All subjects: ${names[0]}`] : d.option.teachers.map((t) => `${t.subject}: ${t.name}`)) : [];
  const tiles = [
    ["Classes attended", `${s.attended} / ${s.held}`],
    ["Homework pending", s.pending_homework],
    ["Tests taken", `${s.tests_done} / ${s.tests_total}`],
  ];
  return (
    <div className="space-y-6">
      <div className={`${CARD} p-6 md:p-8`}>
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Welcome</div>
        <div className="font-display text-2xl font-bold mt-1">Hi, {d.student_name}</div>
        <div className="text-sm text-[#78716C] mt-1">{d.batch.name} · {d.batch.schedule}</div>
        {d.option && (
          <div className="mt-4 text-sm text-[#57534E]">
            <div className="font-semibold">{d.option.label}</div>
            {lines.map((l) => <div key={l}>{l}</div>)}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          {d.batch.subjects.map((x) => <span key={x} className="text-xs font-semibold bg-[#FDE68A]/60 text-[#92400E] rounded-full px-3 py-1">{x}</span>)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {tiles.map(([label, v]) => (
          <div key={label} className={`${CARD} p-4 text-center`}>
            <div className="font-display text-2xl font-bold text-[#7B1E1E]">{v}</div>
            <div className="text-[11px] text-[#78716C] mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className={`${CARD} p-6`}>
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-3">Next class</div>
        {n ? (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-display font-bold text-lg">{n.title}</div>
              <div className="text-sm text-[#78716C] mt-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {n.subject} · {fmtDateTime(n.start)}</div>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill status={n.status} />
              <Link to={`/live/${n.id}`} className="bg-[#7B1E1E] hover:bg-[#611717] text-white text-sm font-semibold rounded-full px-5 py-2.5">
                {n.status === "live" ? "Join now" : "Open"}
              </Link>
            </div>
          </div>
        ) : <div className="text-sm text-[#78716C]">No upcoming classes scheduled yet.</div>}
      </div>

      <div className={`${CARD} p-6`}>
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-3">Announcements</div>
        {d.announcements.length === 0 ? <div className="text-sm text-[#78716C]">Nothing new right now.</div> : (
          <div className="space-y-4">
            {d.announcements.map((a) => (
              <div key={a.id} className="flex gap-3">
                <Megaphone className="w-4 h-4 text-[#7B1E1E] mt-1 shrink-0" />
                <div>
                  <div className="font-medium">{a.pinned && "📌 "}{a.title}</div>
                  {a.body && <div className="text-sm text-[#57534E] mt-0.5 whitespace-pre-line">{a.body}</div>}
                  <div className="text-xs text-[#78716C] mt-1">{fmtDate(a.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClassesTab({ user, batchId }) {
  const { data, loading, error } = useLoad(user, `/portal/batch/${batchId}/classes`);
  const [subj, setSubj] = useState("all");
  if (loading) return null;
  if (error) return <Empty>{error}</Empty>;
  const items = data.filter((c) => subj === "all" || c.subject === subj);
  return (
    <>
      <Chips items={[...new Set(data.map((c) => c.subject))]} value={subj} onChange={setSubj} />
      {items.length === 0 ? <Empty>No classes yet.</Empty> : (
        <div className={`${CARD} divide-y divide-[#E7E5E4]`}>
          {items.map((c) => (
            <Link key={c.id} to={`/live/${c.id}`} className="flex items-center gap-4 p-5 hover:bg-[#FAF9F6]">
              <div className="flex-1 min-w-0">
                <div className="font-medium">{c.title}</div>
                <div className="text-xs text-[#78716C] mt-0.5">{c.subject} · {fmtDateTime(c.start)}</div>
              </div>
              {c.attended && <span className="text-[10px] font-bold bg-[#CCFBF1] text-[#0F766E] rounded-full px-2.5 py-1">ATTENDED</span>}
              <StatusPill status={c.status} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function MaterialsTab({ user, batchId }) {
  const { data, loading, error } = useLoad(user, `/portal/batch/${batchId}/resources`);
  const [subj, setSubj] = useState("all");
  if (loading) return null;
  if (error) return <Empty>{error}</Empty>;
  const items = data.filter((r) => subj === "all" || r.subject === subj);
  return (
    <>
      <Chips items={[...new Set(data.map((r) => r.subject))]} value={subj} onChange={setSubj} />
      {items.length === 0 ? <Empty>Slides and notes will appear here after each class.</Empty> : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((r) => (
            <div key={r.id} className={`${CARD} p-5`}>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#78716C]">
                <FileText className="w-3.5 h-3.5" /> {KIND[r.kind] || "Material"} · {r.subject}{r.chapter ? ` · ${r.chapter}` : ""}
              </div>
              <div className="font-display font-semibold mt-2">{r.title}</div>
              {r.description && <div className="text-sm text-[#57534E] mt-1">{r.description}</div>}
              {r.url && (
                <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-[#7B1E1E]">
                  Open <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function HomeworkTab({ user, batchId }) {
  const { data, loading, error, reload } = useLoad(user, `/portal/batch/${batchId}/homework`);
  const [subj, setSubj] = useState("all");
  const [notes, setNotes] = useState({});
  const [msg, setMsg] = useState("");
  if (loading) return null;
  if (error) return <Empty>{error}</Empty>;
  const items = data.filter((h) => subj === "all" || h.subject === subj);
  const today = new Date().toISOString().slice(0, 10);

  const mark = async (h, done) => {
    setMsg("");
    try { await ppost(user, `/portal/homework/${h.id}/done`, { done, note: notes[h.id] || null }); await reload(); }
    catch (e) { setMsg(errText(e)); }
  };

  return (
    <>
      <Chips items={[...new Set(data.map((h) => h.subject))]} value={subj} onChange={setSubj} />
      {msg && <div className="text-sm text-[#B91C1C] mb-3">{msg}</div>}
      {items.length === 0 ? <Empty>No homework right now.</Empty> : (
        <div className="space-y-4">
          {items.map((h) => {
            const late = h.due_date && !h.done && h.due_date < today;
            return (
              <div key={h.id} className={`${CARD} p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#78716C]">
                      <ClipboardList className="w-3.5 h-3.5" /> {h.subject}{h.chapter ? ` · ${h.chapter}` : ""}
                    </div>
                    <div className="font-display font-semibold mt-1.5">{h.title}</div>
                    {h.description && <div className="text-sm text-[#57534E] mt-1 whitespace-pre-line">{h.description}</div>}
                    {h.url && <a href={h.url} target="_blank" rel="noreferrer" className="inline-block mt-2 text-sm font-semibold text-[#7B1E1E]">Open worksheet →</a>}
                  </div>
                  <div className="text-right shrink-0">
                    {h.done ? <span className="text-[10px] font-bold bg-[#CCFBF1] text-[#0F766E] rounded-full px-2.5 py-1">DONE</span>
                      : h.due_date && <span className={`text-[10px] font-bold rounded-full px-2.5 py-1 ${late ? "bg-[#FEE2E2] text-[#B91C1C]" : "bg-[#FDE68A]/60 text-[#92400E]"}`}>{late ? "OVERDUE · " : "DUE · "}{fmtDate(h.due_date)}</span>}
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  {!h.done && (
                    <input value={notes[h.id] || ""} onChange={(e) => setNotes((n) => ({ ...n, [h.id]: e.target.value }))}
                      placeholder="Optional note for your teacher" maxLength={300}
                      className="flex-1 border border-[#E7E5E4] rounded-full px-4 py-2 text-sm outline-none focus:border-[#7B1E1E]" />
                  )}
                  {h.done ? (
                    <button onClick={() => mark(h, false)} className="text-xs font-semibold text-[#78716C] hover:text-[#7B1E1E] self-start">Undo</button>
                  ) : (
                    <button onClick={() => mark(h, true)} className="bg-[#0F766E] hover:bg-[#0B5F58] text-white text-sm font-semibold rounded-full px-5 py-2 inline-flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" /> Mark as done
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function TestsTab({ user, batchId }) {
  const { data, loading, error } = useLoad(user, `/portal/batch/${batchId}/tests`);
  if (loading) return null;
  if (error) return <Empty>{error}</Empty>;
  if (data.length === 0) return <Empty>No tests yet. Your teachers will add them here.</Empty>;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {data.map((t) => (
        <div key={t.id} className={`${CARD} p-5`}>
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#78716C]">{t.subject}</div>
          <div className="font-display font-semibold mt-1">{t.title}</div>
          <div className="text-xs text-[#78716C] mt-1">{t.questions} questions · {t.duration_min} min</div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm">{t.best !== null ? <>Best: <b className="text-[#7B1E1E]">{t.best}/{t.questions}</b> · {t.attempts} attempt{t.attempts === 1 ? "" : "s"}</> : <span className="text-[#78716C]">Not attempted</span>}</div>
            <Link to={`/portal/test/${t.id}?batch=${batchId}`} className="bg-[#7B1E1E] hover:bg-[#611717] text-white text-sm font-semibold rounded-full px-5 py-2">
              {t.attempts ? "Retake" : "Start"}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PortalBatch() {
  const { batchId } = useParams();
  const user = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "overview";
  const ov = useLoad(user, `/portal/batch/${batchId}/overview`);

  if (user === undefined) return null;
  if (!user) {
    return <div className="max-w-md mx-auto px-6 py-16"><div className={`${CARD} p-6`}><InlineLogin message="Log in to open your batch." /></div></div>;
  }
  if (ov.loading) return null;
  if (ov.error) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="text-[#78716C]">{ov.error}</div>
        <Link to="/portal" className="inline-block mt-4 text-[#7B1E1E] font-semibold">Go to My Batch</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8" data-testid="portal-batch-page">
      <Link to="/portal" className="text-sm text-[#78716C] hover:text-[#7B1E1E]">← My Batch</Link>
      <h1 className="font-display text-3xl font-bold mt-3">{ov.data.batch.name}</h1>
      <div className="flex gap-2 overflow-x-auto mt-5 mb-6 pb-1" style={{ scrollbarWidth: "none" }}>
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setParams({ tab: id })}
            className={`shrink-0 text-sm font-semibold rounded-full px-5 py-2 ${tab === id ? "bg-[#7B1E1E] text-white" : "bg-white border border-[#E7E5E4] hover:border-[#7B1E1E]"}`}>
            {label}
          </button>
        ))}
      </div>
      {tab === "overview" && <Overview d={ov.data} batchId={batchId} />}
      {tab === "classes" && <ClassesTab user={user} batchId={batchId} />}
      {tab === "materials" && <MaterialsTab user={user} batchId={batchId} />}
      {tab === "homework" && <HomeworkTab user={user} batchId={batchId} />}
      {tab === "tests" && <TestsTab user={user} batchId={batchId} />}
    </div>
  );
}
