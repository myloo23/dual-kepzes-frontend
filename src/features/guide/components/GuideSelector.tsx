import type { GuideCourse } from "../types";

interface GuideSelectorProps {
  courses: GuideCourse[];
  onSelect: (course: GuideCourse) => void;
}

export function GuideSelector({ courses, onSelect }: GuideSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {courses.map((course) => (
        <div
          key={course.id}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center"
          onClick={() => onSelect(course)}
        >
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
            📚
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 transition-colors">
            {course.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 flex-1 transition-colors">
            {course.description}
          </p>
          <button className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            Kiválasztás
          </button>
        </div>
      ))}
    </div>
  );
}
