import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronUp, Play, Volume2, VolumeX, X } from "lucide-react";
import { api } from "@/lib/api";

const CLASS_FILTERS = ["all", "9", "10", "11", "12"];

const thumbUrl = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 text-xs font-semibold rounded-full px-3.5 py-1.5 backdrop-blur transition-colors ${
        selected ? "bg-white text-black" : "bg-black/40 text-white border border-white/25"
      }`}
    >
      {label}
    </button>
  );
}

// Fills the whole slide: the video box is sized so it always covers the screen (no black bars)
function ShortPlayer({ s, active, muted, box, playerRef }) {
  const w = Math.max(box.cw, (box.ch * 9) / 16);
  const h = (w * 16) / 9;
  const centered = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: w,
    height: h,
    transform: "translate(-50%, -50%)",
  };

  if (!active) {
    return s.youtube_id ? (
      <img src={thumbUrl(s.youtube_id)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
    ) : (
      <div className="absolute inset-0 bg-black" />
    );
  }

  if (s.video_url) {
    return (
      <video
        ref={playerRef}
        src={s.video_url}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted={muted}
        loop
        playsInline
      />
    );
  }

  const params = [
    "autoplay=1",
    `mute=${muted ? 1 : 0}`,
    "loop=1",
    `playlist=${s.youtube_id}`,
    "playsinline=1",
    "controls=0",
    "rel=0",
    "modestbranding=1",
    "iv_load_policy=3",
    "enablejsapi=1",
    `origin=${encodeURIComponent(window.location.origin)}`,
  ].join("&");

  return (
    <iframe
      ref={playerRef}
      key={s.id}
      style={centered}
      src={`https://www.youtube.com/embed/${s.youtube_id}?${params}`}
      title={s.title}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    />
  );
}

export default function Shorts() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const classFilter = searchParams.get("class") || "all";
  const subjectFilter = searchParams.get("subject") || "all";

  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [box, setBox] = useState({ cw: 360, ch: 640 });
  const feedRef = useRef(null);
  const slideRefs = useRef([]);
  const playerRef = useRef(null);

  // Lock the page behind the full-screen player
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

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

  // Measure the screen so the video can be sized to cover it
  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    const measure = () => setBox({ cw: el.clientWidth, ch: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setActive(0);
    if (feedRef.current) feedRef.current.scrollTo({ top: 0 });
  }, [classFilter, subjectFilter]);

  useEffect(() => { setPaused(false); }, [active]);

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

  const goTo = useCallback(
    (i) => {
      const el = feedRef.current;
      if (!el || visible.length === 0) return;
      const target = Math.max(0, Math.min(i, visible.length - 1));
      el.scrollTo({ top: target * el.clientHeight, behavior: "smooth" });
    },
    [visible.length]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); goTo(active + 1); }
      if (e.key === "ArrowUp") { e.preventDefault(); goTo(active - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  // Control the playing video (YouTube iframe or own MP4)
  const control = (action) => {
    const el = playerRef.current;
    if (!el) return;
    if (el.tagName === "IFRAME") {
      const func = { play: "playVideo", pause: "pauseVideo", mute: "mute", unmute: "unMute" }[action];
      if (el.contentWindow) {
        el.contentWindow.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
      }
    } else {
      if (action === "play") el.play();
      if (action === "pause") el.pause();
      if (action === "mute") el.muted = true;
      if (action === "unmute") el.muted = false;
    }
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    control(next ? "mute" : "unmute");
  };

  const togglePlay = () => {
    const next = !paused;
    setPaused(next);
    control(next ? "pause" : "play");
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex justify-center" data-testid="shorts-page">
      <div className="relative h-full w-full md:w-[calc(100vh*9/16)] md:max-w-full">
        {/* Filters floating over the video */}
        <div
          className="absolute top-0 inset-x-0 z-30 px-3 pb-6 bg-gradient-to-b from-black/70 to-transparent"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate("/")}
              aria-label="Close shorts"
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="font-display font-bold text-white text-lg">Shorts</div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
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
            <div className="flex gap-2 overflow-x-auto mt-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
              <Chip label="All subjects" selected={subjectFilter === "all"} onClick={() => setFilter("subject", "all")} />
              {subjects.map((s) => (
                <Chip key={s} label={s} selected={subjectFilter === s} onClick={() => setFilter("subject", s)} />
              ))}
            </div>
          )}
        </div>

        {/* The feed: one short per screen */}
        <div
          ref={feedRef}
          className="h-full w-full overflow-y-scroll [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "y mandatory", overscrollBehavior: "contain", scrollbarWidth: "none" }}
        >
          {loading ? (
            <div className="h-full flex items-center justify-center text-sm text-white/70">Loading...</div>
          ) : visible.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-white/70 text-center px-10">
              No shorts here yet. New ones are added regularly.
            </div>
          ) : (
            visible.map((s, i) => (
              <div
                key={s.id}
                data-index={i}
                ref={(el) => (slideRefs.current[i] = el)}
                className="relative w-full overflow-hidden bg-black"
                style={{ height: "100%", scrollSnapAlign: "start", scrollSnapStop: "always" }}
              >
                <ShortPlayer s={s} active={i === active} muted={muted} box={box} playerRef={playerRef} />

                {/* Catches taps and swipes so scrolling always works */}
                {i === active && <div className="absolute inset-0 z-10" onClick={togglePlay} />}
                {i === active && paused && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                )}

                {/* Title over the video */}
                <div
                  className="absolute inset-x-0 bottom-0 z-20 pointer-events-none px-4 pt-16 pr-20 bg-gradient-to-t from-black/80 to-transparent"
                  style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
                >
                  <div className="text-[10px] uppercase tracking-[0.15em] font-mono-em text-white/70">
                    Class {s.class_level} · {s.subject}
                  </div>
                  <div className="text-base font-semibold text-white leading-snug line-clamp-2 mt-1">{s.title}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Buttons on the right */}
        {visible.length > 0 && (
          <div
            className="absolute right-3 z-30 flex flex-col gap-3"
            style={{ bottom: "calc(env(safe-area-inset-bottom) + 28px)" }}
          >
            <button
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous short"
              className="hidden md:flex w-11 h-11 rounded-full bg-black/45 backdrop-blur items-center justify-center text-white disabled:opacity-30"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(active + 1)}
              disabled={active === visible.length - 1}
              aria-label="Next short"
              className="hidden md:flex w-11 h-11 rounded-full bg-black/45 backdrop-blur items-center justify-center text-white disabled:opacity-30"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Turn sound on" : "Turn sound off"}
              className="w-11 h-11 rounded-full bg-black/45 backdrop-blur flex items-center justify-center text-white"
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
