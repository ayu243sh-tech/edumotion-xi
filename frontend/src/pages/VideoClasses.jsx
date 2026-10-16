import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

export default function VideoClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/catalog/classes")
      .then((r) => setClasses(r.data || []))
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" data-testid="video-classes-page">
      <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">01 — Video lectures</div>
      <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-8">Which class are you in?</h1>

      {loading ? (
        <div className="text-sm text-[#78716C]">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {classes.map((c, i) => (
            <Link
              key={c.id}
              to={`/videos/${c.id}`}
              className="group relative bg-white rounded-[20px] border border-[#E7E5E4] p-8 hover:-translate-y-1 transition-transform bento-shadow bento-shadow-hover overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20" style={{ background: c.color }} />
              <div className="text-xs font-mono-em uppercase tracking-[0.2em] text-[#78716C]">0{i + 1}</div>
              <div className="font-display text-3xl font-bold mt-4">{c.name}</div>
              <div className="text-sm text-[#78716C] mt-1">{c.tag}</div>
              <ArrowRight className="w-5 h-5 mt-6 text-[#7B1E1E] group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
