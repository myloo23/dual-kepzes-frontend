import { useState } from "react";
import {
  GuidePlayer,
  GuideSelector,
  AVAILABLE_COURSES,
  type GuideCourse,
} from "../../features/guide";

export default function MentorGuidePage() {
  const [selectedCourse, setSelectedCourse] = useState<GuideCourse | null>(
    null,
  );

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm dark:shadow-none transition-colors">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 transition-colors">
          <span className="text-3xl">📚</span>
        </div>

        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
          Oktatási segédlet
        </h1>

        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto transition-colors">
          {selectedCourse
            ? "Kövesd a lépéseket a tananyag elsajátításához."
            : "Válassz a rendelkezésre álló tananyagok közül."}
        </p>
      </div>

      {selectedCourse ? (
        <GuidePlayer
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
        />
      ) : (
        <GuideSelector
          courses={AVAILABLE_COURSES}
          onSelect={setSelectedCourse}
        />
      )}
    </div>
  );
}
