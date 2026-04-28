import { useEffect, useState, useMemo } from "react";
import { api } from "../../lib/api";
import { studentsApi } from "../../features/students/services/studentsApi";
import type {
  SystemAdminProfile,
  CompanyAdminProfile,
  UniversityUserProfile,
  StudentProfile,
} from "../../types/api.types";

type AdminProfileState =
  | SystemAdminProfile
  | CompanyAdminProfile
  | UniversityUserProfile
  | StudentProfile;

export default function AdminSettings() {
  const [me, setMe] = useState<AdminProfileState | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const role = useMemo(() => localStorage.getItem("role") || "", []);

  const fetchProfile = async () => {
    setLoading(true);
    setErr(null);
    try {
      let res;
      if (role === "SYSTEM_ADMIN") {
        res = await api.systemAdmins.me.get();
      } else if (role === "COMPANY_ADMIN") {
        res = await api.companyAdmins.me.get();
      } else if (role === "UNIVERSITY_USER") {
        res = await api.universityUsers.me.get();
      } else {
        // Default fallack
        res = await studentsApi.me.get();
      }
      setMe(res);
      const fullName =
        ("fullName" in res && res.fullName) ||
        ("name" in res && res.name) ||
        "";
      const phoneNumber = "phoneNumber" in res ? res.phoneNumber || "" : "";
      setFormData({
        fullName,
        phoneNumber,
      });
      setMsg(null);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Nem sikerült lekérni a saját profilt.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [role]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      };

      if (role === "SYSTEM_ADMIN") {
        await api.systemAdmins.me.update(payload);
      } else if (role === "COMPANY_ADMIN") {
        await api.companyAdmins.me.update(payload);
      } else if (role === "UNIVERSITY_USER") {
        await api.universityUsers.me.update(payload);
      } else {
        await studentsApi.me.update(payload);
      }

      setMsg("Saját profil frissítve.");
      // Reload to reflect changes
      await fetchProfile();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Módosítás sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors">
          Beállítások
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Saját profil adatok kezelése.
        </p>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
          {err}
        </div>
      )}
      {msg && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-400 transition-colors">
          {msg}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 max-w-2xl transition-colors">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4 transition-colors">
          Saját profil
        </h2>

        {loading && !me ? (
          <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
            Betöltés...
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                  Email cím (nem módosítható)
                </label>
                <input
                  disabled
                  value={me?.email || ""}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                  Szerepkör
                </label>
                <div className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors">
                  {role || "Ismeretlen"}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Teljes név
              </label>
              <input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Pl. Kovács János"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Telefonszám
              </label>
              <input
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="+36..."
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                Mentés
              </button>
              {/* 
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onDelete}
                        className="rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                        >
                        Fiók törlése
                    </button>
                    */}
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
