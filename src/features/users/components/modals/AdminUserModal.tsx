import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../../../components/ui/Modal";
import { api } from "../../../../lib/api";
import { companyApi } from "../../../companies/services/companyApi";
import type { Company, Id, Major } from "../../../../types/api.types";

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => Promise<void>;
  initialData: any;
  type: "COMPANY_ADMIN" | "UNIVERSITY_USER" | "USER" | null;
}

export default function AdminUserModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  type,
}: AdminUserModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isMajorsModalOpen, setIsMajorsModalOpen] = useState(false);
  const [isCompaniesModalOpen, setIsCompaniesModalOpen] = useState(false);
  const [majors, setMajors] = useState<Major[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedMajorIds, setSelectedMajorIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<Set<string>>(
    new Set(),
  );
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentSaveLoading, setAssignmentSaveLoading] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [assignmentMessage, setAssignmentMessage] = useState<string | null>(
    null,
  );

  const toIdString = (value: unknown): string => {
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    if (value && typeof value === "object" && "id" in value) {
      const id = (value as { id?: unknown }).id;
      if (typeof id === "string" || typeof id === "number") {
        return String(id);
      }
    }
    return "";
  };

  const extractAssignedIds = (data: any, keys: string[]): string[] => {
    for (const key of keys) {
      const value = data?.[key];
      if (!Array.isArray(value)) continue;
      const ids = value.map((item) => toIdString(item)).filter(Boolean);
      if (ids.length > 0) return ids;
    }
    return [];
  };

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({ ...initialData });
      setSelectedMajorIds(
        new Set(
          extractAssignedIds(initialData, [
            "majors",
            "managedMajors",
            "referentMajors",
          ]),
        ),
      );
      setSelectedCompanyIds(
        new Set(
          extractAssignedIds(initialData, [
            "companies",
            "managedCompanies",
            "referentCompanies",
          ]),
        ),
      );
    } else {
      setFormData({});
      setSelectedMajorIds(new Set());
      setSelectedCompanyIds(new Set());
    }

    setMajors([]);
    setCompanies([]);
    setAssignmentMessage(null);
    setError(null);
  }, [isOpen, initialData]);

  useEffect(() => {
    const loadAssignmentData = async () => {
      if (!isOpen) return;
      if (type !== "UNIVERSITY_USER" && !(type === "COMPANY_ADMIN" && !initialData?.id)) return;

      setAssignmentsLoading(true);
      setAssignmentError(null);

      try {
        const [majorsResponse, companiesResponse] = await Promise.all([
          type === "UNIVERSITY_USER" ? (api.majors.list({ page: 1, limit: 1000 }) as Promise<any>) : Promise.resolve([]),
          companyApi.list({ page: 1, limit: 1000 }),
        ]);

        const majorsData: Major[] = Array.isArray(majorsResponse?.data)
          ? majorsResponse.data
          : Array.isArray(majorsResponse)
            ? majorsResponse
            : [];

        setMajors(
          [...majorsData].sort((a, b) =>
            (a.name ?? "").localeCompare(b.name ?? ""),
          ),
        );
        setCompanies(
          [...companiesResponse].sort((a, b) =>
            (a.name ?? "").localeCompare(b.name ?? ""),
          ),
        );
      } catch (err) {
        console.error("Failed to load assignment data:", err);
        setAssignmentError("Nem sikerult betolteni a hozzarendelesi listakat.");
      } finally {
        setAssignmentsLoading(false);
      }
    };

    void loadAssignmentData();
  }, [isOpen, type]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSelection = (
    id: Id,
    setter: (updater: (prev: Set<string>) => Set<string>) => void,
  ) => {
    const key = String(id);
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSaveMajors = async () => {
    if (!initialData?.id) return;

    setAssignmentSaveLoading(true);
    setAssignmentError(null);
    setAssignmentMessage(null);

    try {
      await api.universityUsers.assignMajors(
        initialData.id,
        Array.from(selectedMajorIds),
      );
      setAssignmentMessage("Szak hozzarendelesek mentve.");
      setIsMajorsModalOpen(false);
    } catch (err: any) {
      setAssignmentError(err?.message || "Hiba a szakok mentese soran.");
    } finally {
      setAssignmentSaveLoading(false);
    }
  };

  const handleSaveCompanies = async () => {
    if (!initialData?.id) return;

    setAssignmentSaveLoading(true);
    setAssignmentError(null);
    setAssignmentMessage(null);

    try {
      await api.universityUsers.assignCompanies(
        initialData.id,
        Array.from(selectedCompanyIds),
      );
      setAssignmentMessage("Ceg hozzarendelesek mentve.");
      setIsCompaniesModalOpen(false);
    } catch (err: any) {
      setAssignmentError(err?.message || "Hiba a cegek mentese soran.");
    } finally {
      setAssignmentSaveLoading(false);
    }
  };

  const selectedMajorNames = useMemo(
    () =>
      majors
        .filter((major) => selectedMajorIds.has(String(major.id)))
        .map((major) => major.name)
        .slice(0, 3),
    [majors, selectedMajorIds],
  );

  const selectedCompanyNames = useMemo(
    () =>
      companies
        .filter((company) => selectedCompanyIds.has(String(company.id)))
        .map((company) => company.name)
        .slice(0, 3),
    [companies, selectedCompanyIds],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        fullName:
          formData.fullName || formData.name || formData.user?.fullName || "",
        email: formData.email || formData.user?.email || "",
      };

      if (!initialData?.id) {
        payload.password = formData.password;
        if (type === "COMPANY_ADMIN") {
          payload.companyId = formData.companyId;
          payload.jobTitle = formData.jobTitle;
        }
      }

      await onSave(payload);
    } catch (err: any) {
      setError(err.message || "Hiba a mentes soran.");
    } finally {
      setLoading(false);
    }
  };

  const titleMap: Record<string, string> = {
    COMPANY_ADMIN: "Cégadmin",
    UNIVERSITY_USER: "Egyetemi felhasznalo",
    USER: "Felhasznalo",
  };

  const isEditing = !!initialData?.id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type ? `${isEditing ? 'Szerkesztés' : 'Új'} - ${titleMap[type]}` : "Szerkesztes"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400 transition-colors">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
              Nev
            </label>
            <input
              type="text"
              required
              value={
                formData.fullName ||
                formData.name ||
                formData.user?.fullName ||
                ""
              }
              onChange={(e) => {
                handleChange("fullName", e.target.value);
                handleChange("name", e.target.value);
              }}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email || formData.user?.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {isEditing && type === "USER" && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">Statusz:</span>
              <span
                className={`text-sm font-semibold ${formData.isActive ? "text-green-600" : "text-red-600"}`}
              >
                {formData.isActive ? "Aktiv" : "Inaktiv"}
              </span>
            </div>
          )}

          {!isEditing && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Jelszó
              </label>
              <input
                type="password"
                required
                value={formData.password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                minLength={8}
              />
            </div>
          )}

          {!isEditing && type === "COMPANY_ADMIN" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                  Cég
                </label>
                <select
                  required
                  value={formData.companyId || ""}
                  onChange={(e) => handleChange("companyId", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Válasszon céget...</option>
                  {companies.map((company) => (
                    <option key={String(company.id)} value={String(company.id)}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                  Munkakör
                </label>
                <input
                  type="text"
                  required
                  value={formData.jobTitle || ""}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </>
          )}

          {isEditing && type === "UNIVERSITY_USER" && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4 space-y-4 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors">
                    Hozzarendelt szakok
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                    {selectedMajorIds.size} kivalasztott szak
                    {selectedMajorNames.length > 0
                      ? ` (${selectedMajorNames.join(", ")}${selectedMajorIds.size > 3 ? ", ..." : ""})`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMajorsModalOpen(true)}
                  disabled={assignmentsLoading}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Szakok szerkesztese
                </button>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors">
                    Hozzarendelt cegek
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                    {selectedCompanyIds.size} kivalasztott ceg
                    {selectedCompanyNames.length > 0
                      ? ` (${selectedCompanyNames.join(", ")}${selectedCompanyIds.size > 3 ? ", ..." : ""})`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCompaniesModalOpen(true)}
                  disabled={assignmentsLoading}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cegek szerkesztese
                </button>
              </div>

              {assignmentsLoading && (
                <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                  Hozzarendelesi adatok betoltese...
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Megse
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Mentes..." : "Mentes"}
          </button>
        </div>
      </form>

      <Modal
        isOpen={isMajorsModalOpen}
        onClose={() => setIsMajorsModalOpen(false)}
        title="Szakok hozzarendelese"
        size="2xl"
      >
        <div className="space-y-4">
          {assignmentError && (
            <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400 transition-colors">
              {assignmentError}
            </div>
          )}
          {assignmentMessage && (
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 p-3 text-sm text-emerald-700 dark:text-emerald-400 transition-colors">
              {assignmentMessage}
            </div>
          )}

          <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors">
            {majors.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400 transition-colors">
                Nincs elerheto szak.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {majors.map((major) => {
                  const id = String(major.id);
                  return (
                    <li key={id} className="px-4 py-2">
                      <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedMajorIds.has(id)}
                          onChange={() =>
                            toggleSelection(major.id, setSelectedMajorIds)
                          }
                          className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{major.name}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsMajorsModalOpen(false)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Megse
            </button>
            <button
              type="button"
              onClick={handleSaveMajors}
              disabled={assignmentSaveLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {assignmentSaveLoading ? "Mentes..." : "Mentes"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCompaniesModalOpen}
        onClose={() => setIsCompaniesModalOpen(false)}
        title="Cegek hozzarendelese"
        size="2xl"
      >
        <div className="space-y-4">
          {assignmentError && (
            <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400 transition-colors">
              {assignmentError}
            </div>
          )}
          {assignmentMessage && (
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 p-3 text-sm text-emerald-700 dark:text-emerald-400 transition-colors">
              {assignmentMessage}
            </div>
          )}

          <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors">
            {companies.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400 transition-colors">
                Nincs elerheto ceg.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {companies.map((company) => {
                  const id = String(company.id);
                  return (
                    <li key={id} className="px-4 py-2">
                      <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedCompanyIds.has(id)}
                          onChange={() =>
                            toggleSelection(company.id, setSelectedCompanyIds)
                          }
                          className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{company.name}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCompaniesModalOpen(false)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Megse
            </button>
            <button
              type="button"
              onClick={handleSaveCompanies}
              disabled={assignmentSaveLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {assignmentSaveLoading ? "Mentes..." : "Mentes"}
            </button>
          </div>
        </div>
      </Modal>
    </Modal>
  );
}
