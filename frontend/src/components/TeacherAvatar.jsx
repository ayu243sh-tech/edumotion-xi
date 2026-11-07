import { useState } from "react";

const SIZES = {
  md: "w-24 h-24 sm:w-32 sm:h-32",
  lg: "w-28 h-28 sm:w-40 sm:h-40",
};

export default function TeacherAvatar({ t, size = "md" }) {
  const [broken, setBroken] = useState(false);
  const initials = t.name
    .replace(/^(Mr|Mrs|Ms|Miss)\.?\s+/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const box = `${SIZES[size] || SIZES.md} rounded-2xl shrink-0 overflow-hidden`;

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
