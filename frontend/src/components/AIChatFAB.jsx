import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function AIChatFAB() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: "welcome", role: "assistant", content: "Hi! I'm Edumotion AI. Ask me anything — concepts, sums, summaries — I'll explain step by step." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userId = `u-${Date.now()}`;
    setMessages((m) => [...m, { id: userId, role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await api.post("/ai/chat", { message: text });
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "assistant", content: res.data.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "assistant", content: "Sorry, I couldn't reach the AI right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="relative bg-white w-full md:w-[420px] md:m-6 rounded-t-[20px] md:rounded-[20px] shadow-2xl flex flex-col" style={{ maxHeight: "85vh", height: "640px" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E5E4]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7B1E1E] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#F5B400]" />
                </div>
                <div>
                  <div className="font-display font-bold text-[#292524]">Edumotion AI</div>
                  <div className="text-[10px] uppercase font-mono-em tracking-[0.2em] text-[#78716C]">Powered by Gemini</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} data-testid="ai-close-button" className="text-[#78716C] hover:text-[#7B1E1E]"><X /></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "ml-auto bg-[#7B1E1E] text-white rounded-2xl rounded-br-md px-4 py-2.5" : "bg-[#F5F5F4] text-[#292524] rounded-2xl rounded-bl-md px-4 py-2.5"}`}>
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="bg-[#F5F5F4] text-[#78716C] rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                </div>
              )}
            </div>
            <div className="border-t border-[#E7E5E4] p-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask: 'Explain photosynthesis'…"
                data-testid="ai-chat-input"
                className="flex-1 px-4 py-2.5 rounded-full bg-[#F5F5F4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B1E1E] text-sm"
              />
              <button onClick={send} disabled={loading} data-testid="ai-send-button" className="bg-[#F5B400] hover:bg-[#D99E00] text-[#292524] w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
