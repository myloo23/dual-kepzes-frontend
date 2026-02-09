import { useState, type ChangeEvent } from "react";
import { api, type CompanyAdminProfile } from "../../../lib/api";
import { useAuth } from "../../../features/auth";

interface CompanyProfileEditorProps {
  companyAdmin: CompanyAdminProfile | null;
  onUpdate: (updated: CompanyAdminProfile) => void;
}

export default function CompanyProfileEditor({
  companyAdmin,
  onUpdate,
}: CompanyProfileEditorProps) {
  const { logout: authLogout } = useAuth();

  const [adminForm, setAdminForm] = useState<Partial<CompanyAdminProfile>>({
    fullName: companyAdmin?.fullName ?? "",
    email: companyAdmin?.email ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await api.companyAdmins.me.update({
        fullName: adminForm.fullName ?? "",
        email: adminForm.email ?? "",
      });
      onUpdate(updated);
      setSuccess("Profil frissítve.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Hiba a mentés során.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      "Biztosan törlöd a profilodat? Ez nem visszavonható.",
    );
    if (!ok) return;
    setDeleting(true);
    setError(null);
    setSuccess(null);
    try {
      await api.companyAdmins.me.remove();
      authLogout();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Hiba a profil törlése során.";
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900">Saját profil</h1>
        <p className="text-sm text-slate-600">
          Itt frissítheted a cégadmin profilodat, vagy törölheted a fiókot.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="space-y-1 text-sm text-slate-700">
          <span className="text-xs font-semibold text-slate-600">Név</span>
          <input
            name="fullName"
            value={adminForm.fullName ?? ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          <span className="text-xs font-semibold text-slate-600">E-mail</span>
          <input
            type="email"
            name="email"
            value={adminForm.email ?? ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Mentés..." : "Mentés"}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
        >
          {deleting ? "Törlés..." : "Profil törlése"}
        </button>
      </div>
    </div>
  );
}
