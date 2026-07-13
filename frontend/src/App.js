import "@/App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIChatFAB from "@/components/AIChatFAB";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Search from "@/pages/Search";
import ClassDetail from "@/pages/ClassDetail";
import Chapter from "@/pages/Chapter";
import { useState, useEffect } from "react";
import { Newspaper, X, RotateCw } from "lucide-react";
import { api } from "@/lib/api";

export default function CurrentAffairsFAB() {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedIdx, setFlippedIdx] = useState(null);

  useEffect(() => {
    if (open && cards.length === 0) {
      api.get("/catalog/current-affairs").then((r) => setCards(r.data));
    }
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        data-testid="current-affairs-fab-button"
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-[#F5B400] hover:bg-[#D99E00] text-[#292524] pl-4 pr-5 py-3 rounded-full shadow-[0_20px_40px_rgba(245,180,0,0.25)] transition-transform hover:-translate-y-0.5"
      >
        <Newspaper className="w-5 h-5" />
        <span className="text-sm font-semibold">Current Affairs</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[20px] p-6 overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Quick Revision</div>
                <h2 className="font-display text-2xl font-bold mt-1">Current Affairs Flashcards</h2>
              </div>
              <button onClick={() => setOpen(false)} data-testid="current-affairs-close-button" className="text-[#78716C] hover:text-[#7B1E1E]">
                <X />
              </button>
            </div>

            {cards.length === 0 ? (
              <div className="text-center text-[#78716C] py-16">Loading...</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {cards.map((c, i) => (
                  <button
                    key={`ca-${c.front}`}
                    onClick={() => setFlippedIdx(flippedIdx === i ? null : i)}
                    data-testid={`current-affairs-card-${i}`}
                    className="text-left bg-[#FAF9F6] rounded-[20px] border border-[#E7E5E4] p-6 min-h-[140px] hover:border-[#7B1E1E] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono-em uppercase tracking-[0.15em] text-[#78716C]">
                        {flippedIdx === i ? "Answer" : "Question"}
                      </span>
                      <RotateCw className="w-4 h-4 text-[#78716C]" />
                    </div>
                    <div className="font-display text-base">
                      {flippedIdx === i ? c.back : c.front}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Layout() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]"><Outlet /></main>
      <Footer />
      <AIChatFAB />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/class/:classId" element={<ClassDetail />} />
            <Route path="/chapter/:chapterId" element={<Chapter />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
