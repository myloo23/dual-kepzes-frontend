/**
 * StudentCard Component
 * Displays individual student information in a card format
 * Similar design to JobCard for consistency
 */

import type { AvailableStudent } from "../types";

interface StudentCardProps {
  student: AvailableStudent;
  onViewDetails?: (studentId: string) => void;
}

export const StudentCard = ({ student, onViewDetails }: StudentCardProps) => {
  const profile = student.studentProfile;

  // Format study mode - API returns NAPPALI or LEVELEZŐ in uppercase
  const studyModeText =
    profile.studyMode?.toUpperCase() === "NAPPALI" ? "Nappali" : "Levelező";

  // Language certification display
  const languageCertText = profile.hasLanguageCert ? "✓ Van" : "Nincs";

  // Language proficiency
  const languageProficiency =
    profile.language && profile.languageLevel
      ? `${profile.language} ${profile.languageLevel}`
      : "—";

  // Determine if student is in high school or university
  // Logic: If they have a major (university program), they're a university student
  // Otherwise, check if graduation year is in the future (still in high school)

  // API provides explicit boolean for high school status
  const isHighSchoolStudent = profile.isInHighSchool;

  return (
    <article className="h-full rounded-xl border border-dkk-gray/30 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Header with student name */}
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-900 leading-tight group-hover:text-dkk-blue transition">
          {student.fullName}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          {profile.major?.name || "Nincs megadva"}
        </p>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow space-y-3">
        {/* Email */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 flex-shrink-0">✉️</span>
          <a
            href={`mailto:${student.email}`}
            className="text-dkk-blue hover:underline truncate"
          >
            {student.email}
          </a>
        </div>

        {/* High School / Institution */}
        <div className="flex items-start gap-1.5 text-xs">
          <span className="text-slate-400 flex-shrink-0">🏫</span>
          <div className="flex-1 min-w-0">
            <p className="text-slate-600 line-clamp-2">{profile.highSchool}</p>
          </div>
        </div>

        {/* Education Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-400 mb-0.5">Végzés éve</p>
            <p className="text-slate-900 font-medium">
              {profile.graduationYear}
            </p>
          </div>
          <div>
            <p className="text-slate-400 mb-0.5">Tagozat</p>
            <p className="text-slate-900 font-medium">{studyModeText}</p>
          </div>
        </div>

        {/* Language Information */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Nyelvvizsga:</span>
            <span
              className={`font-medium ${profile.hasLanguageCert ? "text-emerald-600" : "text-slate-400"}`}
            >
              {languageCertText}
            </span>
          </div>
          {profile.language && profile.languageLevel && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Nyelv:</span>
              <span className="text-slate-900 font-medium">
                {languageProficiency}
              </span>
            </div>
          )}
        </div>

        {/* Major Badge */}
        <div className="flex flex-wrap gap-1.5">
          {/* Student Type Badge */}
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
              isHighSchoolStudent
                ? "bg-purple-50 text-purple-700 border border-purple-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {isHighSchoolStudent ? "🎓 Középiskolás" : "🎓 Egyetemista"}
          </span>

          {profile.major?.language && (
            <span className="inline-flex items-center rounded-full bg-dkk-blue/10 px-2 py-0.5 text-[10px] font-medium text-dkk-blue">
              {profile.major.language}
            </span>
          )}
          {profile.isAvailableForWork && (
            <span className="inline-flex items-center rounded-full bg-dkk-green/10 px-2 py-0.5 text-[10px] font-medium text-dkk-green">
              Elérhető munkára
            </span>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={() => onViewDetails?.(student.id)}
          className="w-full rounded-lg bg-dkk-green px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-dkk-green/90 transition-colors"
        >
          Részletek
        </button>
      </div>
    </article>
  );
};
