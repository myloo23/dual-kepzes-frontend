import { useState, useRef } from "react";
import LocationMap from "./LocationMap";
import { Modal } from "../../../components/ui/Modal";
import { Upload, FileText, X, Briefcase, GraduationCap, MapPin, Calendar, Tag as TagIcon } from "lucide-react";
import type { Position, Tag } from "../../../types/api.types";
import {
  formatHuDate,
  isExpired,
  toTagName,
  norm,
  getPositionTypeConfig,
  pickLogo,
} from "../../positions/utils/positions.utils";
import abcTechLogo from "../../../assets/logos/abc-tech.jpg";
import businessItLogo from "../../../assets/logos/business-it.jpg";
import { resolveApiAssetUrl } from "../../../lib/media-url";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: Position;
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

  // Position details formatting
  const companyName = norm(position.company?.name) || "Ismeretlen cég";
  const jobTitle = norm(position.title) || "Névtelen pozíció";
  const cityText = norm(position.location?.city) || "—";
  const addressText = norm(position.location?.address) || "";
  const deadlineText = formatHuDate(position.deadline);
  const expired = isExpired(position.deadline);
  const typeConfig = getPositionTypeConfig(position.type);
  const descriptionText = norm(position.description);
  const majorName = norm(position.major?.name);
  const majorLanguage = norm(position.major?.language);
  
  const tags = (Array.isArray(position.tags) ? position.tags : [])
    .map((t: Tag) => norm(toTagName(t)))
    .filter(Boolean);

  const companyKey = norm(position.companyId ?? position.company?.name);
  const fallbackLogo = pickLogo(companyKey, {
    logo1: abcTechLogo,
    logo2: businessItLogo,
  });
  const logo = resolveApiAssetUrl(position.company?.logoUrl) ?? fallbackLogo;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit("", cvFile || undefined, motivationFile || undefined);

      // Reset state
      setCvFile(null);
      setMotivationFile(null);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Hiba történt a jelentkezés során.");
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Pozíció részletei és jelentkezés"
      size="3xl"
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
            {error}
          </div>
        )}

        {/* Position Details Section */}
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 space-y-5 transition-colors">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
              <img
                src={logo}
                alt={`${companyName} logó`}
                className="h-full w-full object-contain dark:opacity-90 dark:mix-blend-lighten"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug break-words">
                {jobTitle}
              </h3>
              <p className="text-sm font-semibold text-nje-jaffa mt-0.5">
                {companyName}
              </p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-semibold">Típus:</span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${typeConfig.badgeClass}`}>
                {typeConfig.label}
              </span>
            </div>

            {majorName && (
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <GraduationCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-semibold">Szak:</span>
                <span>{majorName} {majorLanguage ? `(${majorLanguage})` : ""}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-semibold">Helyszín:</span>
              <span>{cityText} {addressText ? `• ${addressText}` : ""}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-semibold">Határidő:</span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                expired
                  ? "bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-400"
                  : "bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400"
              }`}>
                {deadlineText}
              </span>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <div className="flex items-center gap-1.5 mr-1 text-slate-400">
                <TagIcon className="w-3.5 h-3.5" />
              </div>
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-nje-amethyst/10 dark:bg-nje-amethyst/20 px-2.5 py-0.5 text-xs font-medium text-nje-amethyst dark:text-nje-amethyst-light"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {descriptionText && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Pozíció leírása
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line max-h-[150px] overflow-y-auto pr-2">
                {descriptionText}
              </p>
            </div>
          )}
        </div>

        {/* Application Form Section */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Dokumentumok feltöltése
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Töltsd fel az önéletrajzodat és a motivációs leveledet a jelentkezéshez.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* CV Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
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
                  className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
                >
                  <div className="rounded-full bg-white dark:bg-slate-950 p-2 shadow-sm dark:shadow-none">
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">
                    Önéletrajz feltöltése
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    PDF, DOCX (max 5MB)
                  </span>
                </button>
              ) : (
                <div className="relative flex items-center gap-3 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-900/20 p-3">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900/60 p-2 text-blue-600 dark:text-blue-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-blue-900 dark:text-blue-100">
                      {cvFile.name}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCvFile(null);
                      if (cvInputRef.current) cvInputRef.current.value = "";
                    }}
                    className="rounded-full p-1 text-blue-400 dark:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Motivation Letter Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                Motivációs levél <span className="text-slate-400 dark:text-slate-500 font-normal">(opcionális)</span>
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
                  className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
                >
                  <div className="rounded-full bg-white dark:bg-slate-950 p-2 shadow-sm dark:shadow-none">
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">
                    Motivációs levél feltöltése
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    PDF, DOCX (max 5MB)
                  </span>
                </button>
              ) : (
                <div className="relative flex items-center gap-3 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-900/20 p-3">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900/60 p-2 text-blue-600 dark:text-blue-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-blue-900 dark:text-blue-100">
                      {motivationFile.name}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      {(motivationFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setMotivationFile(null);
                      if (motivationInputRef.current)
                        motivationInputRef.current.value = "";
                    }}
                    className="rounded-full p-1 text-blue-400 dark:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Tipp:</strong> Tölts fel PDF formátumú dokumentumokat a legjobb kompatibilitás érdekében.
          </p>
        </div>

        {/* Location Map */}
        {position.company?.name && position.location?.city && position.location?.address && (
          <LocationMap
            companyName={position.company.name}
            companyCity={position.location.city}
            companyAddress={position.location.address}
          />
        )}

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Mégse
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!cvFile && !motivationFile)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md transition-all"
          >
            {loading ? "Jelentkezés..." : "Jelentkezés"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
