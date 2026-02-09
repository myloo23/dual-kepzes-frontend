import { useEffect, useState } from "react";
import { Modal } from "../../../../components/ui/Modal";

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

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({ ...initialData }); // Clone to avoid mutation
    } else {
      setFormData({});
    }
    setError(null);
  }, [isOpen, initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Hiba a mentés során.");
    } finally {
      setLoading(false);
    }
  };

  const titleMap: Record<string, string> = {
    COMPANY_ADMIN: "Cégadmin szerkesztése",
    UNIVERSITY_USER: "Egyetemi felhasználó szerkesztése",
    USER: "Felhasználó szerkesztése",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type ? titleMap[type] : "Szerkesztés"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Common Fields */}
          {/* Note: In real app, might need to handle nested 'user' object if data structure differs */}

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Név
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email || formData.user?.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Inactive User Specifics */}
          {type === "USER" && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                Státusz:
              </span>
              <span
                className={`text-sm font-semibold ${formData.isActive ? "text-green-600" : "text-red-600"}`}
              >
                {formData.isActive ? "Aktív" : "Inaktív"}
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Mégse
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Mentés..." : "Mentés"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
