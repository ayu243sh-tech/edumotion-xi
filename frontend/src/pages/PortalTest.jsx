import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { InlineLogin } from "@/components/DoubtBox";
import { errText, pget, ppost } from "@/lib/portalApi";

const CARD = "bg-white rounded-[20px] border border-[#E7E5E4] bento-shadow";

export default function PortalTest() {
  const { testId } = useParams();
  const [params] = useSearchParams();
  const back = params.get("batch") ? `/portal/${params.get("batch")}?tab=tests` : "/portal";
  const user = useAuth();
  const [test, setTest] = useState(null);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState([]);
  const [left, setLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);
  const sent = useRef(false);
  const ref = useRef([]);
  ref.current = answers;

  useEffect(() => {
    if (!user) return;
    pget(user, `/portal/tests/${testId}`)
      .then((t) => { setTest(t); setAnswers(new Array(t.questions.length).fill(null)); setLeft(t.duration_min * 60); })
      .catch((e) => setError(errText(e)));
  }, [user, testId]);

  const submit = async () => {
    if (sent.current) return;
    sent.current = true;
    setSending(true);
    try { setResult(await ppost(user, `/portal/tests/${testId}/submit`, { answers: ref.current })); window.scrollTo({ top: 0 }); }
    catch (e) { setError(errText(e)); sent.current = false; }
    finally { setSending(false); }
  };

  useEffect(() => {
    if (!test || result) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [test, result]);

  useEffect(() => { if (test && !result && left <= 0) submit(); }, [left]); // eslint-disable-line

  if (user === undefined) return null;
  if (!user) return <div className="max-w-md mx-auto px-6 py-16"><div className={`${CARD} p-6`}><InlineLogin message="Log in to take this test." /></div></div>;
  if (error && !test) return <div className="max-w-md mx-auto px-6 py-16 text-center text-[#78716C]">{error} <Link to="/portal" className="text-[#7B1E1E] font-semibold">Back</Link></div>;
  if (!test) return null;

  const mm = String(Math.max(0, Math.floor(left / 60))).padStart(2, "0");
  const ss = String(Math.max(0, left % 60)).padStart(2, "0");

  if (result) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className={`${CARD} p-8 text-center`}>
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">{test.title}</div>
          <div className="font-display text-6xl font-bold text-[#7B1E1E] mt-3">{result.score}<span className="text-2xl text-[#78716C]"> / {result.total}</span></div>
          <Link to={back} className="inline-block mt-5 bg-[#7B1E1E] text-white text-sm font-semibold rounded-full px-6 py-3">Back to tests</Link>
        </div>
        <div className="space-y-4 mt-6">
          {test.questions.map((q, i) => {
            const r = result.review[i];
            return (
              <div key={i} className={`${CARD} p-5`}>
                <div className="flex gap-2 font-medium">
                  {r.ok ? <Check className="w-5 h-5 text-[#0F766E] shrink-0" /> : <X className="w-5 h-5 text-[#B91C1C] shrink-0" />}
                  <span>{i + 1}. {q.q}</span>
                </div>
                <div className="text-sm mt-2 ml-7 space-y-0.5">
                  <div>Your answer: <span className={r.ok ? "text-[#0F766E] font-semibold" : "text-[#B91C1C] font-semibold"}>{r.chosen === null ? "Not answered" : q.options[r.chosen]}</span></div>
                  {!r.ok && <div>Correct answer: <span className="text-[#0F766E] font-semibold">{q.options[r.correct]}</span></div>}
                  {r.explain && <div className="text-[#57534E] pt-1">{r.explain}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="sticky top-0 z-20 bg-[#FAF9F6]/95 backdrop-blur py-3 flex items-center justify-between border-b border-[#E7E5E4]">
        <div className="font-display font-bold truncate pr-3">{test.title}</div>
        <div className={`font-mono-em font-bold px-3 py-1 rounded-full ${left < 60 ? "bg-[#FEE2E2] text-[#B91C1C]" : "bg-[#FDE68A]/60 text-[#92400E]"}`}>{mm}:{ss}</div>
      </div>
      <div className="space-y-5 mt-6">
        {test.questions.map((q, i) => (
          <div key={i} className={`${CARD} p-5`}>
            <div className="font-medium mb-3">{i + 1}. {q.q}</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {q.options.map((o, oi) => (
                <button key={oi} onClick={() => setAnswers((a) => a.map((x, k) => (k === i ? oi : x)))}
                  className={`text-left text-sm rounded-xl border px-4 py-3 ${answers[i] === oi ? "border-[#7B1E1E] bg-[#7B1E1E]/5 font-semibold" : "border-[#E7E5E4] hover:border-[#7B1E1E]"}`}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {error && <div className="text-sm text-[#B91C1C] mt-4">{error}</div>}
      <button onClick={submit} disabled={sending} className="w-full mt-6 bg-[#7B1E1E] hover:bg-[#611717] disabled:opacity-60 text-white font-semibold rounded-full py-3.5">
        {sending ? "Submitting..." : `Submit test (${answers.filter((a) => a !== null).length}/${test.questions.length} answered)`}
      </button>
    </div>
  );
}
