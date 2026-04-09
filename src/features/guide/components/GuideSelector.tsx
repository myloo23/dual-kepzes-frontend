import { useState, useEffect } from "react";
import type { GuideCourse } from "../types";
import { materialsApi } from "../services/materialsApi";

interface GuideSelectorProps {
  courses: GuideCourse[];
  onSelect: (course: GuideCourse) => void;
}

export function GuideSelector({ courses, onSelect }: GuideSelectorProps) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    materialsApi
      .getProgress()
      .then((progress) => {
        if (mounted && progress) {
          setCompletedIds(progress.map((p) => p.materialId));
        }
      })
      .catch((err) => console.error("Failed to load progress in selector", err));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {courses.map((course) => {
        const isCompleted = completedIds.includes(course.id);

        return (
          <div
            key={course.id}
            className={`relative rounded-2xl border bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center ${
              isCompleted 
                ? "border-emerald-200 dark:border-emerald-800" 
                : "border-slate-200 dark:border-slate-800"
            }`}
            onClick={() => onSelect(course)}
          >
            {isCompleted && (
              <div 
                className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-2 shadow-sm animate-in zoom-in" 
                title="Ezt a tananyagot már elvégezted és értékelted."
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
              📚
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 transition-colors">
              {course.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 flex-1 transition-colors">
              {course.description}
            </p>
            <button 
              className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                isCompleted 
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 group-hover:bg-blue-600 group-hover:text-white"
              }`}
            >
              {"Megtekintés"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
