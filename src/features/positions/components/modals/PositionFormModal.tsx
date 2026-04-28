import { useEffect, useState } from "react";
import { type Position, type Tag, type Location } from "../../../../lib/api";
import { companyApi } from "../../../../features/companies/services/companyApi";
import { Modal } from "../../../../components/ui/Modal";
import { useMajors } from "../../../majors";

interface PositionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Position, "id">) => Promise<void>;
  companies: { id: string | number; name: string }[];
  initialData?: Position | null;
}

// Update state matching the new requirement
interface PositionFormData extends Omit<Position, "id" | "location" | "major"> {
  locationId: string;
  majorId: string;
}

const INITIAL_FORM_STATE: PositionFormData = {
  companyId: "",
  title: "",
  description: "",
  locationId: "",
  majorId: "",
  deadline: "",
  type: "DUAL",
  tags: [],
};

// Helper to format ISO string for datetime-local input
const formatDeadlineForInput = (iso?: string | null) => (iso ? iso.slice(0, 16) : "");

// Helper to format local datetime string to UTC ISO string
const formatDeadlineForApi = (local?: string | null) =>
  local ? new Date(local).toISOString() : null;

export default function PositionFormModal({
  isOpen,
  onClose,
  onSave,
  companies,
  initialData,
}: PositionFormModalProps) {
  const [formData, setFormData] =
    useState<PositionFormData>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableLocations, setAvailableLocations] = useState<Location[]>([]);

  const { majors, loading: majorsLoading } = useMajors();

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (initialData) {
        setFormData({
          ...initialData,
          companyId:
            initialData.companyId ||
            (companies.length === 1 ? String(companies[0].id) : ""),
          locationId:
            initialData.locationId ||
            (initialData.location?.id ? String(initialData.location.id) : ""),
          majorId:
            initialData.majorId ||
            (initialData.major?.id ? String(initialData.major.id) : ""),
          deadline: formatDeadlineForInput(initialData.deadline),
          tags: initialData.tags || [],
        });
      } else {
        setFormData({
          ...INITIAL_FORM_STATE,
          companyId: companies.length === 1 ? String(companies[0].id) : "",
        });
      }
    }
  }, [isOpen, initialData, companies]);

  // Fetch company locations when companyId changes
  useEffect(() => {
    const fetchCompanyLocations = async () => {
      if (!formData.companyId) {
        setAvailableLocations([]);
        return;
      }

      try {
        const company = await companyApi.get(formData.companyId);
        if (company && company.locations) {
          setAvailableLocations(company.locations);
        } else {
          setAvailableLocations([]);
        }
      } catch (err) {
        console.error("Failed to fetch company locations:", err);
        setAvailableLocations([]);
      }
    };

    fetchCompanyLocations();
  }, [formData.companyId]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagChange = (index: number, field: keyof Tag, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = { ...newTags[index], [field]: value };
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, { name: "", category: "" }],
    }));
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("A pozíció megnevezése kötelező.");
      return;
    }
    if (!formData.companyId.trim()) {
      setError("A cég kiválasztása kötelező.");
      return;
    }
    if (!formData.locationId.trim()) {
      setError("A munkavégzés helyének kiválasztása kötelező.");
      return;
    }
    if (!formData.majorId.trim()) {
      setError("A szak kiválasztása kötelező.");
      return;
    }

    setLoading(true);
    try {
      type PositionPayload = Omit<PositionFormData, "deadline"> & {
        deadline: string | null;
      };
      const payload: PositionPayload = {
        ...formData,
        deadline: formatDeadlineForApi(formData.deadline),
        tags: formData.tags
          .map((tag) => ({
            name: tag.name.trim(),
            category: tag.category?.trim() || undefined,
          }))
          .filter((tag) => tag.name),
      };

      await onSave(payload as unknown as Omit<Position, "id">);
      onClose();
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Mentés sikertelen.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Pozíció szerkesztése` : "Új pozíció létrehozása"}
      size="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
              Cég *
            </label>
            <select
              name="companyId"
              value={formData.companyId}
              onChange={handleFormChange}
              disabled={companies.length === 1}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-900/50 disabled:text-slate-500 dark:disabled:text-slate-500 transition-colors"
            >
              <option value="">Válassz céget...</option>
              {companies.map((c) => (
                <option key={String(c.id)} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
              Szak *
            </label>
            <select
              name="majorId"
              value={formData.majorId}
              onChange={handleFormChange}
              disabled={majorsLoading}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-900/50 disabled:text-slate-500 dark:disabled:text-slate-500 transition-colors"
            >
              <option value="">Válassz szakot...</option>
              {majors.map((m) => (
                <option key={String(m.id)} value={String(m.id)}>
                  {m.name} {m.language ? `(${m.language})` : ""}
                </option>
              ))}
            </select>
            {majorsLoading && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-colors">
                Szakok betöltése...
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
            Megnevezés *
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
            Leírás *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            rows={5}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>

        {/* Location Selection - Simplified */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
            Munkavégzés helye *
          </label>
          <select
            name="locationId"
            value={formData.locationId}
            onChange={handleFormChange}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-900/50 disabled:text-slate-500 dark:disabled:text-slate-500 transition-colors"
            disabled={availableLocations.length === 0}
          >
            <option value="">
              {availableLocations.length === 0
                ? formData.companyId
                  ? "A céghez nem tartoznak címek"
                  : "Előbb válassz céget..."
                : "Válassz munkavégzési helyet..."}
            </option>
            {availableLocations.map((loc) => (
              <option key={String(loc.id)} value={String(loc.id)}>
                {loc.city}, {loc.address} ({loc.zipCode})
              </option>
            ))}
          </select>
          {availableLocations.length === 0 && formData.companyId && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠️ A kiválasztott céghez nem tartoznak rögzített címek. Kérjük,
              előbb a cég profiljában adjon hozzá címet.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
            Jelentkezési határidő
          </label>

          {/* Folyamatos jelentkezés toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 transition-colors">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 transition-colors">
                Folyamatos jelentkezés
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 transition-colors">
                Nincs lejárati dátum, bármikor lehet jelentkezni
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  deadline: prev.deadline
                    ? ""
                    : formatDeadlineForInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()),
                }))
              }
              className={[
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                !formData.deadline
                  ? "bg-nje-jaffa"
                  : "bg-slate-300 dark:bg-slate-600",
              ].join(" ")}
              aria-label="Folyamatos jelentkezés kapcsoló"
            >
              <span
                className={[
                  "inline-block h-5 w-5 transform rounded-full bg-white transition",
                  !formData.deadline ? "translate-x-5" : "translate-x-1",
                ].join(" ")}
              />
            </button>
          </div>

          {/* Dátumválasztó – csak ha van határidő */}
          {!!formData.deadline && (
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            />
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
            Állás típusa *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleFormChange}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          >
            <option value="DUAL">Duális állás</option>
            <option value="PROFESSIONAL_PRACTICE">Szakmai gyakorlat</option>
          </select>
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 transition-colors">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors">
              Címkék
            </label>
            <button
              type="button"
              onClick={addTag}
              className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              + Címke
            </button>
          </div>
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                placeholder="Név (pl. React)"
                value={tag.name}
                onChange={(e) => handleTagChange(index, "name", e.target.value)}
                className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-2 py-1.5 text-sm transition-colors"
              />
              <input
                placeholder="Kategória (opcionális)"
                value={tag.category}
                onChange={(e) =>
                  handleTagChange(index, "category", e.target.value)
                }
                className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-2 py-1.5 text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="rounded-md bg-red-50 dark:bg-red-900/20 p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
          {formData.tags.length === 0 && (
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 py-2 transition-colors">
              Nincsenek címkék hozzáadva.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 transition-colors">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-60 transition-colors"
          >
            Mégse
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-colors"
          >
            {loading
              ? "Mentés..."
              : initialData
                ? "Módosítások mentése"
                : "Pozíció létrehozása"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
