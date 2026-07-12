import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, Video, ClipboardList, FileText, CalendarDays, Bot, Search as SearchIcon,
  Play, ArrowRight, Quote, Star, Sparkles, FlaskConical, Sigma, Globe2, Languages, Cpu,
} from "lucide-react";

const QUICK_ACCESS = [
  { id: "notes", label: "Notes", icon: BookOpen, accent: "#7B1E1E", bg: "#FDE68A" },
  { id: "videos", label: "Video Lectures", icon: Video, accent: "#962A2A", bg: "#FEF3C7" },
  { id: "tests", label: "Chapter Tests", icon: ClipboardList, accent: "#0F766E", bg: "#CCFBF1" },
  { id: "pyqs", label: "PYQs", icon: FileText, accent: "#B45309", bg: "#FFEDD5" },
  { id: "planner", label: "Study Planner", icon: CalendarDays, accent: "#1E40AF", bg: "#DBEAFE" },
  { id: "ai", label: "AI Doubt Solver", icon: Bot, accent: "#7B1E1E", bg: "#F5E6E6" },
];

const SUBJECT_ICONS = { science: FlaskConical, mathematics: Sigma, "social-science": Globe2, english: BookOpen, hindi: Languages, computer: Cpu };

export default function Home() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [trending, setTrending] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [q, setQ] = useState("");
  const [visitCount, setVisitCount] = useState(null);

  useEffect(() => {
    api.post("/visits").then((r) => setVisitCount(r.data.today)).catch(() => {});
  }, []);

  useEffect(() => {
    Promise.all([
      api.get("/catalog/classes"),
      api.get("/catalog/subjects"),
      api.get("/catalog/chapters", { params: { trending: true } }),
      api.get("/catalog/latest-uploads"),
      api.get("/catalog/reviews"),
    ]).then(([c, s, t, u, r]) => {
      setClasses(c.data); setSubjects(s.data); setTrending(t.data); setUploads(u.data); setReviews(r.data);
    });
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 fade-up">
            <div className="inline-flex items-center gap-2 bg-[#FDE68A]/70 border border-[#F5B400]/40 rounded-full px-3 py-1 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#7B1E1E]" />
              <span className="text-xs font-mono-em uppercase tracking-[0.2em] text-[#7B1E1E]">Classes 9 – 12 · CBSE</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight">
              Learn smart.<br />
              <span className="text-[#7B1E1E]">Score</span> <span className="italic text-[#B48200]">better.</span>
            </h1>
            <p className="mt-6 text-lg text-[#78716C] max-w-xl leading-relaxed">
              A calm, focused study home — notes, video lectures, PYQs, mind maps, and an AI doubt solver. No clutter. No noise. Just learning that sticks.
            </p>

            <form onSubmit={onSearch} className="mt-8 max-w-xl" data-testid="hero-search-form">
              <div className="flex items-center bg-white border border-[#E7E5E4] rounded-full pl-5 pr-2 py-2 bento-shadow focus-within:border-[#7B1E1E] transition">
                <SearchIcon className="w-5 h-5 text-[#78716C] mr-3" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search notes, chapters, PYQs…"
                  data-testid="hero-search-input"
                  className="flex-1 outline-none text-base bg-transparent"
                />
                <button type="submit" data-testid="hero-search-submit" className="bg-[#7B1E1E] hover:bg-[#631818] text-white rounded-full px-5 py-2.5 text-sm font-semibold">Search</button>
              </div>
            </form>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => navigate("/dashboard")} data-testid="cta-start-learning" className="bg-[#7B1E1E] hover:bg-[#631818] text-white rounded-full px-7 py-6 text-base">
                <BookOpen className="w-4 h-4 mr-2" /> Start Learning
              </Button>
              <Button onClick={() => navigate("/search?type=video")} data-testid="cta-watch-videos" variant="outline" className="rounded-full px-7 py-6 text-base border-[#E7E5E4] hover:border-[#7B1E1E] hover:text-[#7B1E1E]">
                <Play className="w-4 h-4 mr-2" /> Watch Videos
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-[#78716C]">
              <div className="flex -space-x-2">
                {[5940722, 7983621, 3771807].map((id) => (
                  <img key={id} src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?w=80&h=80&fit=crop`} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <div><span className="font-bold text-[#292524]" data-testid="visitor-count">{visitCount ?? "…"}</span> student{visitCount === 1 ? "" : "s"} learning today</div>
            </div>
          </div>

          {/* Illustration block */}
          <div className="md:col-span-5 fade-up">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#FDE68A]/40 rounded-[40px] -rotate-2" />
              <div className="relative bg-white rounded-[28px] overflow-hidden border border-[#E7E5E4] bento-shadow">
                <img src="https://images.pexels.com/photos/6549913/pexels-photo-6549913.jpeg?w=900" alt="Students studying" className="w-full h-[420px] object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 text-xs font-mono-em uppercase tracking-[0.15em]">📚 Today&apos;s pick</div>
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg">
                  <div className="text-xs text-[#78716C] font-mono-em uppercase tracking-[0.15em]">Continue with</div>
                  <div className="font-display font-semibold text-lg mt-1">Light – Reflection & Refraction</div>
                  <Progress value={62} className="mt-2 h-1.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">01 — Quick Access</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Everything you need, one click away.</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {QUICK_ACCESS.map(({ id, label, icon: Icon, accent, bg }) => (
            <button key={id} onClick={() => navigate(id === "ai" ? "/" : `/search?type=${id}`)} data-testid={`quick-access-${id}`} className="group bg-white rounded-[20px] border border-[#E7E5E4] p-6 text-left hover:-translate-y-1 transition-transform bento-shadow bento-shadow-hover">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: bg }}>
                <Icon className="w-6 h-6" style={{ color: accent }} strokeWidth={1.5} />
              </div>
              <div className="font-display font-semibold text-lg">{label}</div>
              <div className="text-xs text-[#78716C] font-mono-em mt-1 uppercase tracking-[0.15em]">Open →</div>
            </button>
          ))}
        </div>
      </section>

      {/* CHOOSE CLASS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">02 — Choose your class</div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-8">Where would you like to begin?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {classes.map((c, i) => (
            <Link key={c.id} to={`/class/${c.id}`} data-testid={`class-card-${c.id}`} className="group relative bg-white rounded-[20px] border border-[#E7E5E4] p-8 hover:-translate-y-1 transition-transform bento-shadow bento-shadow-hover overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20" style={{ background: c.color }} />
              <div className="text-xs font-mono-em uppercase tracking-[0.2em] text-[#78716C]">0{i + 1}</div>
              <div className="font-display text-4xl font-bold mt-4 text-[#292524]">{c.name}</div>
              <div className="text-sm text-[#78716C] mt-1">{c.tag}</div>
              <ArrowRight className="w-5 h-5 mt-6 text-[#7B1E1E] group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">03 — Subjects</div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-8">Pick a subject, dive deep.</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {subjects.map((s) => {
            const Icon = SUBJECT_ICONS[s.id] || BookOpen;
            return (
              <button key={s.id} onClick={() => navigate(`/search?subject=${s.id}`)} data-testid={`subject-card-${s.id}`} className="bg-white rounded-[20px] border border-[#E7E5E4] p-5 hover:border-[#7B1E1E] transition-colors text-left">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} strokeWidth={1.5} />
                </div>
                <div className="font-display font-semibold mt-3">{s.name}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* TRENDING */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">04 — Trending Chapters</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">What learners are mastering this week.</h2>
          </div>
          <Link to="/search" className="hidden md:flex items-center gap-1 text-sm font-medium text-[#7B1E1E] hover:underline">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {trending.map((ch) => (
            <Link key={ch.id} to={`/chapter/${ch.id}`} data-testid={`trending-${ch.id}`} className="bg-white rounded-[20px] border border-[#E7E5E4] overflow-hidden hover:-translate-y-1 transition-transform bento-shadow bento-shadow-hover">
              <div className="relative h-44">
                <img src={ch.thumbnail} alt={ch.name} className="w-full h-full object-cover" />
                <Badge className="absolute top-3 left-3 bg-white text-[#292524] hover:bg-white font-mono-em text-[10px] uppercase tracking-[0.15em]">{ch.difficulty}</Badge>
              </div>
              <div className="p-5">
                <div className="text-xs text-[#78716C] font-mono-em uppercase tracking-[0.15em]">{ch.class_id.replace("-", " ")} · {ch.duration}</div>
                <div className="font-display font-semibold text-lg mt-1.5 line-clamp-2">{ch.name}</div>
                <Progress value={Math.floor(Math.random() * 60) + 20} className="mt-4 h-1.5" />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-[#7B1E1E] font-semibold">Start →</span>
                  <Play className="w-4 h-4 text-[#7B1E1E]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST UPLOADS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">05 — Latest Uploads</div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-8">Fresh off the press.</h2>
        <div className="bg-white rounded-[20px] border border-[#E7E5E4] divide-y divide-[#E7E5E4]" data-testid="latest-uploads">
          {uploads.map((u) => (
            <div key={u.id} className="flex items-center gap-4 p-5 hover:bg-[#FAF9F6] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FDE68A] flex items-center justify-center font-mono-em text-xs uppercase">
                {u.type === "notes" && <BookOpen className="w-4 h-4 text-[#7B1E1E]" />}
                {u.type === "video" && <Video className="w-4 h-4 text-[#7B1E1E]" />}
                {u.type === "test" && <ClipboardList className="w-4 h-4 text-[#7B1E1E]" />}
              </div>
              <div className="flex-1">
                <div className="font-medium">{u.title}</div>
                <div className="text-xs text-[#78716C] font-mono-em uppercase tracking-[0.15em] mt-0.5">{u.type} · {u.date}</div>
              </div>
              <Link to={`/chapter/${u.chapter_id}`} className="text-sm text-[#7B1E1E] font-medium hover:underline">Open →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">06 — Student Reviews</div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-8">Learners, in their own words.</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 bento-shadow flex gap-5">
              <img src={r.picture} alt={r.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <Quote className="w-6 h-6 text-[#F5B400] mb-2" />
                <p className="text-[#292524] leading-relaxed">{r.text}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-[#78716C] font-mono-em uppercase tracking-[0.15em]">{r.class}</div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: r.rating }).map((_, k) => <Star key={`${r.name}-star-${k}`} className="w-4 h-4 fill-[#F5B400] text-[#F5B400]" />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-[#7B1E1E] text-white rounded-[28px] p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#F5B400]/20" />
          <div className="relative max-w-2xl">
            <div className="text-xs uppercase tracking-[0.3em] font-mono-em text-[#F5B400]">Ready to begin</div>
            <h3 className="font-display text-4xl md:text-5xl font-bold mt-3">Build a streak. See your scores climb.</h3>
            <p className="text-white/80 mt-4 text-lg">Track progress, earn badges, and never lose your study rhythm.</p>
            <Button onClick={() => navigate("/dashboard")} data-testid="home-cta-dashboard" className="mt-6 bg-[#F5B400] hover:bg-[#D99E00] text-[#292524] rounded-full px-8 py-6 text-base font-semibold">
              Go to my dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
