import { useEffect, useState } from "react";
import { api, type Position } from "../../lib/api";
import { companyApi } from "../../features/companies/services/companyApi";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/shared/ToastContainer";
import {
  Briefcase,
  MapPin,
  Calendar,
  Search,
  Tag as TagIcon,
  Building,
  GraduationCap
} from "lucide-react";

export default function MentorPositionsPage() {
  const toast = useToast();
  const [positions, setPositions] = useState<Position[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const me = await api.employees.me.get();

      if (me.companyId) {
        // Fetch company details
        try {
          const company = await companyApi.get(me.companyId);
          setCompanyName(company.name);
        } catch {
          setCompanyName("Vállalatunk");
        }

        // Fetch company positions
        const list = await api.positions.listByCompany(me.companyId);
        setPositions(Array.isArray(list) ? list : []);
      } else {
        toast.showError("Nem sikerült azonosítani a hozzád rendelt céget.");
      }
    } catch (err: unknown) {
      console.error("Nem sikerült betölteni az álláshirdetéseket:", err);
      toast.showError("Hiba történt a pozíciók lekérésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredPositions = positions.filter((pos) => {
    const matchesSearch =
      pos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pos.major?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "ALL" || pos.type === selectedType;

    return matchesSearch && matchesType;
  });

  const getPositionTypeBadge = (type?: string) => {
    switch (type) {
      case "DUAL":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
            Duális képzés
          </span>
        );
      case "PROFESSIONAL_PRACTICE":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
            Szakmai gyakorlat
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-50 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-650 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Normál munka
          </span>
        );
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Folyamatos jelentkezés";
    return new Date(dateStr).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
          Cégünk Hirdetései
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">
          A(z) <span className="font-semibold text-slate-800 dark:text-slate-200">{companyName || "partnercég"}</span> által meghirdetett aktív és inaktív pozíciók.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <section className="flex flex-col sm:flex-row gap-4 items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Keresés megnevezésre vagy szakra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        <div className="w-full sm:w-auto shrink-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="ALL">Összes típus</option>
            <option value="DUAL">Duális képzés</option>
            <option value="PROFESSIONAL_PRACTICE">Szakmai gyakorlat</option>
            <option value="REGULAR_WORK">Normál munka</option>
          </select>
        </div>
      </section>

      {/* Positions Grid */}
      {filteredPositions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-slate-500 dark:text-slate-450 transition-colors">
          <Briefcase className="w-12 h-12 text-slate-350 mx-auto mb-3" />
          <p className="font-semibold">Nincs találat a megadott feltételekkel.</p>
          <p className="text-xs mt-1">Próbálkozz más keresőszóval vagy szűrővel.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPositions.map((pos) => (
            <div
              key={pos.id}
              className={`rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                pos.isActive !== false
                  ? "border-slate-200 dark:border-slate-800"
                  : "border-slate-200 dark:border-slate-850 opacity-60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 transition-colors">
                      {pos.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-450 transition-colors flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5" />
                      {companyName}
                    </p>
                  </div>
                  {pos.isActive === false && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 border border-slate-300/40 dark:bg-slate-800 dark:text-slate-450 dark:border-slate-700">
                      Inaktív
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {getPositionTypeBadge(pos.type)}
                  {pos.major?.name && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-55 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-450" />
                      {pos.major.name}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed transition-colors">
                  {pos.description}
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 dark:text-slate-450 transition-colors">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {pos.location?.city || "Ismeretlen telephely"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Jelentkezési határidő: {formatDate(pos.deadline)}
                </span>
              </div>

              {/* Tags Section */}
              {pos.tags && pos.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {pos.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded bg-indigo-50/50 dark:bg-indigo-950/20 px-2 py-0.5 text-[10px] font-medium text-indigo-650 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30"
                    >
                      <TagIcon className="w-2.5 h-2.5" />
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  );
}
