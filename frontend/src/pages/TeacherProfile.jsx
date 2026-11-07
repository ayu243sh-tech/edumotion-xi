import { Link, useParams } from "react-router-dom";
import { Quote } from "lucide-react";
import { TEACHERS } from "@/lib/teachersData";
import TeacherAvatar from "@/components/TeacherAvatar";

const CARD = "bg-white rounded-[20px] border border-[#E7E5E4] bento-shadow";
const Eyebrow = ({ children }) => (
  <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-4">{children}</div>
);

export default function TeacherProfile() {
  const { id } = useParams();
  const t = TEACHERS.find((x) => x.id === id);

  if (!t) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center text-[#78716C]">
        We couldn't find this teacher. <Link to="/teachers" className="text-[#7B1E1E] font-semibold">Back to teachers</Link>
      </div>
    );
  }

  const info = [
    ["Full Name", t.fullName || t.name],
    ["Age", t.age],
    ["Qualification", t.qualification],
    ["Experience", t.experience],
    ["Teaching Level", t.teachingLevel],
    ["Teaching Medium", t.medium],
    ["Teaching Mode", t.mode],
    ["Location", t.location],
  ].filter(([, v]) => v);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10" data-testid="teacher-profile-page">
      <Link to="/teachers" className="text-sm text-[#78716C] hover:text-[#7B1E1E]">← All teachers</Link>

      {/* Header: photo at the top-left */}
      <div className={`${CARD} p-6 md:p-8 mt-4 flex gap-5 sm:gap-7 items-start`}>
        <TeacherAvatar t={t} size="lg" />
        <div className="min-w-0">
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">{t.fullName || t.name}</h1>
          {t.headline && <div className="text-[#7B1E1E] font-semibold mt-1.5">{t.headline}</div>}
          <div className="flex flex-wrap gap-2 mt-4">
            <Link to="/batches" className="bg-[#7B1E1E] hover:bg-[#611717] text-white text-sm font-semibold rounded-full px-5 py-2.5">See batches</Link>
          </div>
        </div>
      </div>

      {info.length > 0 && (
        <div className={`${CARD} p-6 md:p-8 mt-6`}>
          <Eyebrow>Profile detail</Eyebrow>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {info.map(([label, value]) => (
              <div key={label} className="border-b border-[#F0EEEC] pb-3">
                <div className="text-[10px] uppercase tracking-[0.15em] font-mono-em text-[#78716C]">{label}</div>
                <div className="font-medium mt-0.5">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {t.background && t.background.length > 0 && (
        <div className={`${CARD} p-6 md:p-8 mt-6`}>
          <Eyebrow>Academic background</Eyebrow>
          <ul className="space-y-2.5">
            {t.background.map((b) => (
              <li key={b} className="flex gap-3 text-[15px] text-[#44403C]">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7B1E1E] shrink-0" /> {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={`${CARD} p-6 md:p-8 mt-6`}>
        <Eyebrow>Subjects offered</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {t.subjects.map((s) => (
            <span key={s} className="text-sm font-semibold bg-[#FDE68A]/60 text-[#92400E] rounded-full px-4 py-1.5">{s}</span>
          ))}
        </div>
      </div>

      {t.aboutParas && t.aboutParas.length > 0 && (
        <div className={`${CARD} p-6 md:p-8 mt-6`}>
          <Eyebrow>About the teacher</Eyebrow>
          <div className="space-y-4 text-[15px] leading-relaxed text-[#44403C]">
            {t.aboutParas.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
      )}

      {t.philosophy && (
        <div className="mt-6 rounded-[20px] bg-[#7B1E1E] text-white p-6 md:p-8">
          <Quote className="w-7 h-7 text-[#F5B400]" />
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#F5B400] mt-3">Teaching philosophy</div>
          <p className="font-display text-xl md:text-2xl font-semibold leading-snug mt-2">"{t.philosophy}"</p>
        </div>
      )}
    </div>
  );
}
