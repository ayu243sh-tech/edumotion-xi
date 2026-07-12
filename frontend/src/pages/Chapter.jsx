import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { markChapterProgress, markQuizDone, logVideoWatched } from "@/lib/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, RotateCw, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Chapter() {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [flipIdx, setFlipIdx] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [pdfMissing, setPdfMissing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [chapterProgress, setChapterProgress] = useState(0);

  const refreshProgress = () => {
    // Read this chapter's own progress directly from localStorage
    try {
      const raw = localStorage.getItem("edumotion_progress_v1");
      const state = raw ? JSON.parse(raw) : {};
      setChapterProgress(state.chapters?.[chapterId]?.progress || 0);
    } catch {
      setChapterProgress(0);
    }
  };

  useEffect(() => {
    api.get(`/catalog/chapters/${chapterId}`).then((r) => setChapter(r.data));
    setPdfMissing(false);
    setQuizAnswers({});
    setShowQuizResult(false);
    setTimeLeft(20 * 60);
    refreshProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  useEffect(() => {
    if (showQuizResult || !chapter?.quiz?.length) return;
    if (timeLeft <= 0) { setShowQuizResult(true); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showQuizResult, chapter]);

  const mmss = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`;

  if (!chapter) return null;

  const pdfUrl = chapter.notes_pdf;
  const isDriveLink = pdfUrl?.includes("drive.google.com");

  const openOrDownloadPdf = () => {
    if (!pdfUrl) { toast.error("No notes uploaded yet."); return; }
    if (isDriveLink) {
      // Drive blocks forced downloads cross-origin — just open it, Drive shows its own download button
      window.open(pdfUrl.replace("/preview", "/view"), "_blank", "noopener");
      toast.success("Opening notes…");
      return;
    }
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${chapter.name}.pdf`;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Downloading notes…");
  };

  const markComplete = () => {
    markChapterProgress(chapterId, 100, { name: chapter.name });
    refreshProgress();
    toast.success("Marked complete!");
  };

  const submitQuiz = () => {
    setShowQuizResult(true);
    markQuizDone(chapterId, score, { name: chapter.name });
    toast.success("Quiz submitted!");
  };

  const handleVideoOpen = () => {
    logVideoWatched(chapterId, { name: chapter.name });
  };

  const score = chapter.quiz?.reduce((acc, q, i) => acc + (quizAnswers[i] === q.answer ? 1 : 0), 0) || 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" data-testid="chapter-page">
      <Link to="/" className="text-sm text-[#78716C] hover:text-[#7B1E1E]">← Back</Link>
      <div className="mt-4 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">{chapter.class_id.replace("-", " ")} · {chapter.subject_id}</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">{chapter.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <Badge variant="outline" className="font-mono-em text-[10px]">{chapter.difficulty}</Badge>
            <span className="text-sm text-[#78716C]">{chapter.duration}</span>
          </div>

          <Tabs defaultValue="overview" className="mt-8" onValueChange={(v) => v === "video" && handleVideoOpen()} data-testid="chapter-tabs">
            <TabsList className="bg-[#F5F5F4] p-1 rounded-full flex-wrap h-auto">
              <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-[#7B1E1E] data-[state=active]:text-white" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="notes" className="rounded-full data-[state=active]:bg-[#7B1E1E] data-[state=active]:text-white" data-testid="tab-notes">Notes</TabsTrigger>
              <TabsTrigger value="video" className="rounded-full data-[state=active]:bg-[#7B1E1E] data-[state=active]:text-white" data-testid="tab-video">Video</TabsTrigger>
              <TabsTrigger value="flashcards" className="rounded-full data-[state=active]:bg-[#7B1E1E] data-[state=active]:text-white" data-testid="tab-flashcards">Flashcards</TabsTrigger>
              <TabsTrigger value="pyqs" className="rounded-full data-[state=active]:bg-[#7B1E1E] data-[state=active]:text-white" data-testid="tab-pyqs">PYQs</TabsTrigger>
              <TabsTrigger value="quiz" className="rounded-full data-[state=active]:bg-[#7B1E1E] data-[state=active]:text-white" data-testid="tab-quiz">Quiz</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6">
                <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-2">Chapter overview</div>
                <p className="text-lg leading-relaxed">{chapter.overview}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button onClick={openOrDownloadPdf} data-testid="download-pdf-button" className="bg-[#7B1E1E] hover:bg-[#631818] text-white rounded-full px-6">
                    <Download className="w-4 h-4 mr-2" /> {isDriveLink ? "Open Notes" : "Download PDF"}
                  </Button>
                  <Button onClick={markComplete} variant="outline" className="rounded-full px-6 border-[#E7E5E4]">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark complete
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">PDF Notes</div>
                    <div className="text-sm text-[#78716C] mt-1 font-mono-em break-all">{pdfUrl}</div>
                  </div>
                  <Button onClick={openOrDownloadPdf} className="bg-[#F5B400] hover:bg-[#D99E00] text-[#292524] rounded-full">
                    <Download className="w-4 h-4 mr-2" /> {isDriveLink ? "Open" : "Download"}
                  </Button>
                </div>
                {pdfUrl && !pdfMissing ? (
                  <iframe
                    src={pdfUrl}
                    title="Notes"
                    className="w-full aspect-[4/3] rounded-2xl border border-[#E7E5E4]"
                    data-testid="chapter-pdf-viewer"
                    onError={() => setPdfMissing(true)}
                  />
                ) : (
                  <div className="aspect-[4/3] bg-[#FAF9F6] rounded-2xl flex flex-col items-center justify-center text-center px-6 border border-dashed border-[#E7E5E4]">
                    <div className="text-4xl mb-3">📄</div>
                    <div className="font-display font-semibold text-lg">PDF coming soon</div>
                    <div className="text-sm text-[#78716C] mt-2 max-w-md">
                      Upload the file to Google Drive, set sharing to "Anyone with the link," and add its link to <span className="font-mono-em">notes_pdf</span> in seed_data.py.
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="video" className="mt-6">
              <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-3 overflow-hidden">
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
                  <iframe
                    src={chapter.video_url}
                    title={chapter.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    data-testid="chapter-video-iframe"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="flashcards" className="mt-6">
              {chapter.flashcards.length === 0 ? (
                <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 text-[#78716C]">Flashcards coming soon.</div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {chapter.flashcards.map((f, i) => (
                    <button key={`fc-${f.front}`} onClick={() => setFlipIdx(flipIdx === i ? null : i)} data-testid={`flashcard-${i}`} className="text-left bg-white rounded-[20px] border border-[#E7E5E4] p-6 min-h-[160px] hover:border-[#7B1E1E] transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono-em uppercase tracking-[0.15em] text-[#78716C]">{flipIdx === i ? "Answer" : "Question"}</span>
                        <RotateCw className="w-4 h-4 text-[#78716C]" />
                      </div>
                      <div className="font-display text-lg">{flipIdx === i ? f.back : f.front}</div>
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pyqs" className="mt-6">
              <div className="bg-white rounded-[20px] border border-[#E7E5E4] divide-y">
                {chapter.pyqs.length === 0 && <div className="p-6 text-[#78716C]">PYQs coming soon.</div>}
                {chapter.pyqs.map((p) => (
                  <div key={`${p.year}-${p.q.slice(0,20)}`} className="p-5 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FDE68A] flex items-center justify-center font-mono-em text-sm text-[#7B1E1E]">{p.year}</div>
                    <div className="flex-1 text-[#292524]">{p.q}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quiz" className="mt-6">
              <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 space-y-6" data-testid="chapter-quiz">
                {chapter.quiz.length === 0 ? (
                  <div className="text-[#78716C]">Quiz coming soon.</div>
                ) : (
                  <>
                    <div className="flex items-center justify-between bg-[#7B1E1E] text-white rounded-2xl px-5 py-3">
                      <div className="text-xs uppercase font-mono-em tracking-[0.2em] text-[#F5B400]">MCQ · {chapter.quiz.length} questions</div>
                      <div className="font-display text-xl font-bold tabular-nums" data-testid="quiz-timer">⏱ {mmss}</div>
                    </div>
                    {chapter.quiz.map((q, i) => (
                      <div key={`q-${q.q}`}>
                        <div className="font-display font-semibold mb-3">{i + 1}. {q.q}</div>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {q.options.map((opt, k) => {
                            const answered = quizAnswers[i] !== undefined;
                            const selected = quizAnswers[i] === k;
                            const correct = answered && q.answer === k;
                            const wrong = answered && selected && q.answer !== k;
                            return (
                              <button key={`${q.q}-opt-${opt}`} onClick={() => !answered && !showQuizResult && setQuizAnswers((p) => ({ ...p, [i]: k }))} data-testid={`quiz-${i}-opt-${k}`} className={`text-left px-4 py-3 rounded-xl border transition-colors ${correct ? "bg-emerald-100 border-emerald-500 text-emerald-900" : wrong ? "bg-red-100 border-red-500 text-red-900" : "border-[#E7E5E4] hover:border-[#7B1E1E]"}`}>
                                <span className="font-mono-em text-xs text-[#78716C] mr-2">{String.fromCharCode(65 + k)}.</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    {!showQuizResult ? (
                      <Button onClick={submitQuiz} data-testid="quiz-submit-button" className="bg-[#7B1E1E] hover:bg-[#631818] text-white rounded-full px-6">Submit quiz <ArrowRight className="w-4 h-4 ml-2" /></Button>
                    ) : (
                      <div className="bg-[#FDE68A]/40 rounded-2xl p-5">
                        <div className="text-xs uppercase font-mono-em tracking-[0.2em] text-[#78716C]">Result</div>
                        <div className="font-display text-3xl font-bold mt-1">You scored {score}/{chapter.quiz.length}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side panel */}
        <aside className="md:col-span-4 space-y-5">
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 bento-shadow">
            <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Your progress</div>
            <Progress value={chapterProgress} className="h-1.5 mt-3" />
            <div className="text-sm text-[#78716C] mt-2">{chapterProgress}% complete</div>
          </div>
          <div className="bg-[#7B1E1E] rounded-[20px] p-6 text-white">
            <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#F5B400]">AI Doubt</div>
            <div className="font-display text-xl font-bold mt-2 leading-tight">Stuck on something? Ask Edumotion AI.</div>
            <p className="text-white/80 text-sm mt-3">Get step-by-step explanations, instantly.</p>
            <p className="text-white/60 text-xs mt-3 font-mono-em">Tap the floating button below ↘</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
