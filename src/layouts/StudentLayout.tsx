import { useEffect, useState } from "react";
import DashboardLayout, { type NavItem } from "./DashboardLayout";

export default function StudentLayout() {
  // Demo: mivel backend még nincs kész, ezzel tudod kapcsolgatni a menüt
  const [hasJob, setHasJob] = useState(() => localStorage.getItem("student_has_job") === "1");

  useEffect(() => {
    localStorage.setItem("student_has_job", hasJob ? "1" : "0");
  }, [hasJob]);

  const base: NavItem[] = [
    { to: "/student/jobs", label: "Állások", hint: "Elérhető állások böngészése" },
    { to: "/student/profile", label: "Saját adataim", hint: "Profil és adatok" },
    { to: "/student/applications", label: "Megpályázott állások", hint: "Státusz: megkapta / elutasítva / folyamatban" },
    { to: "/student/faq", label: "Q&A / Útmutató", hint: "Általános használati útmutató" },
    { to: "/student/guide", label: "Tananyag", hint: "Útmutató az oldal használatához" },
  ];

  const extraIfHasJob: NavItem[] = [
    { to: "/student/progress", label: "Haladási napló", hint: "Munkahelyi tevékenységek naplózása" },
    { to: "/student/chat", label: "Chat", hint: "Kommunikáció mentorral/oktatóval" },
    { to: "/student/survey", label: "Elégedettségi kérdőív", hint: "Visszajelzés a képzésről" },
  ];

  const navItems = hasJob ? [...base, ...extraIfHasJob] : base;

  return (
    <DashboardLayout
      roleLabel="Hallgató"
      title="Hallgatói felület"
      homeLink="/student"
      navItems={navItems}
      sidebarTop={
        <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
          <span>Van már munkahelyem (demo)</span>
          <input
            type="checkbox"
            checked={hasJob}
            onChange={(e) => setHasJob(e.target.checked)}
            className="h-4 w-4"
          />
        </label>
      }
    />
  );
}
