import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { fmtDateTime, fmtCountdown } from "@/lib/liveTime";
import StatusPill from "@/components/StatusPill";

export default function LivePlayer() {
  const { classId } = useParams();
  const [c, setC] = useState(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    api
      .get(`/live/classes/${classId}`)
      .then((r) => setC(r.data))
      .catch(() => setError(true));
  }, [classId]);

  // tick every second so "upcoming" flips to "live" without a refresh
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center text-[#78716C]">
        Couldn't find this class. <Link to="/live" className="text-[#7B1E1E] font-semibold">Back to live classes</Link>
      </div>
    );
  }
  if (!c) return null;

  const start = new Date(c.start).getTime();
  const end = new Date(c.end).getTime();
  const status = now < start ? "upcoming" : now <= end ? "live" : "ended";
  const hasVideo = c.youtube_id && !c.youtube_id.startsWith("REPLACE");
  const chatSrc = `https://www.youtube.com/live_chat?v=${c.youtube_id}&embed_domain=${window.location.hostname}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8" data-testid="live-player-page">
      <Link to="/live" className="text-sm text-[#78716C] hover:text-[#7B1E1E]">← Back to live classes</Link>

      <div className="mt-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs uppercase tracking-[0.15em] font-mono-em text-[#78716C]">
            Class {c.class_level} · {c.subject}
          </span>
          <StatusPill status={status} />
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">{c.title}</h1>
        <div className="text-sm text-[#78716C] mt-1">{fmtDateTime(c.start)} · {c.duration_min} min</div>
      </div>

      {status === "upcoming" ? (
        <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-10 text-center bento-shadow">
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Starts in</div>
          <div className="font-display text-5xl md:text-6xl font-bold text-[#7B1E1E] mt-3">
            {fmtCountdown(start - now)}
          </div>
          <p className="text-sm text-[#78716C] mt-4">This page will switch to the live stream automatically.</p>
        </div>
      ) : !hasVideo ? (
        <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-10 text-center text-[#78716C]">
          The stream link for this class hasn't been added yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-12 gap-5">
          <div className={status === "live" ? "md:col-span-8" : "md:col-span-12"}>
            <div className="aspect-video bg-black rounded-[20px] overflow-hidden border border-[#E7E5E4]">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${c.youtube_id}?autoplay=1&rel=0`}
                title={c.title}
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
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
    </div>
  );
}
