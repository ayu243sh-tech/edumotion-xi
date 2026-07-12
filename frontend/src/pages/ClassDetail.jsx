import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { FlaskConical, Sigma, Globe2, BookOpen, Languages, Cpu, ArrowRight } from "lucide-react";

const ICONS = { science: FlaskConical, mathematics: Sigma, "social-science": Globe2, english: BookOpen, hindi: Languages, computer: Cpu };

export default function ClassDetail() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [klass, setKlass] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/catalog/classes"),
      api.get("/catalog/subjects"),{params : { class_id: classId } })
      api.get("/catalog/chapters", { params: { class_id: classId } }),
    ]).then(([c, s, ch]) => {
      setKlass(c.data.find((x) => x.id === classId));
      setSubjects(s.data);
      setChapters(ch.data);
    });
  }, [classId]);

  if (!klass) return null;

  const chaptersBySubject = subjects.map((s) => ({ ...s, chapters: chapters.filter((c) => c.subject_id === s.id) }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" data-testid="class-detail-page">
      <Link to="/" className="text-sm text-[#78716C] hover:text-[#7B1E1E]">← Back home</Link>
      <div className="mt-4">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">{klass.tag}</div>
        <h1 className="font-display text-5xl md:text-6xl font-bold mt-2">{klass.name}</h1>
        <p className="text-[#78716C] mt-3 max-w-2xl">Choose a subject to view its chapters, notes, videos and tests.</p>
      </div>

      <div className="mt-10 space-y-10">
        {chaptersBySubject.map((s) => {
          const Icon = ICONS[s.id] || BookOpen;
          return (
            <div key={s.id} data-testid={`subject-section-${s.id}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-2xl font-bold">{s.name}</h2>
                <span className="text-xs font-mono-em text-[#78716C] uppercase tracking-[0.15em]">{s.chapters.length} chapters</span>
              </div>
              {s.chapters.length === 0 ? (
                <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 text-sm text-[#78716C]">More chapters coming soon.</div>
              ) : (
                <div className="grid md:grid-cols-3 gap-5">
                  {s.chapters.map((ch) => (
                    <Link key={ch.id} to={`/chapter/${ch.id}`} className="bg-white rounded-[20px] border border-[#E7E5E4] overflow-hidden hover:-translate-y-1 transition-transform bento-shadow bento-shadow-hover" data-testid={`chapter-card-${ch.id}`}>
                      <img src={ch.thumbnail} alt="" className="w-full h-36 object-cover" />
                      <div className="p-5">
                        <div className="text-xs font-mono-em text-[#78716C] uppercase tracking-[0.15em]">{ch.difficulty} · {ch.duration}</div>
                        <div className="font-display font-semibold text-lg mt-1.5">{ch.name}</div>
                        <div className="mt-3 inline-flex items-center text-[#7B1E1E] text-sm font-semibold">Open <ArrowRight className="w-4 h-4 ml-1"/></div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
