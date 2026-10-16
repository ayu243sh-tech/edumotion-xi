import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Play } from "lucide-react";
import { api } from "@/lib/api";

const LANG_LABEL = { hindi: "Hindi", english: "English" };

export default function VideoChapters() {
  const { classId, subjectId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [available, setAvailable] = useState({});
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/catalog/chapters", { params: { class_id: classId, subject_id: subjectId } }),
      api.get("/videos/available"),
      api.get("/catalog/subjects", { params: { class_id: classId } }),
    ])
      .then(([ch, av, su]) => {
        setChapters(ch.data || []);
        setAvailable(av.data || {});
        const found = (su.data || []).find((s) => s.id === subjectId);
        setSubjectName(found ? found.name : "");
      })
      .catch(() => setChapters([]))
      .finally(() => setLoading(false));
  }, [classId, subjectId]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to={`/videos/${classId}`} className="text-sm text-[#78716C] hover:text-[#7B1E1E]">← Back to subjects</Link>
      <div className="mt-4 mb-8">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">03 — {subjectName}</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">Pick a chapter.</h1>
      </div>

      {loading ? (
        <div className="text-sm text-[#78716C]">Loading...</div>
      ) : chapters.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-10 text-center text-[#78716C]">
          No chapters here yet. More coming soon.
        </div>
      ) : (
        <div className="space-y-2">
          {chapters.map((ch) => {
            const langs = available[ch.id] || [];
            const hasVideo = langs.length > 0;
            const row = (
              <div
                className={`flex items-center justify-between gap-3 bg-white rounded-[16px] border border-[#E7E5E4] px-5 py-4 ${
                  hasVideo ? "hover:border-[#7B1E1E] transition-colors" : "opacity-60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#FDE68A] flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 text-[#7B1E1E]" />
                  </div>
                  <span className="font-medium text-sm truncate">{ch.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {hasVideo ? (
                    <>
                      {langs.map((l) => (
                        <span key={l} className="text-[10px] font-bold bg-[#CCFBF1] text-[#0F766E] rounded-full px-2 py-1">
                          {LANG_LABEL[l]}
                        </span>
                      ))}
                      <ChevronRight className="w-4 h-4 text-[#7B1E1E]" />
                    </>
                  ) : (
                    <span className="text-[10px] font-bold bg-[#F5F5F4] text-[#78716C] rounded-full px-2 py-1">
                      COMING SOON
                    </span>
                  )}
                </div>
              </div>
            );
            return hasVideo ? (
              <Link key={ch.id} to={`/video-lecture/${ch.id}`}>{row}</Link>
            ) : (
              <div key={ch.id}>{row}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
