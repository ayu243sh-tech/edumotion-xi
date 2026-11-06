import { useState } from "react";
import { TEACHERS } from "@/lib/teachersData";

const FILTERS = ["all", "6", "7", "8", "9", "10", "11", "12"];

function Avatar({ t }) {
  const [broken, setBroken] = useState(false);
  const initials = t.name
    .replace(/^(Mr|Mrs|Ms|Miss)\.?\s+/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const box = "w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shrink-0 overflow-hidden";

  if (broken) {
    return (
      <div className={`${box} bg-gradient-to-br from-[#7B1E1E] to-[#3B0D0D] text-[#F5B400] font-display text-3xl font-bold flex items-center justify-center`}>
        {initials}
      </div>
    );
  }
  return (
    <img
      src={t.photo || `/teachers/${t.id}.jpg`}
      alt={t.name}
      loading="lazy"
      onError={() => setBroken(true)}
      className={`${box} object-cover border border-[#E7E5E4]`}
    />
  );
}

export default function Teachers() {
  const [filter, setFilter] = useState("all");
  const list = TEACHERS.filter((t) => filter === "all" || t.classes.includes(filter));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10" data-testid="teachers-page">
      <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">About teachers</div>
      <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">Meet your teachers.</h1>

      <div className="flex flex-wrap gap-2 mt-6 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm font-semibold rounded-full px-4 py-2 transition-colors ${
              filter === f ? "bg-[#7B1E1E] text-white" : "bg-white border border-[#E7E5E4] hover:border-[#7B1E1E]"
            }`}
          >
            {f === "all" ? "All teachers" : `Class ${f}`}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-10 text-center text-[#78716C]">
          No teachers listed for this class yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {list.map((t) => (
            <div key={t.id} className="bg-white rounded-[20px] border border-[#E7E5E4] p-5 sm:p-6 bento-shadow">
              <div className="flex gap-4 sm:gap-5 items-start">
                <Avatar t={t} />
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-bold leading-snug">{t.name}</h2>
                  {t.role && <div className="text-sm text-[#7B1E1E] font-semibold mt-0.5">{t.role}</div>}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {t.subjects.map((s) => (
                      <span key={s} className="text-xs font-semibold bg-[#FDE68A]/60 text-[#92400E] rounded-full px-2.5 py-1">{s}</span>
                    ))}
                  </div>
                  <div className="text-xs text-[#78716C] mt-2">
                    {t.classes.length > 1 ? "Classes" : "Class"} {t.classes.join(", ")}
                  </div>
                </div>
              </div>

              {(t.qualification || t.experience) && (
                <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
                  {t.qualification && (
                    <div className="bg-[#FAF9F6] rounded-xl p-3">
                      <div className="text-[10px] uppercase tracking-[0.15em] font-mono-em text-[#78716C]">Qualification</div>
                      <div className="font-medium mt-0.5">{t.qualification}</div>
                    </div>
                  )}
                  {t.experience && (
                    <div className="bg-[#FAF9F6] rounded-xl p-3">
                      <div className="text-[10px] uppercase tracking-[0.15em] font-mono-em text-[#78716C]">Experience</div>
                      <div className="font-medium mt-0.5">{t.experience}</div>
                    </div>
                  )}
                </div>
              )}

              <p className="text-sm text-[#57534E] leading-relaxed mt-4">{t.about || "Profile coming soon."}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
