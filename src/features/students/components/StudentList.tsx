/**
 * StudentList Component
 * Container component for displaying a grid of student cards
 */

import { useState } from "react";
import { StudentCard } from "./StudentCard";
import { StudentFilters, type StudentFiltersState } from "./StudentFilters";
import { useAvailableStudents } from "../hooks/useAvailableStudents";

export const StudentList = () => {
  const { students, isLoading, error, refetch } = useAvailableStudents();
  const [filters, setFilters] = useState<StudentFiltersState>({
    search: "",
    type: "ALL",
    isAvailable: false,
    hasLanguageCert: false,
  });

  // Filter logic
  const filteredStudents = students.filter((student) => {
    // Search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchName = student.fullName.toLowerCase().includes(searchTerm);
      const matchEmail = student.email.toLowerCase().includes(searchTerm);
      if (!matchName && !matchEmail) return false;
    }

    // Type
    if (filters.type !== "ALL") {
      const isHighSchool = student.studentProfile.isInHighSchool;
      if (filters.type === "HIGH_SCHOOL" && !isHighSchool) return false;
      if (filters.type === "UNIVERSITY" && isHighSchool) return false;
    }

    // Available
    if (filters.isAvailable && !student.studentProfile.isAvailableForWork) {
      return false;
    }

    // Language Cert
    if (filters.hasLanguageCert && !student.studentProfile.hasLanguageCert) {
      return false;
    }

    return true;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-xl border border-slate-200 bg-slate-50 animate-pulse"
            />
          ))}
        </div>
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Elérhető Hallgatók
            <span className="ml-2 text-sm font-normal text-slate-500">
              ({filteredStudents.length} / {students.length})
            </span>
          </h2>
          <button
            onClick={() => refetch()}
            className="text-sm text-dkk-blue hover:text-dkk-blue/80 font-medium transition-colors"
          >
            🔄 Frissítés
          </button>
        </div>

        <StudentFilters filters={filters} onFilterChange={setFilters} />
      </div>

      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              Nincs találat
            </h3>
            <p className="text-sm text-slate-500">
              A keresési feltételeknek egyetlen hallgató sem felel meg.
              <br />
              Próbáld meg módosítani a szűrőket.
            </p>
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  type: "ALL",
                  isAvailable: false,
                  hasLanguageCert: false,
                })
              }
              className="mt-4 text-sm text-dkk-blue font-medium hover:underline"
            >
              Szűrők törlése
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
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
      )}
    </div>
  );
};
