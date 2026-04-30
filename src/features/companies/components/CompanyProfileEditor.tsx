import { useState, useEffect, type ChangeEvent } from "react";
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

  const [personalForm, setPersonalForm] = useState<
    Pick<CompanyAdminProfile, "fullName" | "email" | "phoneNumber">
  >({
    fullName: companyAdmin?.fullName ?? "",
    email: companyAdmin?.email ?? "",
    phoneNumber: companyAdmin?.phoneNumber ?? "",
  });

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  useEffect(() => {
    if (companyAdmin) {
      setPersonalForm({
        fullName: companyAdmin.fullName ?? "",
        email: companyAdmin.email ?? "",
        phoneNumber: companyAdmin.phoneNumber ?? "",
      });
    }
  }, [companyAdmin]);

  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPersonalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePersonal = async () => {
    setSavingPersonal(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await api.companyAdmins.me.update({
        fullName: personalForm.fullName ?? "",
        email: personalForm.email ?? "",
        phoneNumber: personalForm.phoneNumber ?? "",
      });
      onUpdate(updated);
      setSuccess("Szemelyes adatok frissitve.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Hiba a mentes soran.";
      setError(message);
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleAvatarSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setAvatarError(null);
    setAvatarSuccess(null);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Csak kepfajl toltheto fel.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("A kep merete legfeljebb 5 MB lehet.");
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    const nextPreview = URL.createObjectURL(file);
    setSelectedAvatarFile(file);
    setAvatarPreview(nextPreview);
    setRemoveAvatar(false);
  };

  const handleSaveAvatar = async () => {
    setAvatarError(null);
    setAvatarSuccess(null);

    if (!selectedAvatarFile && !removeAvatar) {
      setAvatarError("Valassz kepet vagy torold a jelenlegi profilkepet.");
      return;
    }

    setSavingAvatar(true);
    try {
      setAvatarError(
        "Profilkep feltoltes/torles jelenleg nem erheto el, mert nincs backend vegpont bekotve.",
      );
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      "Biztosan torlod a profilodat? Ez nem visszavonhato.",
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
        err instanceof Error ? err.message : "Hiba a profil torlese soran.";
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  const initials =
    personalForm.fullName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "CA";

  const visibleAvatar = removeAvatar ? null : avatarPreview;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6 transition-colors">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 transition-colors">
          Profil beallitasok
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Fiok es szemelyes adatok kezelese egy helyen.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400 transition-colors">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 p-4 text-sm text-emerald-700 dark:text-emerald-400 transition-colors">
          {success}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 transition-colors">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 transition-colors">
          Szemelyes adatok
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300 transition-colors">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors">
              Nev
            </span>
            <input
              name="fullName"
              value={personalForm.fullName ?? ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </label>
          <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300 transition-colors">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors">
              E-mail
            </span>
            <input
              type="email"
              name="email"
              value={personalForm.email ?? ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </label>
          <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300 transition-colors md:col-span-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors">
              Telefonszam
            </span>
            <input
              type="tel"
              name="phoneNumber"
              value={personalForm.phoneNumber ?? ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="+36..."
            />
          </label>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSavePersonal}
            disabled={savingPersonal}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {savingPersonal ? "Mentes..." : "Szemelyes adatok mentese"}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 transition-colors">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 transition-colors">
          Jelszo modositasa
        </h2>
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300 transition-colors">
          A jelszomodositas jelenleg nem erheto el, mert nincs dokumentalt
          backend vegpont a ceges profil jelszavanak modositasara.
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 transition-colors">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 transition-colors">
          Profilkep kezelese
        </h2>
        {avatarError && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400 transition-colors">
            {avatarError}
          </div>
        )}
        {avatarSuccess && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 p-3 text-sm text-emerald-700 dark:text-emerald-400 transition-colors">
            {avatarSuccess}
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="h-20 w-20 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {visibleAvatar ? (
              <img
                src={visibleAvatar}
                alt="Profilkep elonezet"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {initials}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="block w-full text-sm text-slate-700 dark:text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-200 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-800 hover:file:bg-slate-300 dark:file:bg-slate-700 dark:file:text-slate-100 dark:hover:file:bg-slate-600 transition-colors"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
              JPG/PNG/WEBP, maximum 5 MB.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAvatar}
            disabled={savingAvatar}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {savingAvatar ? "Mentes..." : "Profilkep mentese"}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedAvatarFile(null);
              if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
              }
              setAvatarPreview(null);
              setRemoveAvatar(true);
              setAvatarSuccess(null);
              setAvatarError(null);
            }}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          >
            Profilkep torlese
          </button>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-4 transition-colors">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-60 transition-colors"
        >
          {deleting ? "Torles..." : "Profil torlese"}
        </button>
      </div>
    </div>
  );
}
