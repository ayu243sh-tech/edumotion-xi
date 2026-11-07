import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Key } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { InlineLogin } from "@/components/DoubtBox";
import { errText, pget, ppost } from "@/lib/portalApi";

const CARD = "bg-white rounded-[20px] border border-[#E7E5E4] bento-shadow";

export default function Portal() {
  const user = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try { setData(await pget(user, "/portal/me")); }
    catch { setData({ memberships: [], is_admin: false }); }
  }, [user]);

  useEffect(() => { if (user) load(); }, [user, load]);

  useEffect(() => {
    if (data && !data.is_admin && data.memberships.length === 1) {
      navigate(`/portal/${data.memberships[0].batch_id}`, { replace: true });
    }
  }, [data, navigate]);

  const activate = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try { await ppost(user, "/portal/activate", { code }); setCode(""); await load(); }
    catch (err) { setMsg(errText(err)); }
    finally { setBusy(false); }
  };

  if (user === undefined) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10" data-testid="portal-page">
      <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Student portal</div>
      <h1 className="font-display text-4xl font-bold mt-2">My Batch</h1>

      {!user ? (
        <div className={`${CARD} p-6 mt-8`}>
          <InlineLogin message="Log in with the account you'll use for classes. New here? Choose Sign Up." />
        </div>
      ) : !data ? null : (
        <>
          {data.is_admin && (
            <Link to="/admin" className="inline-block mt-4 text-sm font-semibold text-[#7B1E1E]">Open the admin page →</Link>
          )}

          {data.memberships.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {data.memberships.map((m) => (
                <Link key={m.batch_id} to={`/portal/${m.batch_id}`} className={`${CARD} p-6 hover:-translate-y-1 transition-transform`}>
                  <div className="text-xs font-mono-em uppercase tracking-[0.15em] text-[#78716C]">Class {m.class_level}{m.option_label ? ` · ${m.option_label}` : ""}</div>
                  <div className="font-display text-xl font-bold mt-1">{m.batch_name}</div>
                  <div className="text-sm text-[#78716C] mt-1">{m.student_name}</div>
                  <ArrowRight className="w-5 h-5 mt-4 text-[#7B1E1E]" />
                </Link>
              ))}
            </div>
          )}

          <div className={`${CARD} p-6 md:p-8 mt-8`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDE68A] flex items-center justify-center"><Key className="w-5 h-5 text-[#7B1E1E]" /></div>
              <div>
                <div className="font-display font-bold text-lg">{data.memberships.length ? "Add another batch" : "Activate your batch"}</div>
                <div className="text-xs text-[#78716C]">Enter the 8-character code we sent you after your payment was verified.</div>
              </div>
            </div>
            <form onSubmit={activate} className="mt-5 flex flex-col sm:flex-row gap-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. K7M2X9QD"
                maxLength={12}
                required
                className="flex-1 border border-[#E7E5E4] rounded-full px-5 py-3 text-sm font-mono-em tracking-widest outline-none focus:border-[#7B1E1E]"
              />
              <button type="submit" disabled={busy} className="bg-[#7B1E1E] hover:bg-[#611717] disabled:opacity-60 text-white font-semibold rounded-full px-7 py-3">
                {busy ? "Checking..." : "Activate"}
              </button>
            </form>
            {msg && <div className="text-sm text-[#B91C1C] mt-3">{msg}</div>}
            {!data.memberships.length && (
              <p className="text-sm text-[#78716C] mt-5">
                Haven't enrolled yet? <Link to="/batches" className="text-[#7B1E1E] font-semibold">Choose a batch</Link>.
                After you pay and submit the form, we verify the payment and send you a code.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
