import { useEffect, useRef, useState } from "react";
import { Download, Clock, Check } from "lucide-react";

export default function ClassNotes({ classId, title, start, status }) {
  const key = `edumotion_notes_${classId}`;
  const [text, setText] = useState(() => {
    try { return localStorage.getItem(key) || ""; } catch { return ""; }
  });
  const [saved, setSaved] = useState(true);
  const taRef = useRef(null);

  useEffect(() => {
    setSaved(false);
    const t = setTimeout(() => {
      try { localStorage.setItem(key, text); } catch {}
      setSaved(true);
    }, 600);
    return () => clearTimeout(t);
  }, [text, key]);

  const addStamp = () => {
    const secs = Math.max(0, Math.floor((Date.now() - new Date(start).getTime()) / 1000));
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = `[${pad(Math.floor(secs / 60))}:${pad(secs % 60)}] `;
    setText((prev) => (prev && !prev.endsWith("\n") ? prev + "\n" : prev) + stamp);
    setTimeout(() => taRef.current && taRef.current.focus(), 0);
  };

  const download = () => {
    const blob = new Blob([`${title}\n\n${text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]+/gi, "-")}-notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-5 bento-shadow" data-testid="class-notes">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">My notes</div>
          <div className="text-xs text-[#78716C] mt-0.5 flex items-center gap-1">
            {saved ? <><Check className="w-3 h-3 text-[#0F766E]" /> Saved on this device</> : "Saving..."}
          </div>
        </div>
        <div className="flex gap-2">
          {status === "live" && (
            <button
              onClick={addStamp}
              className="flex items-center gap-1.5 text-xs font-semibold border border-[#E7E5E4] hover:border-[#7B1E1E] rounded-full px-3 py-1.5"
            >
              <Clock className="w-3.5 h-3.5" /> Add timestamp
            </button>
          )}
          <button
            onClick={download}
            disabled={!text}
            className="flex items-center gap-1.5 text-xs font-semibold bg-[#FDE68A] hover:bg-[#F5B400] disabled:opacity-50 rounded-full px-3 py-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>
      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type important points while the class is going on..."
        rows={8}
        className="w-full border border-[#E7E5E4] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#7B1E1E] resize-y"
      />
    </div>
  );
}
