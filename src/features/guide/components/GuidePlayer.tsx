import { useState, useEffect } from "react";
import { GuideEmbed } from "./GuideEmbed";
import type { GuideCourse } from "../types";
import { materialsApi } from "../services/materialsApi";

interface GuidePlayerProps {
  course: GuideCourse;
  onBack: () => void;
}

export function GuidePlayer({ course, onBack }: GuidePlayerProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(
    {},
  );
  
  // Evaluation state
  const [loading, setLoading] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    materialsApi
      .getProgress()
      .then((progress) => {
        if (!mounted) return;
        const isCompleted = progress.some((p) => p.materialId === course.id);
        setAlreadyCompleted(isCompleted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load progress:", err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [course.id]);

  const markComplete = (stepIndex: number) => {
    setCompletedSteps((prev) => ({ ...prev, [stepIndex]: true }));
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Kérjük, adj meg egy csillagos értékelést!");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await materialsApi.complete({
        materialId: course.id,
        rating,
        feedback,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Hiba történt az értékelés mentése során.");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    {
      id: "presentation",
      title: "Oktatási segédlet és Teszt",
      component: <GuideEmbed course={course} />,
      actionText: "Az oktatási segédletet és a tesztet sikeresen teljesítettem",
    },
  ];

  const currentStep = steps[activeStep];
  const isFinished = activeStep >= steps.length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none animate-in fade-in duration-500 transition-colors">
        <p className="text-sm font-medium text-slate-500">Betöltés...</p>
      </div>
    );
  }

  if (isFinished) {
    if (alreadyCompleted || submitted) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none animate-in fade-in duration-500 transition-colors">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-6 transition-colors">
            <svg
              className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
            {submitted ? "Köszönjük az értékelést!" : "Gratulálunk!"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium transition-colors">
            Sikeresen teljesítetted a modult: {course.title}.
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 max-w-md transition-colors">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A következő tananyag hamarosan elérhető lesz. Értesítést fogunk
              küldeni, amint folytathatod a tanulást.
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => {
                setActiveStep(0);
                setRating(0);
                setFeedback("");
                setSubmitted(false);
              }}
              className="text-sm px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors"
            >
              Újrakezdés
            </button>
            <button
              onClick={onBack}
              className="text-sm px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
            >
              Vissza a választóhoz
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none animate-in fade-in duration-500 transition-colors">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
          Gratulálunk a modul elvégzéséhez!
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium transition-colors text-center max-w-xl">
          Kérjük, értékeld a(z) "{course.title}" oktatási segédletet, hogy a jövőben még jobb tartalmakat készíthessünk.
        </p>

        <div className="w-full max-w-md space-y-6">
          {/* Rating stars */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 transition-colors ${rating >= star ? "text-amber-400" : "text-slate-300 dark:text-slate-600 hover:text-amber-200"}`}
              >
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Opcionális megjegyzés, észrevétel az oktatási segédlettel kapcsolatban..."
            rows={4}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y"
          />

          {error && (
            <div className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={onBack}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Később
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Küldés..." : "Értékelés küldése"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Vissza a választóhoz
      </button>

      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100 dark:bg-slate-800 transition-colors">
          <div
            style={{ width: `${(activeStep / steps.length) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500 ease-out"
          />
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">
          <span>
            {activeStep + 1}. Lépés: {currentStep.title}
          </span>
          <span>{steps.length} Lépés összesen</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {currentStep.component}

        {/* Action / Navigation */}
        <div className="mt-8 flex flex-col items-center gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={!!completedSteps[activeStep]}
                onChange={() => markComplete(activeStep)}
                className="peer sr-only"
              />
              <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded transition-colors peer-checked:bg-emerald-500 peer-checked:border-emerald-500 peer-focus:ring-2 peer-focus:ring-emerald-500/20"></div>
              <svg
                className="absolute top-1 left-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span
              className={`text-sm font-medium transition-colors ${completedSteps[activeStep] ? "text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"}`}
            >
              {currentStep.actionText}
            </span>
          </label>

          <button
            onClick={nextStep}
            disabled={!completedSteps[activeStep]}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200
              ${
                completedSteps[activeStep]
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm transform hover:-translate-y-0.5"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
              }
            `}
          >
            Következő
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
