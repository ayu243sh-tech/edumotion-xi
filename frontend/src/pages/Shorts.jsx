import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";

const CLASS_FILTERS = ["all", "9", "10", "11", "12"];
const CAPTION_SPACE = 64; // room under each video for the title

function thumbUrl(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 text-xs font-semibold rounded-full px-3.5 py-1.5 transition-colors ${
        selected ? "bg-[#7B1E1E] text-white" : "bg-white border border-[#E7E5E4] hover:border-[#7B1E1E]"
      }`}
    >
      {label}
    </button>
  );
}

function ShortPlayer({ s, active, w, h }) {
  const box = { width: w, height: h };
  const frame = "rounded-[20px] overflow-hidden bg-black";

  if (!active) {
    return (
      <div style={box} className={frame}>
        {s.youtube_id && <img src={thumbUrl(s.youtube_id)} alt="" className="w-full h-full object-cover opacity-80" />}
      </div>
    );
  }

  if (s.video_url) {
    return (
      <div style={box} className={frame}>
        <video src={s.video_url} className="w-full h-full object-cover" autoPlay muted loop playsInline controls />
      </div>
    );
  }

  const src = `https://www.youtube.com/embed/${s.youtube_id}?autoplay=1&mute=1&loop=1&playlist=${s.youtube_id}&playsinline=1&rel=0`;
  return (
    <div style={box} className={frame}>
      <iframe
        key={s.id}
        className="w-full h-full"
        src={src}
        title={s.title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

export default function Shorts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const classFilter = searchParams.get("class") || "all";
  const subjectFilter = searchParams.get("subject") || "all";

  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState({ w: 270, h: 480 });
  const feedRef = useRef(null);
  const slideRefs = useRef([]);

  useEffect(() => {
    api
      .get("/shorts")
      .then((r) => setShorts(r.data || []))
      .catch(() => setShorts([]))
      .finally(() => setLoading(false));
  }, []);

  const subjects = useMemo(() => {
    const inClass = shorts.filter((s) => classFilter === "all" || s.class_level === classFilter);
    return [...new Set(inClass.map((s) => s.subject))];
  }, [shorts, classFilter]);

  const visible = useMemo(
    () =>
      shorts.filter(
        (s) =>
          (classFilter === "all" || s.class_level === classFilter) &&
          (subjectFilter === "all" || s.subject === subjectFilter)
      ),
    [shorts, classFilter, subjectFilter]
  );

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    if (key === "class") next.delete("subject");
    setSearchParams(next);
  };

  // Size the video box to exactly 9:16 for whatever screen this is
  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    const measure = () => {
      const availH = Math.max(200, el.clientHeight - CAPTION_SPACE);
      const w = Math.max(120, Math.min(el.clientWidth - 16, Math.floor((availH * 9) / 16)));
      setSize({ w, h: Math.round((w * 16) / 9) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Back to the first short whenever a filter changes
  useEffect(() => {
    setActive(0);
    if (feedRef.current) feedRef.current.scrollTo({ top: 0 });
  }, [classFilter, subjectFilter]);

  // Work out which short is on screen
  useEffect(() => {
    const root = feedRef.current;
    if (!root || visible.length === 0) return;
    slideRefs.current.length = visible.length;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index));
        });
      },
      { root, threshold: 0.6 }
    );
    slideRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [visible]);

  const goTo = useCallback((i) => {
    const el = feedRef.current;
    if (!el) return;
    const max = Math.round(el.scrollHeight / el.clientHeight) - 1;
    const target = Math.max(0, Math.min(i, max));
    el.scrollTo({ top: target * el.clientHeight, behavior: "smooth" });
  }, []);

  // Arrow keys on desktop
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); goTo(active + 1); }
      if (e.key === "ArrowUp") { e.preventDefault(); goTo(active - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  return (
    <div className="max-w-md mx-auto px-4 py-6" data-testid="shorts-page">
      <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Shorts</div>
      <h1 className="font-display text-3xl font-bold mt-1 mb-4">Learn in a minute.</h1>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {CLASS_FILTERS.map((f) => (
          <Chip
            key={f}
            label={f === "all" ? "All classes" : `Class ${f}`}
            selected={classFilter === f}
            onClick={() => setFilter("class", f)}
          />
        ))}
      </div>

      {subjects.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-3">
          <Chip label="All subjects" selected={subjectFilter === "all"} onClick={() => setFilter("subject", "all")} />
          {subjects.map((s) => (
            <Chip key={s} label={s} selected={subjectFilter === s} onClick={() => setFilter("subject", s)} />
          ))}
        </div>
      )}

      <div className="relative mt-2">
        <div
          ref={feedRef}
          className="overflow-y-scroll rounded-[24px] bg-[#1C1917] [&::-webkit-scrollbar]:hidden"
          style={{
            height: "calc(100dvh - 260px)",
            minHeight: 420,
            scrollSnapType: "y mandatory",
            overscrollBehavior: "contain",
            scrollbarWidth: "none",
          }}
        >
          {loading ? (
            <div className="h-full flex items-center justify-center text-sm text-white/70">Loading...</div>
          ) : visible.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-white/70 text-center px-8">
              No shorts here yet. New ones are added regularly.
            </div>
          ) : (
            visible.map((s, i) => (
              <div
                key={s.id}
                data-index={i}
                ref={(el) => (slideRefs.current[i] = el)}
                className="flex flex-col items-center justify-center gap-3 px-2"
                style={{ height: "100%", scrollSnapAlign: "start", scrollSnapStop: "always" }}
              >
                <ShortPlayer s={s} active={i === active} w={size.w} h={size.h} />
                <div className="text-center" style={{ width: size.w }}>
                  <div className="text-[10px] uppercase tracking-[0.15em] font-mono-em text-white/60">
                    Class {s.class_level} · {s.subject}
                  </div>
                  <div className="text-sm font-semibold text-white leading-snug line-clamp-2">{s.title}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {visible.length > 1 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
            <button
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous short"
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center disabled:opacity-30"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(active + 1)}
              disabled={active === visible.length - 1}
              aria-label="Next short"
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center disabled:opacity-30"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {visible.length > 0 && (
        <div className="text-center text-xs font-mono-em text-[#78716C] mt-3">
          {active + 1} / {visible.length}
        </div>
      )}
    </div>
  );
}
