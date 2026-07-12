import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Search as SearchIcon, FileText, Video, ClipboardList, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function TypeIcon({ t }) {
  if (t === "video") return <Video className="w-4 h-4" />;
  if (t === "notes") return <FileText className="w-4 h-4" />;
  if (t === "test") return <ClipboardList className="w-4 h-4" />;
  return <BookOpen className="w-4 h-4" />;
}


export default function Search() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [classId, setClassId] = useState(params.get("class") || "");
  const [subjectId, setSubjectId] = useState(params.get("subject") || "");
  const [type, setType] = useState(params.get("type") || "");
  const [results, setResults] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/catalog/classes"), api.get("/catalog/subjects")]).then(([c, s]) => {
      setClasses(c.data); setSubjects(s.data);
    });
  }, []);

  useEffect(() => {
    const p = { q };
    if (classId) p.class_id = classId;
    if (subjectId) p.subject_id = subjectId;
    if (type) p.type = type;
    api.get("/search", { params: p }).then((r) => setResults(r.data.results));
    setParams({ ...(q && { q }), ...(classId && { class: classId }), ...(subjectId && { subject: subjectId }), ...(type && { type }) });
  }, [q, classId, subjectId, type]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" data-testid="search-page">
      <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Search</div>
      <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-8">Find anything, instantly.</h1>

      <div className="flex items-center bg-white border border-[#E7E5E4] rounded-full pl-5 pr-2 py-2 bento-shadow mb-8">
        <SearchIcon className="w-5 h-5 text-[#78716C] mr-3" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search notes, chapters, PYQs…"
          data-testid="search-input"
          className="flex-1 outline-none bg-transparent"
          autoFocus
        />
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Filters sidebar */}
        <aside className="md:col-span-3 space-y-6" data-testid="search-filters">
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-5">
            <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-3">Class</div>
            <div className="space-y-2">
              <button onClick={() => setClassId("")} className={`w-full text-left text-sm py-1.5 px-2 rounded-lg ${!classId ? "bg-[#FDE68A]/60 text-[#7B1E1E] font-semibold" : "hover:bg-[#FAF9F6]"}`}>All classes</button>
              {classes.map((c) => (
                <button key={c.id} onClick={() => setClassId(c.id)} data-testid={`filter-class-${c.id}`} className={`w-full text-left text-sm py-1.5 px-2 rounded-lg ${classId === c.id ? "bg-[#FDE68A]/60 text-[#7B1E1E] font-semibold" : "hover:bg-[#FAF9F6]"}`}>{c.name}</button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-5">
            <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-3">Subject</div>
            <div className="space-y-2">
              <button onClick={() => setSubjectId("")} className={`w-full text-left text-sm py-1.5 px-2 rounded-lg ${!subjectId ? "bg-[#FDE68A]/60 text-[#7B1E1E] font-semibold" : "hover:bg-[#FAF9F6]"}`}>All subjects</button>
              {subjects.map((s) => (
                <button key={s.id} onClick={() => setSubjectId(s.id)} data-testid={`filter-subject-${s.id}`} className={`w-full text-left text-sm py-1.5 px-2 rounded-lg ${subjectId === s.id ? "bg-[#FDE68A]/60 text-[#7B1E1E] font-semibold" : "hover:bg-[#FAF9F6]"}`}>{s.name}</button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-5">
            <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-3">Type</div>
            <div className="space-y-2">
              {[{ id: "", label: "All" }, { id: "video", label: "Videos" }, { id: "notes", label: "Notes" }, { id: "test", label: "Tests" }].map((t) => (
                <button key={t.id} onClick={() => setType(t.id)} className={`w-full text-left text-sm py-1.5 px-2 rounded-lg ${type === t.id ? "bg-[#FDE68A]/60 text-[#7B1E1E] font-semibold" : "hover:bg-[#FAF9F6]"}`}>{t.label}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="md:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-[#78716C] font-mono-em">{results.length} result{results.length !== 1 && "s"}</div>
          </div>
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] divide-y divide-[#E7E5E4]" data-testid="search-results">
            {results.length === 0 && (
              <div className="p-10 text-center text-[#78716C]">No matches. Try a different search.</div>
            )}
            {results.map((r) => (
              <Link key={`${r.type}-${r.id}`} to={r.type === "chapter" ? `/chapter/${r.id}` : `/chapter/${r.chapter_id}`} className="flex items-center gap-4 p-5 hover:bg-[#FAF9F6] transition-colors" data-testid={`search-result-${r.id}`}>
                <div className="w-10 h-10 rounded-xl bg-[#FDE68A] flex items-center justify-center text-[#7B1E1E]"><TypeIcon t={r.type} /></div>
                <div className="flex-1">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-[#78716C] font-mono-em uppercase tracking-[0.15em] mt-0.5">{r.type}{r.difficulty ? ` · ${r.difficulty}` : ""}</div>
                </div>
                {r.difficulty && <Badge variant="outline" className="font-mono-em text-[10px]">{r.difficulty}</Badge>}
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
