import { useMemo, useState } from "react";
import { useEffect } from "react";
import { Check, Copy, MessageCircle, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { InlineLogin } from "@/components/DoubtBox";
import { fmtDateTime } from "@/lib/liveTime";
import { errText, pdelete, pget, ppost, useLoad } from "@/lib/portalApi";

const CARD = "bg-white rounded-[20px] border border-[#E7E5E4] bento-shadow";
const INPUT = "w-full border border-[#E7E5E4] rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-[#7B1E1E] bg-white";
const BTN = "text-xs font-semibold rounded-full px-3.5 py-1.5 border border-[#E7E5E4] hover:border-[#7B1E1E]";
const BTN_ON = "text-xs font-semibold rounded-full px-3.5 py-1.5 bg-[#7B1E1E] text-white hover:bg-[#611717] disabled:opacity-60";
const STATUS_COLOR = { pending: "bg-[#FDE68A]/70 text-[#92400E]", paid: "bg-[#E0E7FF] text-[#3730A3]", accepted: "bg-[#CCFBF1] text-[#0F766E]", rejected: "bg-[#FEE2E2] text-[#B91C1C]", revoked: "bg-[#F5F5F4] text-[#57534E]" };

function Scope({ batches, v, set, subject = true }) {
  const b = batches.find((x) => x.id === v.batch_id);
  return (
    <>
      <select className={INPUT} value={v.batch_id} required onChange={(e) => set({ ...v, batch_id: e.target.value, option_id: "", subject: "" })}>
        <option value="">Choose batch</option>
        {batches.map((x) => <option key={x.id} value={x.id}>Class {x.class_level} · {x.name}</option>)}
      </select>
      {b && b.options.length > 0 && (
        <select className={INPUT} value={v.option_id} onChange={(e) => set({ ...v, option_id: e.target.value })}>
          <option value="">All students in this batch</option>
          {b.options.map((o) => <option key={o.id} value={o.id}>{o.label} students only</option>)}
        </select>
      )}
      {subject && b && (
        <select className={INPUT} value={v.subject} required onChange={(e) => set({ ...v, subject: e.target.value })}>
          <option value="">Choose subject</option>
          {b.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      )}
    </>
  );
}

function EnrollTab({ user }) {
  const { data, loading, error, reload } = useLoad(user, "/portal/admin/enrollments");
  const [filter, setFilter] = useState("pending");
  const [copied, setCopied] = useState(null);
  const [busy, setBusy] = useState(null);
  const [err, setErr] = useState("");
  const rows = data || [];
  const counts = useMemo(() => rows.reduce((a, r) => ({ ...a, [r.status]: (a[r.status] || 0) + 1 }), {}), [rows]);
  const active = rows.filter((r) => r.status === "accepted" && r.activated).length;
  const shown = rows.filter((r) => filter === "all" || r.status === filter);

  const act = async (id, action, note) => {
    setBusy(id);
    setErr("");
    try { await ppost(user, `/portal/admin/enrollments/${id}`, { action, note }); await reload(); }
    catch (e) { setErr(errText(e)); }
    finally { setBusy(null); }
  };
  const message = (r) =>
    `Hi ${r.student_name}, your enrolment in ${r.batch_name}${r.option_label ? ` (${r.option_label})` : ""} is confirmed.\n\n1. Open ${window.location.origin}/portal\n2. Log in or sign up\n3. Enter your activation code: ${r.activation_code}\n\nSee you in class!`;
  const copy = async (r) => {
    try { await navigator.clipboard.writeText(message(r)); setCopied(r.id); setTimeout(() => setCopied(null), 1800); } catch { /* ignore */ }
  };

  if (loading) return null;
  if (error) return <div className="text-sm text-[#B91C1C]">{error}</div>;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[["Pending", counts.pending || 0], ["Paid", counts.paid || 0], ["Accepted", counts.accepted || 0], ["Logged in", active]].map(([l, n]) => (
          <div key={l} className={`${CARD} p-4 text-center`}>
            <div className="font-display text-2xl font-bold text-[#7B1E1E]">{n}</div>
            <div className="text-[11px] text-[#78716C]">{l}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {["pending", "paid", "accepted", "rejected", "revoked", "all"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={filter === s ? BTN_ON : BTN}>{s[0].toUpperCase() + s.slice(1)}</button>
        ))}
      </div>
      {err && <div className="text-sm text-[#B91C1C] mb-3">{err}</div>}
      {shown.length === 0 ? <div className={`${CARD} p-8 text-center text-sm text-[#78716C]`}>Nothing here.</div> : (
        <div className="space-y-3">
          {shown.map((r) => (
            <div key={r.id} className={`${CARD} p-5`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display font-bold text-lg">{r.student_name}</div>
                  <div className="text-xs text-[#78716C] mt-0.5">{r.batch_name}{r.option_label ? ` · ${r.option_label}` : ""}</div>
                </div>
                <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${STATUS_COLOR[r.status] || ""}`}>{r.status}{r.status === "accepted" && r.activated ? " · logged in" : ""}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mt-3 text-[#57534E]">
                <div>Phone: <a href={`tel:${r.phone}`} className="font-medium text-[#292524]">{r.phone}</a></div>
                <div>DOB: <span className="font-medium text-[#292524]">{r.dob}</span></div>
                <div>Father: <span className="font-medium text-[#292524]">{r.father_name}</span></div>
                <div>Mother: <span className="font-medium text-[#292524]">{r.mother_name}</span></div>
                <div>UTR: <span className="font-medium text-[#292524]">{r.utr || "not given"}</span></div>
                <div>Applied: <span className="font-medium text-[#292524]">{fmtDateTime(r.created_at)}</span></div>
              </div>
              {r.note && <div className="text-xs mt-2 text-[#78716C]">Note: {r.note}</div>}
              {r.activation_code && r.status === "accepted" && (
                <div className="mt-3 inline-block bg-[#FAF9F6] border border-[#E7E5E4] rounded-xl px-4 py-2 font-mono-em tracking-widest font-bold">{r.activation_code}</div>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                {r.status === "pending" && <button disabled={busy === r.id} onClick={() => act(r.id, "paid")} className={BTN}>Mark paid</button>}
                {["pending", "paid", "rejected", "revoked"].includes(r.status) && <button disabled={busy === r.id} onClick={() => act(r.id, "accept")} className={BTN_ON}>Accept</button>}
                {["pending", "paid"].includes(r.status) && <button disabled={busy === r.id} onClick={() => act(r.id, "reject")} className={BTN}>Reject</button>}
                {r.status === "accepted" && (
                  <>
                    <a href={`https://wa.me/91${r.phone}?text=${encodeURIComponent(message(r))}`} target="_blank" rel="noreferrer" className={`${BTN_ON} inline-flex items-center gap-1`}>
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp the code
                    </a>
                    <button onClick={() => copy(r)} className={`${BTN} inline-flex items-center gap-1`}>
                      {copied === r.id ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy message</>}
                    </button>
                    {r.activated && <button onClick={() => window.confirm("Unlink this student's login? They can activate again with the code.") && act(r.id, "reset")} className={BTN}>Reset login</button>}
                    <button onClick={() => window.confirm("Remove this student's access?") && act(r.id, "revoke")} className={BTN}>Revoke access</button>
                  </>
                )}
                {["rejected", "revoked", "paid"].includes(r.status) && <button onClick={() => act(r.id, "pending")} className={BTN}>Back to pending</button>}
                <button onClick={() => { const n = window.prompt("Note (only you can see this):", r.note || ""); if (n !== null) act(r.id, "note", n); }} className={BTN}>Note</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const blankClass = { id: "", batch_id: "", option_id: "", subject: "", title: "", start: "", duration_min: 60, youtube: "", free: false };

function ClassesTab({ user, batches }) {
  const { data, reload } = useLoad(user, "/portal/admin/classes");
  const [f, setF] = useState(blankClass);
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await ppost(user, "/portal/admin/classes", { ...f, id: f.id || null, option_id: f.option_id || null, duration_min: Number(f.duration_min) || 60 });
      setF(blankClass);
      await reload();
    } catch (err) { setMsg(errText(err)); }
  };
  const edit = (c) => { setF({ id: c.id, batch_id: c.batch_id, option_id: c.option_id || "", subject: c.subject, title: c.title, start: c.start.slice(0, 16), duration_min: c.duration_min, youtube: c.youtube_id || "", free: c.free }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const del = async (id) => { if (window.confirm("Delete this class?")) { await pdelete(user, `/portal/admin/classes/${id}`); await reload(); } };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className={`${CARD} p-5 space-y-3`}>
        <div className="font-display font-bold">{f.id ? "Edit class" : "Schedule a class"}</div>
        <Scope batches={batches} v={f} set={setF} />
        <input className={INPUT} placeholder="Class title, e.g. National Income: Introduction" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required />
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-[#57534E]">Date and time (IST)<input type="datetime-local" className={`${INPUT} mt-1`} value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} required /></label>
          <label className="text-xs text-[#57534E]">Duration (minutes)<input type="number" min="10" max="360" className={`${INPUT} mt-1`} value={f.duration_min} onChange={(e) => setF({ ...f, duration_min: e.target.value })} /></label>
        </div>
        <input className={INPUT} placeholder="YouTube link or video ID (you can add it later)" value={f.youtube} onChange={(e) => setF({ ...f, youtube: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[#7B1E1E]" checked={f.free} onChange={(e) => setF({ ...f, free: e.target.checked })} /> Free demo class (anyone can watch)</label>
        {msg && <div className="text-sm text-[#B91C1C]">{msg}</div>}
        <div className="flex gap-2"><button className={BTN_ON}>{f.id ? "Save changes" : "Schedule class"}</button>{f.id && <button type="button" className={BTN} onClick={() => setF(blankClass)}>Cancel</button>}</div>
      </form>
      <div className={`${CARD} divide-y divide-[#E7E5E4]`}>
        {(data || []).length === 0 && <div className="p-6 text-sm text-[#78716C] text-center">No classes scheduled here yet.</div>}
        {(data || []).map((c) => (
          <div key={c.id} className="p-4 flex flex-wrap items-center gap-3 justify-between">
            <div>
              <div className="font-medium">{c.title}{c.free && <span className="ml-2 text-[10px] font-bold bg-[#FDE68A]/70 text-[#92400E] rounded-full px-2 py-0.5">FREE</span>}</div>
              <div className="text-xs text-[#78716C]">{c.subject} · {c.batch_id}{c.option_id ? ` · ${c.option_id}` : ""} · {fmtDateTime(c.start)} · {c.attended} attended · {c.youtube_id ? "video added" : "no video yet"}</div>
            </div>
            <div className="flex gap-2"><button className={BTN} onClick={() => edit(c)}>Edit</button><button className={`${BTN} text-[#B91C1C]`} onClick={() => del(c.id)}><Trash2 className="w-3.5 h-3.5" /></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

const blankRes = { batch_id: "", option_id: "", subject: "", kind: "notes", title: "", chapter: "", description: "", url: "", due_date: "", published: true };

function MaterialsTab({ user, batches }) {
  const { data, reload } = useLoad(user, "/portal/admin/resources");
  const [f, setF] = useState(blankRes);
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try { await ppost(user, "/portal/admin/resources", { ...f, option_id: f.option_id || null, due_date: f.due_date || null }); setF({ ...blankRes, batch_id: f.batch_id, option_id: f.option_id, subject: f.subject, kind: f.kind }); await reload(); }
    catch (err) { setMsg(errText(err)); }
  };
  const del = async (id) => { if (window.confirm("Delete this item?")) { await pdelete(user, `/portal/admin/resources/${id}`); await reload(); } };
  return (
    <div className="space-y-6">
      <form onSubmit={submit} className={`${CARD} p-5 space-y-3`}>
        <div className="font-display font-bold">Add slides, notes or homework</div>
        <Scope batches={batches} v={f} set={setF} />
        <select className={INPUT} value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>
          <option value="ppt">Slides (PPT / PDF)</option><option value="notes">Notes</option><option value="homework">Homework</option><option value="other">Other</option>
        </select>
        <input className={INPUT} placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required />
        <input className={INPUT} placeholder="Chapter (optional)" value={f.chapter} onChange={(e) => setF({ ...f, chapter: e.target.value })} />
        <textarea className={INPUT} rows={2} placeholder="Description or instructions (optional)" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <input className={INPUT} placeholder="File link (https://...)" value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} />
        {f.kind === "homework" && <label className="text-xs text-[#57534E] block">Due date<input type="date" className={`${INPUT} mt-1`} value={f.due_date} onChange={(e) => setF({ ...f, due_date: e.target.value })} /></label>}
        {msg && <div className="text-sm text-[#B91C1C]">{msg}</div>}
        <button className={BTN_ON}>Add</button>
      </form>
      <div className={`${CARD} divide-y divide-[#E7E5E4]`}>
        {(data || []).length === 0 && <div className="p-6 text-sm text-[#78716C] text-center">Nothing added yet.</div>}
        {(data || []).map((r) => (
          <div key={r.id} className="p-4 flex flex-wrap items-center gap-3 justify-between">
            <div>
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-[#78716C]">{r.kind} · {r.subject} · {r.batch_id}{r.option_id ? ` · ${r.option_id}` : ""}{r.kind === "homework" ? ` · ${r.done_count} done` : ""}</div>
            </div>
            <button className={`${BTN} text-[#B91C1C]`} onClick={() => del(r.id)}><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

const blankAnn = { batch_id: "", option_id: "", title: "", body: "", pinned: false };

function AnnounceTab({ user, batches }) {
  const { data, reload } = useLoad(user, "/portal/admin/announcements");
  const [f, setF] = useState(blankAnn);
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try { await ppost(user, "/portal/admin/announcements", { ...f, option_id: f.option_id || null }); setF(blankAnn); await reload(); }
    catch (err) { setMsg(errText(err)); }
  };
  const del = async (id) => { await pdelete(user, `/portal/admin/announcements/${id}`); await reload(); };
  return (
    <div className="space-y-6">
      <form onSubmit={submit} className={`${CARD} p-5 space-y-3`}>
        <div className="font-display font-bold">Post an announcement</div>
        <Scope batches={batches} v={f} set={setF} subject={false} />
        <input className={INPUT} placeholder="Title, e.g. Test on Sunday" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required />
        <textarea className={INPUT} rows={3} placeholder="Details (optional)" value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[#7B1E1E]" checked={f.pinned} onChange={(e) => setF({ ...f, pinned: e.target.checked })} /> Pin to the top</label>
        {msg && <div className="text-sm text-[#B91C1C]">{msg}</div>}
        <button className={BTN_ON}>Post</button>
      </form>
      <div className={`${CARD} divide-y divide-[#E7E5E4]`}>
        {(data || []).length === 0 && <div className="p-6 text-sm text-[#78716C] text-center">No announcements yet.</div>}
        {(data || []).map((a) => (
          <div key={a.id} className="p-4 flex items-center justify-between gap-3">
            <div><div className="font-medium">{a.pinned && "📌 "}{a.title}</div><div className="text-xs text-[#78716C]">{a.batch_id}{a.option_id ? ` · ${a.option_id}` : ""}</div></div>
            <button className={`${BTN} text-[#B91C1C]`} onClick={() => del(a.id)}><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const user = useAuth();
  const [who, setWho] = useState(null);
  const [tab, setTab] = useState("enrol");
  const [batches, setBatches] = useState([]);

  useEffect(() => { if (user) pget(user, "/portal/whoami").then(setWho).catch(() => setWho({ is_admin: false })); }, [user]);
  useEffect(() => { api.get("/live/batches").then((r) => setBatches(r.data || [])).catch(() => {}); }, []);

  if (user === undefined) return null;
  if (!user) return <div className="max-w-md mx-auto px-6 py-16"><div className={`${CARD} p-6`}><InlineLogin message="Log in with your admin account." /></div></div>;
  if (!who) return null;
  if (!who.is_admin) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16">
        <div className={`${CARD} p-6`}>
          <div className="font-display font-bold text-xl">Admin only</div>
          <p className="text-sm text-[#78716C] mt-2">If you are the admin, add this ID to <b>ADMIN_UIDS</b> on Render, then reload this page.</p>
          <div className="mt-4 bg-[#FAF9F6] border border-[#E7E5E4] rounded-xl p-3 font-mono-em text-xs break-all select-all">{who.uid}</div>
        </div>
      </div>
    );
  }

  const TABS = [["enrol", "Enrolments"], ["classes", "Classes"], ["materials", "Material & homework"], ["news", "Announcements"]];
  return (
    <div className="max-w-5xl mx-auto px-6 py-8" data-testid="admin-page">
      <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Admin</div>
      <h1 className="font-display text-3xl font-bold mt-1">Control panel</h1>
      <div className="flex gap-2 overflow-x-auto mt-5 mb-6 pb-1" style={{ scrollbarWidth: "none" }}>
        {TABS.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`shrink-0 text-sm font-semibold rounded-full px-5 py-2 ${tab === id ? "bg-[#7B1E1E] text-white" : "bg-white border border-[#E7E5E4] hover:border-[#7B1E1E]"}`}>{label}</button>)}
      </div>
      {tab === "enrol" && <EnrollTab user={user} />}
      {tab === "classes" && <ClassesTab user={user} batches={batches} />}
      {tab === "materials" && <MaterialsTab user={user} batches={batches} />}
      {tab === "news" && <AnnounceTab user={user} batches={batches} />}
    </div>
  );
}
