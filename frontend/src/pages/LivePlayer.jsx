import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { fmtDateTime, fmtCountdown } from "@/lib/liveTime";
import { useAuth } from "@/lib/useAuth";
import StatusPill from "@/components/StatusPill";
import ClassNotes from "@/components/ClassNotes";
import DoubtBox, { InlineLogin } from "@/components/DoubtBox";
import { authed, errText } from "@/lib/portalApi";

const CARD = "bg-white rounded-[20px] border border-[#E7E5E4] p-8 text-center";

export default function LivePlayer() {
  const { classId } = useParams();
  const user = useAuth();
  const [c, setC] = useState(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [stream, setStream] = useState(null);
  const [lock, setLock] = useState(null);

  useEffect(() => {
    api.get(`/live/classes/${classId}`).then((r) => setC(r.data)).catch(() => setError(true));
  }, [classId]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const start = c ? new Date(c.start).getTime() : 0;
  const end = c ? new Date(c.end).getTime() : 0;
  const status = !c ? null : now < start ? "upcoming" : now <= end ? "live" : "ended";

  useEffect(() => {
    if (!c || user === undefined || !status || status === "upcoming") return;
    let off = false;
    (async () => {
      try {
        const cfg = user ? await authed(user) : {};
        const r = await api.get(`/portal/classes/${classId}/stream`, cfg);
        if (!off) { setStream(r.data); setLock(null); }
      } catch (err) {
        if (!off) setLock({ code: err && err.response && err.response.status, text: errText(err, "Couldn't load this class.") });
      }
    })();
    return () => { off = true; };
  }, [c, user, status, classId]);

  if (error) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-center text-[#78716C]">Couldn't find this class. <Link to="/live" className="text-[#7B1E1E] font-semibold">Back to live classes</Link></div>;
  }
  if (!c) return null;

  const yt = stream && stream.youtube_id;
  const chatSrc = `https://www.youtube.com/live_chat?v=${yt}&embed_domain=${window.location.hostname}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8" data-testid="live-player-page">
      <Link to="/live" className="text-sm text-[#78716C] hover:text-[#7B1E1E]">← Back to live classes</Link>

      <div className="mt-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs uppercase tracking-[0.15em] font-mono-em text-[#78716C]">Class {c.class_level} · {c.subject}</span>
          <StatusPill status={status} />
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">{c.title}</h1>
        <div className="text-sm text-[#78716C] mt-1">{fmtDateTime(c.start)} · {c.duration_min} min</div>
      </div>

      {status === "upcoming" ? (
        <div className={`${CARD} p-10 bento-shadow`}>
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Starts in</div>
          <div className="font-display text-5xl md:text-6xl font-bold text-[#7B1E1E] mt-3">{fmtCountdown(start - now)}</div>
          <p className="text-sm text-[#78716C] mt-4">This page switches to the class automatically.</p>
          {!c.free && <p className="text-xs text-[#78716C] mt-2">Enrolled students of this batch can watch. <Link to="/portal" className="text-[#7B1E1E] font-semibold">My Batch</Link></p>}
        </div>
      ) : lock ? (
        lock.code === 401 ? (
          <div className="max-w-md mx-auto bg-white rounded-[20px] border border-[#E7E5E4] p-6">
            <InlineLogin message="Log in to watch this class. It is for enrolled students." />
          </div>
        ) : (
          <div className={CARD}>
            <div className="font-display font-bold text-xl">Enrolled students only</div>
            <p className="text-sm text-[#78716C] mt-2">{lock.text}</p>
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              <Link to="/portal" className="bg-[#7B1E1E] text-white text-sm font-semibold rounded-full px-6 py-2.5">My Batch</Link>
              <Link to={`/batch/${c.batch_id}`} className="border border-[#7B1E1E] text-[#7B1E1E] text-sm font-semibold rounded-full px-6 py-2.5">Enrol in this batch</Link>
            </div>
          </div>
        )
      ) : !stream ? null : !yt ? (
        <div className={`${CARD} text-[#78716C]`}>The video for this class hasn't been added yet. Please check back in a few minutes.</div>
      ) : (
        <div className="grid md:grid-cols-12 gap-5">
          <div className={status === "live" ? "md:col-span-8" : "md:col-span-12"}>
            <div className="aspect-video bg-black rounded-[20px] overflow-hidden border border-[#E7E5E4]">
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1`} title={c.title}
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
            </div>
          </div>
          {status === "live" && (
            <div className="md:col-span-4">
              <div className="bg-white rounded-[20px] border border-[#E7E5E4] overflow-hidden h-[420px] md:h-full min-h-[420px]">
                <iframe className="w-full h-full" src={chatSrc} title="Live chat" />
              </div>
            </div>
          )}
        </div>
      )}

      {stream && status !== "upcoming" && <div className="mt-5"><ClassNotes classId={c.id} title={c.title} start={c.start} status={status} /></div>}
      {stream && status === "ended" && <div className="mt-5"><DoubtBox classId={c.id} /></div>}
    </div>
  );
}
