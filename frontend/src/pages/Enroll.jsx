import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Check, Copy, Smartphone } from "lucide-react";
import { signOut } from "firebase/auth";
import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { InlineLogin } from "@/components/DoubtBox";
import { ENROLL } from "@/lib/enrollConfig";

const INPUT =
  "mt-1.5 w-full border border-[#E7E5E4] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#7B1E1E] bg-white";
const CARD = "bg-white rounded-[24px] border border-[#E7E5E4] bento-shadow";

const STATUS_TEXT = {
  pending: ["You've already applied", "We have your request and are checking your payment. We'll contact you on the phone number you gave."],
  paid: ["Payment received", "Your payment has been noted. We'll confirm your seat shortly."],
  accepted: ["Your seat is confirmed", "Check your WhatsApp for your activation code, then enter it in My Batch."],
  rejected: ["We couldn't confirm this request", "Please contact us so we can help."],
  revoked: ["Your access was removed", "Please contact us if you think this is a mistake."],
};

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[#57534E]">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-[#78716C] mt-1">{hint}</span>}
    </label>
  );
}

function teacherLines(o) {
  const names = [...new Set(o.teachers.map((t) => t.name))];
  return names.length === 1 ? [`All subjects: ${names[0]}`] : o.teachers.map((t) => `${t.subject}: ${t.name}`);
}

export default function Enroll() {
  const { batchId } = useParams();
  const [params] = useSearchParams();
  const user = useAuth();
  const [batch, setBatch] = useState(null);
  const [error, setError] = useState(false);
  const [existing, setExisting] = useState(null);
  const [form, setForm] = useState({
    student_name: "", dob: "", father_name: "", mother_name: "", phone: "", utr: "",
    option_id: params.get("option") || "", consent: false,
  });
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [already, setAlready] = useState(false);
  const [msg, setMsg] = useState("");
  const [qrOk, setQrOk] = useState(true);
  const [copied, setCopied] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    api.get(`/live/batches/${batchId}`).then((r) => setBatch(r.data)).catch(() => setError(true));
  }, [batchId]);

  // drop a ?option= value that doesn't belong to this batch
  useEffect(() => {
    if (batch && form.option_id && !(batch.options || []).some((o) => o.id === form.option_id)) {
      setForm((f) => ({ ...f, option_id: "" }));
    }
  }, [batch]); // eslint-disable-line

  // has this account already applied?
  useEffect(() => {
    if (!user) { setExisting(null); return; }
    (async () => {
      try {
        const token = await user.getIdToken();
        const r = await api.get("/live/enroll-request/mine", {
          params: { batch_id: batchId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setExisting(r.data);
      } catch {
        setExisting({ exists: false });
      }
    })();
  }, [user, batchId]);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setStatus("sending");
    try {
      const token = await user.getIdToken();
      const r = await api.post(
        "/live/enroll-request",
        { batch_id: batchId, ...form, option_id: form.option_id || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlready(Boolean(r.data.already));
      setStatus("done");
      window.scrollTo({ top: 0 });
    } catch (err) {
      const d = err && err.response && err.response.data && err.response.data.detail;
      setMsg(typeof d === "string" ? d : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(ENROLL.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  };

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center text-[#78716C]">
        Couldn't find this batch. <Link to="/batches" className="text-[#7B1E1E] font-semibold">Back to batches</Link>
      </div>
    );
  }
  if (!batch || user === undefined) return null;

  const options = batch.options || [];
  const fee = ENROLL.fee.toLocaleString("en-IN");
  const contactLink = ENROLL.whatsapp
    ? `https://wa.me/${ENROLL.whatsapp}?text=${encodeURIComponent(`Hi! I have a question about my enrolment in ${batch.name}.`)}`
    : null;

  // 1. log in first
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-14" data-testid="enroll-login">
        <Link to={`/batch/${batch.id}`} className="text-sm text-[#78716C] hover:text-[#7B1E1E]">← Back to batch</Link>
        <div className={`${CARD} p-6 mt-4`}>
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Enrol · Class {batch.class_level}</div>
          <h1 className="font-display text-2xl font-bold mt-1">{batch.name}</h1>
          <p className="text-sm text-[#78716C] mt-2 mb-5">Log in or sign up first. It lets you see the status of your request later.</p>
          <InlineLogin message="Use an email you can access. You'll use the same login for classes." />
        </div>
      </div>
    );
  }

  if (existing === null) return null;

  // 2. already applied: show the status instead of the form
  if (existing.exists) {
    const key = existing.status === "accepted" && existing.activated ? "active" : existing.status;
    const [title, text] =
      key === "active" ? ["You're all set", "Your batch is active. Open My Batch to start learning."] : STATUS_TEXT[key] || STATUS_TEXT.pending;
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center" data-testid="enroll-existing">
        <div className="w-16 h-16 rounded-full bg-[#0F766E] mx-auto flex items-center justify-center"><Check className="w-8 h-8 text-white" /></div>
        <h1 className="font-display text-3xl font-bold mt-5">{title}</h1>
        <p className="text-[#78716C] mt-3 leading-relaxed">{text}</p>
        <div className={`${CARD} p-5 mt-6 text-left text-sm`}>
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-2">Your request</div>
          <div>Student: <b>{existing.student_name}</b></div>
          <div>Batch: <b>{batch.name}</b></div>
          {existing.option_label && <div>Teachers: <b>{existing.option_label}</b></div>}
          <div>Status: <b className="capitalize">{existing.status}</b></div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {existing.status === "accepted" && (
            <Link to="/portal" className="bg-[#7B1E1E] text-white text-sm font-semibold rounded-full px-6 py-3">Open My Batch</Link>
          )}
          {contactLink && (
            <a href={contactLink} target="_blank" rel="noreferrer" className="border border-[#0F766E] text-[#0F766E] text-sm font-semibold rounded-full px-6 py-3">
              Contact us on WhatsApp
            </a>
          )}
        </div>
        <p className="text-xs text-[#78716C] mt-6">
          Enrolling a different student? Contact us, and we'll help.{" "}
          <button onClick={() => signOut(auth)} className="underline">Log out</button>
        </p>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#0F766E] mx-auto flex items-center justify-center"><Check className="w-8 h-8 text-white" /></div>
        <h1 className="font-display text-3xl font-bold mt-5">{already ? "We already have your request" : "Request received!"}</h1>
        <p className="text-[#78716C] mt-3 leading-relaxed">
          {ENROLL.note} We'll contact you on {form.phone} about {batch.name}. Please keep your payment screenshot safe.
        </p>
        {contactLink && <a href={contactLink} target="_blank" rel="noreferrer" className="inline-block mt-6 text-sm font-semibold text-[#0F766E]">Message us on WhatsApp</a>}
        <div className="mt-8"><Link to="/batches" className="text-sm font-semibold text-[#7B1E1E]">← Back to batches</Link></div>
      </div>
    );
  }

  const upiLink = ENROLL.upiId
    ? `upi://pay?pa=${encodeURIComponent(ENROLL.upiId)}&pn=${encodeURIComponent(ENROLL.payeeName)}&am=${ENROLL.fee}&cu=INR&tn=${encodeURIComponent(`EduMotion ${batch.name}`)}`
    : null;

  // 3. the form
  return (
    <div className="max-w-6xl mx-auto px-6 py-10" data-testid="enroll-page">
      <Link to={`/batch/${batch.id}`} className="text-sm text-[#78716C] hover:text-[#7B1E1E]">← Back to batch</Link>
      <div className="mt-4">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Enrol · Class {batch.class_level}</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">{batch.name}</h1>
        <div className="text-xs text-[#78716C] mt-2">
          Logged in as {user.email}.{" "}
          <button onClick={() => signOut(auth)} className="underline">Not you? Log out</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 mt-8 items-start">
        <form onSubmit={submit} className={`lg:col-span-3 order-2 lg:order-1 ${CARD} p-6 md:p-8 space-y-5`}>
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Step 2 · Your details</div>

          {options.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-[#57534E] mb-2">Choose your teachers</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {options.map((o) => (
                  <label key={o.id} className={`cursor-pointer rounded-2xl border p-4 ${form.option_id === o.id ? "border-[#7B1E1E] bg-[#7B1E1E]/5" : "border-[#E7E5E4] hover:border-[#7B1E1E]"}`}>
                    <input type="radio" name="option" value={o.id} checked={form.option_id === o.id} onChange={set("option_id")} required className="sr-only" />
                    <div className="font-display font-bold">{o.label}</div>
                    <div className="text-xs text-[#78716C] mt-1">{o.tagline}</div>
                    <div className="mt-2 text-xs text-[#57534E] space-y-0.5">{teacherLines(o).map((l) => <div key={l}>{l}</div>)}</div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <Field label="Student's name"><input className={INPUT} value={form.student_name} onChange={set("student_name")} required maxLength={60} /></Field>
          <Field label="Date of birth"><input className={INPUT} type="date" value={form.dob} onChange={set("dob")} required max={today} /></Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Father's name"><input className={INPUT} value={form.father_name} onChange={set("father_name")} required maxLength={60} /></Field>
            <Field label="Mother's name"><input className={INPUT} value={form.mother_name} onChange={set("mother_name")} required maxLength={60} /></Field>
          </div>
          <Field label="Phone number" hint="We'll call or message you on this number.">
            <input className={INPUT} type="tel" inputMode="numeric" value={form.phone} onChange={set("phone")} required maxLength={15} />
          </Field>
          <Field label="UPI transaction ID (UTR), if you have paid" hint="You'll find it in your UPI app after paying. It helps us confirm your payment faster.">
            <input className={INPUT} value={form.utr} onChange={set("utr")} maxLength={30} />
          </Field>

          <label className="flex gap-3 items-start text-xs text-[#57534E] leading-relaxed">
            <input type="checkbox" checked={form.consent} onChange={set("consent")} required className="mt-0.5 w-4 h-4 accent-[#7B1E1E]" />
            <span>I am the student's parent or guardian, or I have my parent's permission, and I agree to share these details with EduMotion for enrolment.</span>
          </label>

          {msg && <div className="text-sm text-[#B91C1C]">{msg}</div>}
          <button type="submit" disabled={status === "sending"} className="w-full bg-[#7B1E1E] hover:bg-[#611717] disabled:opacity-60 text-white font-semibold rounded-full px-6 py-3.5">
            {status === "sending" ? "Sending..." : "Submit enrolment"}
          </button>
        </form>

        <aside className="lg:col-span-2 order-1 lg:order-2 lg:sticky lg:top-24">
          <div className={`${CARD} p-6 text-center`}>
            <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Step 1 · Pay</div>
            <div className="font-display text-4xl font-bold text-[#7B1E1E] mt-2">₹{fee}</div>
            <div className="text-sm text-[#78716C] mt-1">{batch.name}</div>

            <div className="mt-5 mx-auto w-56 h-56 rounded-2xl border border-[#E7E5E4] bg-[#FAF9F6] flex items-center justify-center overflow-hidden">
              {qrOk ? (
                <img src={/WhatsApp Image 2026-11-07 at 1.28.07 PM.jpeg} alt="UPI payment QR code" onError={() => setQrOk(false)} className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-[#78716C] px-4">The payment QR will appear here</span>
              )}
            </div>

            {ENROLL.upiId && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                <span className="font-mono-em">{ENROLL.upiId}</span>
                <button type="button" onClick={copyUpi} className="inline-flex items-center gap-1 text-xs font-semibold text-[#7B1E1E]">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>
            )}
            {upiLink && (
              <a href={upiLink} className="lg:hidden mt-4 inline-flex items-center justify-center gap-2 w-full bg-[#0F766E] text-white font-semibold rounded-full py-3">
                <Smartphone className="w-4 h-4" /> Pay with UPI app
              </a>
            )}
            <p className="text-xs text-[#78716C] mt-3 leading-relaxed">
              On a phone? Tap the button, or save the QR and scan it from your gallery in any UPI app. Then fill in your details.
            </p>

            {ENROLL.includes.length > 0 && (
              <ul className="text-left mt-5 pt-5 border-t border-[#F0EEEC] space-y-2 text-sm">
                {ENROLL.includes.map((x) => (
                  <li key={x} className="flex gap-2"><Check className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" /> {x}</li>
                ))}
              </ul>
            )}
            <p className="text-xs text-[#57534E] mt-4 font-medium">{ENROLL.note}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
