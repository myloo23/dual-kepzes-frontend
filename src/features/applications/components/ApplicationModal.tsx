import { useState, useRef } from "react";
import LocationMap from "./LocationMap";
import { Modal } from "../../../components/ui/Modal";
import { Upload, FileText, X } from "lucide-react";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: {
    id: string;
    title: string;
    company?: { name: string };
    city?: string;
    address?: string;
  };
  onSubmit: (
    note: string,
    cvFile?: File,
    motivationLetterFile?: File,
  ) => Promise<void>;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  position,
  onSubmit,
}: ApplicationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File states
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [motivationFile, setMotivationFile] = useState<File | null>(null);

  // Refs for hidden inputs
  const cvInputRef = useRef<HTMLInputElement>(null);
  const motivationInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    // Validation: Ensure valid file types are selected if any
    // (Input accept attribute handles the picker, but good to be safe?)
    // Currently making CV optional? Or mandatory?
    // User didn't specify mandatory, but usually CV is mandatory.
    // Let's keep it optional for now to match strict request or just validation on type.

    setLoading(true);
    setError(null);
    try {
      await onSubmit("", cvFile || undefined, motivationFile || undefined);

      // Reset state
      setCvFile(null);
      setMotivationFile(null);
      onClose();
    } catch (err: any) {
      setError(err.message || "Hiba történt a jelentkezés során.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setCvFile(null);
      setMotivationFile(null);
      setError(null);
      onClose();
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (f: File | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate type
      if (
        ![
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
        setError("Csak PDF és DOCX fájlok tölthetők fel.");
        return;
      }
      // Validate size (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("A fájl mérete nem haladhatja meg az 5MB-ot.");
        return;
      }
      setError(null);
      setter(file);
    }
  };

  // Construct title and description
  const title = "Jelentkezés pozícióra";
  const description = `${position.title}${position.company?.name ? ` • ${position.company.name}` : ""}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      description={description}
      size="2xl"
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* CV Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">
              Önéletrajz
            </label>
            <input
              type="file"
              ref={cvInputRef}
              className="hidden"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => handleFileChange(e, setCvFile)}
            />

            {!cvFile ? (
              <button
                onClick={() => cvInputRef.current?.click()}
                disabled={loading}
                className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-slate-600 transition-all hover:bg-slate-100 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50"
              >
                <div className="rounded-full bg-white p-2 shadow-sm">
                  <Upload className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">
                  Önéletrajz feltöltése
                </span>
                <span className="text-xs text-slate-400">
                  PDF, DOCX (max 5MB)
                </span>
              </button>
            ) : (
              <div className="relative flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-blue-900">
                    {cvFile.name}
                  </p>
                  <p className="text-xs text-blue-700">
                    {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCvFile(null);
                    if (cvInputRef.current) cvInputRef.current.value = "";
                  }}
                  className="rounded-full p-1 text-blue-400 hover:bg-blue-100 hover:text-blue-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Motivation Letter Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">
              Motivációs levél{" "}
              <span className="text-slate-400 font-normal">(opcionális)</span>
            </label>
            <input
              type="file"
              ref={motivationInputRef}
              className="hidden"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => handleFileChange(e, setMotivationFile)}
            />

            {!motivationFile ? (
              <button
                onClick={() => motivationInputRef.current?.click()}
                disabled={loading}
                className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-slate-600 transition-all hover:bg-slate-100 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50"
              >
                <div className="rounded-full bg-white p-2 shadow-sm">
                  <Upload className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">
                  Motivációs levél feltöltése
                </span>
                <span className="text-xs text-slate-400">
                  PDF, DOCX (max 5MB)
                </span>
              </button>
            ) : (
              <div className="relative flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-blue-900">
                    {motivationFile.name}
                  </p>
                  <p className="text-xs text-blue-700">
                    {(motivationFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMotivationFile(null);
                    if (motivationInputRef.current)
                      motivationInputRef.current.value = "";
                  }}
                  className="rounded-full p-1 text-blue-400 hover:bg-blue-100 hover:text-blue-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            <strong>Tipp:</strong> Tölts fel PDF formátumú dokumentumokat a
            legjobb kompatibilitás érdekében.
          </p>
        </div>

        {/* Location Map */}
        {position.company?.name && position.city && position.address && (
          <LocationMap
            companyName={position.company.name}
            companyCity={position.city}
            companyAddress={position.address}
          />
        )}

        {/* Footer */}
        <div className="border-t border-slate-200 pt-4 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mégse
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!cvFile && !motivationFile)} // Require at least one file? Or purely optional? Let's say at least one thing is needed or CV is needed. But user said "file upload buttons". I'll disable if both empty if keeping note empty.
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Jelentkezés..." : "Jelentkezés"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
