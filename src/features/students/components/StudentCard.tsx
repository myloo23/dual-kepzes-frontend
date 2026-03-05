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
    <article className="h-full rounded-xl border border-dkk-gray/30 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Header with student name */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-dkk-blue dark:group-hover:text-blue-400 transition">
          {student.fullName}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">
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
            className="text-dkk-blue dark:text-blue-400 hover:underline truncate transition-colors"
          >
            {student.email}
          </a>
        </div>

        {/* High School / Institution */}
        <div className="flex items-start gap-1.5 text-xs">
          <span className="text-slate-400 flex-shrink-0">🏫</span>
          <div className="flex-1 min-w-0">
            <p className="text-slate-600 dark:text-slate-400 line-clamp-2 transition-colors">
              {profile.highSchool}
            </p>
          </div>
        </div>

        {/* Education Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-400 dark:text-slate-500 mb-0.5 transition-colors">
              Végzés éve
            </p>
            <p className="text-slate-900 dark:text-slate-100 font-medium transition-colors">
              {profile.graduationYear}
            </p>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 mb-0.5 transition-colors">
              Tagozat
            </p>
            <p className="text-slate-900 dark:text-slate-100 font-medium transition-colors">
              {studyModeText}
            </p>
          </div>
        </div>

        {/* Language Information */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 dark:text-slate-500 transition-colors">
              Nyelvvizsga:
            </span>
            <span
              className={`font-medium transition-colors ${profile.hasLanguageCert ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}
            >
              {languageCertText}
            </span>
          </div>
          {profile.language && profile.languageLevel && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 dark:text-slate-500 transition-colors">
                Nyelv:
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-medium transition-colors">
                {languageProficiency}
              </span>
            </div>
          )}
        </div>

        {/* Major Badge */}
        <div className="flex flex-wrap gap-1.5">
          {/* Student Type Badge */}
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
              isHighSchoolStudent
                ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50"
                : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50"
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
