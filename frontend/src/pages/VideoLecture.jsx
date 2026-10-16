import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Languages } from "lucide-react";
import { api } from "@/lib/api";

const LANGS = [
  { id: "hindi", label: "Hindi Lecture", sub: "हिन्दी में समझें" },
  { id: "english", label: "English Lecture", sub: "Learn in English" },
];

export default function VideoLecture() {
  const { chapterId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = searchParams.get("lang");

  const [chapter, setChapter] = useState(null);
  const [lectures, setLectures] = useState({ hindi: [], english: [] });
  const [error, setError] = useState(false);
  const [part, setPart] = useState(0);

  useEffect(() => {
    Promise.all([api.get(`/catalog/chapters/${chapterId}`), api.get(`/videos/${chapterId}`)])
      .then(([c, v]) => {
        setChapter(c.data);
        setLectures({ hindi: v.data.hindi || [], english: v.data.english || [] });
      })
      .catch(() => setError(true));
  }, [chapterId]);

  useEffect(() => { setPart(0); }, [lang]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center text-[#78716C]">
        Couldn't load this lecture. <Link to="/videos" className="text-[#7B1E1E] font-semibold">Back to video lectures</Link>
      </div>
    );
  }
  if (!chapter) return null;

  const active = lang && lectures[lang] ? lectures[lang] : [];
  const current = active[part];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8" data-testid="video-lecture-page">
      <Link
        to={`/videos/${chapter.class_id}/${chapter.subject_id}`}
        className="text-sm text-[#78716C] hover:text-[#7B1E1E]"
      >
        ← Back to chapters
      </Link>

      <div className="mt-4 mb-6">
        <div className="text-xs uppercase tracking-[0.15em] font-mono-em text-[#78716C]">Video lecture</div>
        <h1 className="font-display text-2xl md:text-3xl font-bold mt-1">{chapter.name}</h1>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {LANGS.map((l) => {
          const count = lectures[l.id].length;
          const disabled = count === 0;
          const selected = lang === l.id;
          return (
            <button
              key={l.id}
              disabled={disabled}
              onClick={() => setSearchParams({ lang: l.id })}
              className={`text-left rounded-[20px] border p-6 transition-all ${
                disabled
                  ? "bg-[#FAF9F6] border-[#E7E5E4] opacity-60 cursor-not-allowed"
                  : selected
                  ? "bg-[#7B1E1E] border-[#7B1E1E] text-white bento-shadow"
                  : "bg-white border-[#E7E5E4] hover:border-[#7B1E1E] hover:-translate-y-0.5 transition-transform bento-shadow"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? "bg-white/15" : "bg-[#FDE68A]"}`}>
                  <Languages className={`w-5 h-5 ${selected ? "text-white" : "text-[#7B1E1E]"}`} />
                </div>
                <div>
                  <div className="font-display font-bold text-lg leading-tight">{l.label}</div>
                  <div className={`text-xs mt-0.5 ${selected ? "text-white/80" : "text-[#78716C]"}`}>
                    {disabled ? "Coming soon" : `${l.sub} · ${count} ${count > 1 ? "parts" : "video"}`}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {!lang ? (
        <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-10 text-center text-[#78716C]">
          Choose a language above to start watching.
        </div>
      ) : !current ? (
        <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-10 text-center text-[#78716C]">
          This lecture isn't available yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-12 gap-5">
          <div className={active.length > 1 ? "md:col-span-8" : "md:col-span-12"}>
            <div className="aspect-video bg-black rounded-[20px] overflow-hidden border border-[#E7E5E4]">
              <iframe
                key={current.youtube_id}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${current.youtube_id}?rel=0`}
                title={current.title}
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
            <div className="font-display font-semibold mt-3">{current.title}</div>
          </div>

          {active.length > 1 && (
            <div className="md:col-span-4">
              <div className="bg-white rounded-[20px] border border-[#E7E5E4] divide-y divide-[#E7E5E4] overflow-hidden">
                {active.map((p, i) => (
                  <button
                    key={p.youtube_id}
                    onClick={() => setPart(i)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      i === part ? "bg-[#FDE68A]/60 font-semibold text-[#7B1E1E]" : "hover:bg-[#FAF9F6]"
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
