import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, auth } from "../../lib/api";

export default function AdminSettings() {
  const navigate = useNavigate();

  const [me, setMe] = useState<any>(null);
  const [patch, setPatch] = useState<string>('{}');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const loadMe = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.me.get();
      setMe(res);
      setMsg(null);
    } catch (e: any) {
      setErr(e.message || "Nem sikerült lekérni a saját profilt.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const onUpdate = async () => {
    setErr(null);
    setMsg(null);

    let patchObj: any;
    try {
      patchObj = JSON.parse(patch || "{}");
    } catch {
      return setErr("A PATCH JSON érvénytelen.");
    }

    setLoading(true);
    try {
      const res = await api.me.update(patchObj);
      setMe(res);
      setMsg("Saját profil frissítve.");
    } catch (e: any) {
      setErr(e.message || "Módosítás sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Biztos törlöd a saját profilod?")) return;
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      await api.me.remove();
      auth.clearToken();
      navigate("/");
    } catch (e: any) {
      setErr(e.message || "Törlés sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Beállítások</h1>
        <p className="text-sm text-slate-600">Saját profil: lekérés / módosítás / törlés.</p>
      </div>

      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>}
      {msg && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{msg}</div>}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Saját profil</h2>
          <button onClick={loadMe} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
            Frissítés
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs overflow-auto">
          <pre>{JSON.stringify(me, null, 2)}</pre>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">PATCH JSON</label>
          <textarea
            value={patch}
            onChange={(e) => setPatch(e.target.value)}
            className="w-full min-h-[140px] rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono"
          />
          <p className="text-[11px] text-slate-500">
            Példa: {"{ \"fullName\": \"Admin Példa\", \"phoneNumber\": \"+3630...\" }"}
          </p>
        </div>

        <button
          disabled={loading}
          onClick={onUpdate}
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Módosítás mentése
        </button>

        <button
          disabled={loading}
          onClick={onDelete}
          className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
        >
          Saját profil törlése
          
        </button>
      </section>
    </div>
  );
}
