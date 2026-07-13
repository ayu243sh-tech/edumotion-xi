import { useState } from "react";
import { Sparkles, X } from "lucide-react";

export default function AIChatFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        data-testid="ai-fab-button"
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 bg-[#7B1E1E] hover:bg-[#631818] text-white pl-4 pr-5 py-3 rounded-full shadow-[0_20px_40px_rgba(123,30,30,0.25)] transition-transform hover:-translate-y-0.5"
      >
        <Sparkles className="w-5 h-5 text-[#F5B400]" />
        <span className="text-sm font-semibold">Ask Edumotion AI</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-end md:justify-end" data-testid="ai-chat-panel">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white w-full md:w-[420px] md:m-6 rounded-t-[20px] md:rounded-[20px] shadow-2xl flex flex-col items-center justify-center text-center px-8" style={{ maxHeight: "85vh", height: "420px" }}>
            <button onClick={() => setOpen(false)} data-testid="ai-close-button" className="absolute top-4 right-5 text-[#78716C] hover:text-[#7B1E1E]"><X /></button>
            <div className="w-14 h-14 rounded-2xl bg-[#7B1E1E] flex items-center justify-center mb-5">
              <Sparkles className="w-7 h-7 text-[#F5B400]" />
            </div>
            <div className="font-display font-bold text-2xl text-[#292524]">Edumotion AI</div>
            <p className="text-[#78716C] mt-3 leading-relaxed">
              The AI doubt solver is coming soon. In the meantime, check out the chapter notes, flashcards, and PYQs to get your answers.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
