import { useState } from "react";
import { GuideEmbed } from "./GuideEmbed";

export function GuidePlayer() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(
    {},
  );

  const markComplete = (stepIndex: number) => {
    setCompletedSteps((prev) => ({ ...prev, [stepIndex]: true }));
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveStep((prev) => prev + 1);
  };

  const steps = [
    {
      id: "presentation",
      title: "Tananyag és Teszt",
      component: <GuideEmbed />,
      actionText: "A tananyagot és a tesztet sikeresen teljesítettem",
    },
  ];

  const currentStep = steps[activeStep];
  const isFinished = activeStep >= steps.length;

  if (isFinished) {
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
          Gratulálunk!
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium transition-colors">
          Sikeresen teljesítetted az első modult.
        </p>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 max-w-md transition-colors">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A következő tananyag hamarosan elérhető lesz. Értesítést fogunk
            küldeni, amint folytathatod a tanulást.
          </p>
        </div>
        <button
          onClick={() => setActiveStep(0)}
          className="mt-8 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
        >
          Anyagok újranézése
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
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
