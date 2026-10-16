import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { api } from "@/lib/api";

export default function VideoSubjects() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/catalog/subjects", { params: { class_id: classId } }),
      api.get("/catalog/classes"),
    ])
      .then(([s, c]) => {
        setSubjects(s.data || []);
        const found = (c.data || []).find((x) => x.id === classId);
        setClassName(found ? found.name : "");
      })
      .catch(() => setSubjects([]))
      .finally(() => setLoading(false));
  }, [classId]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link to="/videos" className="text-sm text-[#78716C] hover:text-[#7B1E1E]">← Back</Link>
      <div className="mt-4 mb-8">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">02 — {className}</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">Pick a subject.</h1>
      </div>

      {loading ? (
        <div className="text-sm text-[#78716C]">Loading...</div>
      ) : subjects.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-10 text-center text-[#78716C]">
          No subjects found for this class yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((s) => (
            <Link
              key={s.id}
              to={`/videos/${classId}/${s.id}`}
              className="bg-white rounded-[20px] border border-[#E7E5E4] p-5 hover:-translate-y-1 transition-transform bento-shadow bento-shadow-hover"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <BookOpen className="w-5 h-5" style={{ color: s.color }} strokeWidth={1.5} />
              </div>
              <div className="font-display font-semibold mt-3">{s.name}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
