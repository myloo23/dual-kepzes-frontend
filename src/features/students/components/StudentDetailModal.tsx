import { useState, useEffect } from "react";
import {
  X,
  Mail,
  MapPin,
  GraduationCap,
  Building2,
  Calendar,
} from "lucide-react";
import type { StudentProfile } from "@/types/api.types";
import { studentsApi } from "@/features/students/services/studentsApi";
import { useToast } from "@/hooks/useToast";

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
}

export default function StudentDetailModal({
  isOpen,
  onClose,
  student,
}: StudentDetailModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !student) return null;

  const handleInterest = async () => {
    setLoading(true);
    try {
      if (!student.userId) throw new Error("Student User ID missing");
      await studentsApi.interest(student.userId);

      toast.showSuccess("Sikeresen elküldtük a megkeresést");
      onClose();
    } catch (error) {
      console.error(error);
      toast.showError("Nem sikerült elküldeni a megkeresést.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl transition-colors">
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 transition-colors">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            Hallgatói profil
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Main Info */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 flex items-center justify-center text-3xl shrink-0 border border-blue-200/50 dark:border-blue-800/30 shadow-sm transition-colors">
              🎓
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-colors">
                  {student.fullName}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-400 mt-2 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    {student.currentMajor}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {student.location?.city}, {student.location?.address}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {student.birthDate || student.dateOfBirth}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {student.languageExams?.map((exam, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-400/20 transition-colors"
                  >
                    {exam.language} {exam.level}
                  </span>
                ))}
                {student.studyMode && (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-700/10 dark:ring-emerald-400/20 transition-colors">
                    {student.studyMode === "NAPPALI" ? "Nappali" : "Levelező"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Motivation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 transition-colors">
              <span className="h-px w-8 bg-slate-200 dark:bg-slate-700"></span>
              Motivációs levél
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>
            </h3>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800 transition-colors">
              {student.motivationLetter ? (
                <p className="whitespace-pre-wrap">
                  {student.motivationLetter}
                </p>
              ) : (
                <p className="text-slate-400 dark:text-slate-500 italic transition-colors">
                  A hallgató nem töltött fel motivációs levelet.
                </p>
              )}
            </div>
          </div>

          {/* School Info Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-1 transition-colors">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">
                Intézmény
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 transition-colors">
                <Building2 className="h-4 w-4 text-slate-400" />
                {student.highSchool || "Egyetem"}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-1 transition-colors">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">
                Végzés éve
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 transition-colors">
                {student.graduationYear}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 rounded-b-2xl transition-colors">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Bezárás
          </button>
          <button
            onClick={handleInterest}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            Megkeresés küldése
          </button>
        </div>
      </div>
    </div>
  );
}
