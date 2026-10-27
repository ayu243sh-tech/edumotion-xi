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
  const multi = active.length > 1;

  return (
    <div className="max-w-[1800px] mx-auto sm:px-4 lg:px-6 py-4 sm:py-6" data-testid="video-lecture-page">
      <div className="px-4 sm:px-0">
        <Link
          to={`/videos/${chapter.class_id}/${chapter.subject_id}`}
          className="text-sm text-[#78716C] hover:text-[#7B1E1E]"
        >
          ← Back to chapters
        </Link>

        <div className="mt-3 mb-4">
          <div className="text-xs uppercase tracking-[0.15em] font-mono-em text-[#78716C]">Video lecture</div>
          <h1 className="font-display text-xl md:text-3xl font-bold mt-1">{chapter.name}</h1>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {LANGS.map((l) => {
            const count = lectures[l.id].length;
            const disabled = count === 0;
            const selected = lang === l.id;
            return (
              <button
                key={l.id}
                disabled={disabled}
                onClick={() => setSearchParams({ lang: l.id })}
                className={`text-left rounded-[16px] border px-4 py-3 transition-all ${
                  disabled
                    ? "bg-[#FAF9F6] border-[#E7E5E4] opacity-60 cursor-not-allowed"
                    : selected
                    ? "bg-[#7B1E1E] border-[#7B1E1E] text-white"
                    : "bg-white border-[#E7E5E4] hover:border-[#7B1E1E]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${selected ? "bg-white/15" : "bg-[#FDE68A]"}`}>
                    <Languages className={`w-4 h-4 ${selected ? "text-white" : "text-[#7B1E1E]"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-sm md:text-base leading-tight truncate">{l.label}</div>
                    <div className={`text-[11px] mt-0.5 truncate ${selected ? "text-white/80" : "text-[#78716C]"}`}>
                      {disabled ? "Coming soon" : `${l.sub} · ${count} ${count > 1 ? "parts" : "video"}`}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {!lang ? (
        <div className="mx-4 sm:mx-0 bg-white rounded-[20px] border border-[#E7E5E4] p-10 text-center text-[#78716C]">
          Choose a language above to start watching.
        </div>
      ) : !current ? (
        <div className="mx-4 sm:mx-0 bg-white rounded-[20px] border border-[#E7E5E4] p-10 text-center text-[#78716C]">
          This lecture isn't available yet.
        </div>
      ) : (
        <div className={multi ? "xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-5" : ""}>
          <div>
            {/* Edge to edge on phones, rounded on bigger screens */}
            <div className="aspect-video bg-black sm:rounded-[20px] overflow-hidden">
              <iframe
                key={current.youtube_id}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${current.youtube_id}?rel=0&modestbranding=1&playsinline=1`}
                title={current.title}
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
            <div className="px-4 sm:px-0 font-display font-semibold text-lg mt-3">{current.title}</div>
          </div>

          {multi && (
            <div className="px-4 sm:px-0 mt-4 xl:mt-0">
              <div className="bg-white rounded-[20px] border border-[#E7E5E4] divide-y divide-[#E7E5E4] overflow-hidden xl:max-h-[75vh] xl:overflow-y-auto">
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
