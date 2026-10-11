import { useCallback, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { MessageSquare, Check, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";

function friendlyAuthError(code) {
  switch (code) {
    case "auth/email-already-in-use": return "That email is already registered. Try logging in.";
    case "auth/invalid-email": return "That doesn't look like a valid email.";
    case "auth/weak-password": return "Password should be at least 6 characters.";
    case "auth/wrong-password":
    case "auth/invalid-credential": return "Incorrect email or password.";
    case "auth/user-not-found": return "No account with that email. Try signing up.";
    case "auth/too-many-requests": return "Too many attempts. Please wait a bit and try again.";
    case "auth/unauthorized-domain": return "This website isn't authorised in Firebase yet.";
    default: return "Something went wrong. Please try again.";
  }
}

function InlineLogin() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(friendlyAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm">
      <p className="text-sm text-[#78716C] mb-4">Log in to ask your doubts. You can use the same account as EduMotion Resources.</p>
      <div className="flex gap-2 mb-4">
        {["login", "signup"].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(""); }}
            className={`flex-1 text-sm font-semibold rounded-full px-4 py-2 ${
              mode === m ? "bg-[#7B1E1E] text-white" : "bg-[#FAF9F6] border border-[#E7E5E4]"
            }`}
          >
            {m === "login" ? "Log In" : "Sign Up"}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required
          className="w-full border border-[#E7E5E4] rounded-full px-5 py-3 text-sm outline-none focus:border-[#7B1E1E]"
        />
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required
          className="w-full border border-[#E7E5E4] rounded-full px-5 py-3 text-sm outline-none focus:border-[#7B1E1E]"
        />
        <button
          type="submit" disabled={loading}
          className="w-full bg-[#7B1E1E] hover:bg-[#611717] text-white text-sm font-semibold rounded-full px-5 py-3"
        >
          {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
        </button>
      </form>
      {error && <div className="text-sm text-[#B91C1C] mt-3">{error}</div>}
    </div>
  );
}

export default function DoubtBox({ classId }) {
  const user = useAuth();
  const [quota, setQuota] = useState(null);
  const [doubts, setDoubts] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);

  const authConfig = useCallback(async () => {
    const token = await user.getIdToken();
    return { headers: { Authorization: `Bearer ${token}` } };
  }, [user]);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const cfg = await authConfig();
      const [q, d] = await Promise.all([
        api.get("/live/doubts/quota", cfg),
        api.get(`/live/classes/${classId}/doubts`, cfg),
      ]);
      setQuota(q.data);
      setDoubts(d.data || []);
    } catch {
      setMsg({ type: "error", text: "Couldn't load your doubts. Try again in a moment." });
    }
  }, [user, classId, authConfig]);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setSending(true);
    try {
      const cfg = await authConfig();
      await api.post(`/live/classes/${classId}/doubts`, { question: text.trim() }, cfg);
      setText("");
      setMsg({ type: "ok", text: "Doubt sent! The answer will appear here once it's replied to." });
      await load();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setMsg({ type: "error", text: typeof detail === "string" ? detail : "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  };

  if (user === undefined) return null;

  return (
    <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 bento-shadow" data-testid="doubt-box">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#FDE68A] flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-[#7B1E1E]" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">After class</div>
            <div className="font-display font-bold text-lg leading-tight">Ask your doubts</div>
          </div>
        </div>
        {user && (
          <button onClick={() => signOut(auth)} className="text-xs text-[#78716C] hover:text-[#7B1E1E]">
            Log out
          </button>
        )}
      </div>

      {!user ? (
        <InlineLogin />
      ) : (
        <>
          {quota && (
            <div className="text-xs font-mono-em text-[#78716C] mb-3">
              {quota.remaining} of {quota.limit} questions left today
            </div>
          )}
          <form onSubmit={submit}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Type your doubt from this class..."
              disabled={quota && quota.remaining === 0}
              className="w-full border border-[#E7E5E4] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#7B1E1E] resize-y disabled:bg-[#FAF9F6]"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[#78716C]">{text.length}/500</span>
              <button
                type="submit"
                disabled={sending || text.trim().length < 5 || (quota && quota.remaining === 0)}
                className="bg-[#7B1E1E] hover:bg-[#611717] disabled:opacity-50 text-white text-sm font-semibold rounded-full px-5 py-2"
              >
                {sending ? "Sending..." : "Send doubt"}
              </button>
            </div>
          </form>

          {msg && (
            <div className={`text-sm mt-3 ${msg.type === "ok" ? "text-[#0F766E]" : "text-[#B91C1C]"}`}>{msg.text}</div>
          )}

          {doubts.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Your doubts for this class</div>
              {doubts.map((d) => (
                <div key={d.id} className="border border-[#E7E5E4] rounded-2xl p-4">
                  <div className="text-sm font-medium">{d.question}</div>
                  {d.answer ? (
                    <div className="mt-2 text-sm bg-[#CCFBF1]/50 rounded-xl p-3 flex gap-2">
                      <Check className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" /> <span>{d.answer}</span>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-[#78716C] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Waiting for a reply
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
