/**
 * StudentList Component
 * Container component for displaying a grid of student cards
 */

import { StudentCard } from "./StudentCard";
import { useAvailableStudents } from "../hooks/useAvailableStudents";

export const StudentList = () => {
  const { students, isLoading, error, refetch } = useAvailableStudents();

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-80 rounded-xl border border-slate-200 bg-slate-50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Hiba történt
          </h3>
          <p className="text-sm text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-dkk-blue px-4 py-2 text-sm font-semibold text-white hover:bg-dkk-blue/90 transition-colors"
          >
            Újrapróbálkozás
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Nincs elérhető hallgató
          </h3>
          <p className="text-sm text-slate-600">
            Jelenleg nincsenek munkára elérhető hallgatók a rendszerben.
          </p>
        </div>
      </div>
    );
  }

  // Success state with student cards
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Elérhető Hallgatók
          <span className="ml-2 text-sm font-normal text-slate-500">
            ({students.length})
          </span>
        </h2>
        <button
          onClick={() => refetch()}
          className="text-sm text-dkk-blue hover:text-dkk-blue/80 font-medium transition-colors"
        >
          🔄 Frissítés
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onViewDetails={(id) => {
              // TODO: Implement details modal or navigation
              console.log("View student details:", id);
            }}
          />
        ))}
      </div>
    </div>
  );
};
