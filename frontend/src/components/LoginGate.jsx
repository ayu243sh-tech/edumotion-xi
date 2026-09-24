import { useEffect, useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Lock } from "lucide-react";
import { getAuthToken, setAuthToken } from "@/lib/auth";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://edumotion-xi.onrender.com/api";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function LoginGateInner({ children }) {
  const [checking, setChecking] = useState(true);
  const [granted, setGranted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) { setChecking(false); return; }
    fetch(`${API_BASE}/resources-auth/check?token=${token}`)
      .then((r) => r.json())
      .then((data) => setGranted(data.valid))
      .finally(() => setChecking(false));
  }, []);

  const onSuccess = async (credentialResponse) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/resources-auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Login failed");
      }
      const data = await res.json();
      setAuthToken(data.token);
      setGranted(true);
    } catch (e) {
      setError(e.message || "This account is not approved for access.");
    }
  };

  if (checking) return null;
  if (granted) return children;

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
      <div className="max-w-sm w-full bg-white rounded-[20px] border border-[#E7E5E4] p-8 bento-shadow text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#7B1E1E] flex items-center justify-center mx-auto mb-5">
          <Lock className="w-5 h-5 text-[#F5B400]" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">EduMotion Resources</h1>
        <p className="text-sm text-[#78716C] mb-6">Sign in with an approved Google account to continue.</p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => setError("Google sign-in failed — try again.")}
          />
        </div>

        {error && <div className="text-sm text-[#B91C1C] mt-4">{error}</div>}
      </div>
    </div>
  );
}

export default function LoginGate({ children }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginGateInner>{children}</LoginGateInner>
    </GoogleOAuthProvider>
  );
}
