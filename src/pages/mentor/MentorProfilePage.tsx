import { useEffect, useState, type FormEvent } from "react";
import { api, type EmployeeProfile } from "../../lib/api";
import { companyApi } from "../../features/companies/services/companyApi";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/shared/ToastContainer";
import { User, Phone, Briefcase, Mail, Building, Save } from "lucide-react";

export default function MentorProfilePage() {
  const toast = useToast();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await api.employees.me.get();
      setProfile(data);

      // Pre-fill form
      setFullName(data.user?.fullName || "");
      setPhoneNumber(data.user?.phoneNumber || "");
      setJobTitle(data.jobTitle || "");

      // Get company name
      if (data.companyId) {
        try {
          const company = await companyApi.get(data.companyId);
          setCompanyName(company.name);
        } catch {
          setCompanyName("Partnercég");
        }
      }
    } catch (err: unknown) {
      console.error("Nem sikerült betölteni a profilt:", err);
      toast.showError("Hiba történt a profil adatok betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Frontend validations
    if (!fullName.trim() || !fullName.trim().includes(" ")) {
      toast.showError("Kérjük, add meg a teljes nevedet (vezetéknév és utónév)!");
      return;
    }

    if (phoneNumber && !/^\+?[0-9]{7,15}$/.test(phoneNumber.trim())) {
      toast.showError("Kérjük, érvényes telefonszámot adj meg (7-15 számjegy)!");
      return;
    }

    if (!jobTitle.trim()) {
      toast.showError("Kérjük, add meg a munkakörödet!");
      return;
    }

    setSaving(true);
    try {
      await api.employees.me.update({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
        jobTitle: jobTitle.trim(),
      } as any);
      toast.showSuccess("Profil sikeresen frissítve!");
      // Reload profile to refresh user state
      await loadProfile();
    } catch (err: unknown) {
      console.error("Hiba a profil mentésekor:", err);
      const errMsg = err instanceof Error ? err.message : "Sikertelen mentés.";
      toast.showError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
          Profil Beállítások
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">
          Kezelje személyes adatait, elérhetőségeit és szakmai beállításait.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors overflow-hidden">
        {/* Profile Card Header with Avatar */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-xl font-bold border border-indigo-200 dark:border-indigo-800">
            {fullName
              ? fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
              : "M"}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 transition-colors">
              {profile?.user?.fullName || "Mentor"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 transition-colors flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3.5 h-3.5" />
              {profile?.jobTitle || "Szakmai mentor"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-450" />
                Teljes név *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Pl. Kovács János"
              />
            </div>

            {/* Job Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-450" />
                Munkakör / Beosztás *
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Pl. Szenior Szoftverfejlesztő"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-450" />
                Telefonszám
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Pl. +36301234567"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                E-mail cím (nem módosítható)
              </label>
              <input
                type="email"
                disabled
                value={profile?.user?.email || ""}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-sm text-slate-500 dark:text-slate-450 cursor-not-allowed transition-colors"
              />
            </div>

            {/* Company (Read-only) */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                Hozzárendelt vállalat (nem módosítható)
              </label>
              <input
                type="text"
                disabled
                value={companyName || "Betöltés..."}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-sm text-slate-500 dark:text-slate-450 cursor-not-allowed transition-colors"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-end transition-colors">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? "Mentés..." : "Módosítások mentése"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  );
}
