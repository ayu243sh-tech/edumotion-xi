import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export async function authed(user) {
  const token = await user.getIdToken();
  return { headers: { Authorization: `Bearer ${token}` } };
}
export const pget = async (user, path) => (await api.get(path, await authed(user))).data;
export const ppost = async (user, path, body) => (await api.post(path, body, await authed(user))).data;
export const pdelete = async (user, path) => (await api.delete(path, await authed(user))).data;

export function errText(err, fallback = "Something went wrong. Please try again.") {
  const d = err && err.response && err.response.data && err.response.data.detail;
  return typeof d === "string" ? d : fallback;
}

// Loads protected data and reloads when the path changes.
export function useLoad(user, path) {
  const [s, setS] = useState({ loading: true, data: null, error: "" });
  const reload = useCallback(async () => {
    if (!user) return;
    try {
      setS({ loading: false, data: await pget(user, path), error: "" });
    } catch (e) {
      setS({ loading: false, data: null, error: errText(e) });
    }
  }, [user, path]);
  useEffect(() => { reload(); }, [reload]);
  return { ...s, reload };
}
