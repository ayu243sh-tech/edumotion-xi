export default function StatusPill({ status }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-[#DC2626] rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="text-[10px] font-bold text-[#92400E] bg-[#FDE68A] rounded-full px-2.5 py-1">
        UPCOMING
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold text-[#57534E] bg-[#F5F5F4] rounded-full px-2.5 py-1">
      RECORDING
    </span>
  );
}
