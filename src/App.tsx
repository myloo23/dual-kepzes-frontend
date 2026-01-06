import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PositionsPage from "./pages/PositionsPage";
import MapPage from "./pages/MapPage";
import StudentRegisterPage from "./pages/StudentRegisterPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import PlaceholderPage from "./pages/PlaceholderPage";
//layouts
import StudentLayout from "./pages/student/StudentLayout";
import TeacherLayout from "./pages/teacher/TeacherLayout";
import MentorLayout from "./pages/mentor/MentorLayout";
import HrLayout from "./pages/hr/HrLayout";
//admin imports
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminCompanies from "./pages/Admin/AdminCompanies";
import AdminPositions from "./pages/Admin/AdminPositions.tsx";
import AdminTags from "./pages/Admin/AdminTags";
import AdminSettings from "./pages/Admin/AdminSettings";
//password reset
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
          <Link
            to="/"
            className="font-semibold tracking-tight text-slate-900"
            onClick={closeMobileMenu}
          >
            Duális képzési rendszer
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex gap-6 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-900">
              Kezdőlap
            </Link>
            <Link to="/positions" className="hover:text-slate-900">
              Elérhető állások
            </Link>
            <Link to="/map" className="hover:text-slate-900">
              Térképes nézet
            </Link>
            <Link to="/admin" className="hover:text-slate-900">Admin</Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center rounded-md border border-slate-300 px-2 py-1 text-slate-700 bg-white shadow-sm"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Menü megnyitása"
          >
            <div className="space-y-1">
              <span
                className={`block h-0.5 w-5 rounded bg-slate-700 transition-transform ${
                  mobileOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded bg-slate-700 transition-opacity ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded bg-slate-700 transition-transform ${
                  mobileOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <nav className="sm:hidden border-t border-slate-200 bg-white">
            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-3 flex flex-col gap-2 text-sm text-slate-700">
              <Link
                to="/"
                className="py-1"
                onClick={closeMobileMenu}
              >
                Kezdőlap
              </Link>
              <Link
                to="/positions"
                className="py-1"
                onClick={closeMobileMenu}
              >
                Elérhető állások
              </Link>
              <Link
                to="/map"
                className="py-1"
                onClick={closeMobileMenu}
              >
                Térképes nézet
              </Link>
              <Link
                to="/admin"
                className="py-1"
                onClick={closeMobileMenu}
              >
                Admin
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* ROUTES */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/register" element={<StudentRegisterPage />} />
          <Route path="/student" element={<StudentDashboardPage />} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="positions" element={<AdminPositions />} />
          <Route path="tags" element={<AdminTags />} />
          <Route path="settings" element={<AdminSettings />} />
          </Route>
          {/* Password reset routes */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* Layout routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<PlaceholderPage title="Hallgatói kezdőlap" />} />
            <Route path="jobs" element={<PlaceholderPage title="Állások" />} />
            <Route path="profile" element={<PlaceholderPage title="Saját adataim" />} />
            <Route path="applications" element={<PlaceholderPage title="Megpályázott állások" />} />
            <Route path="faq" element={<PlaceholderPage title="Q&A / Útmutató" />} />
            <Route path="progress" element={<PlaceholderPage title="Haladási napló" />} />
            <Route path="chat" element={<PlaceholderPage title="Chat" />} />
            <Route path="survey" element={<PlaceholderPage title="Elégedettségi kérdőív" />} />
          </Route>

          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<PlaceholderPage title="Oktatói kezdőlap" />} />
            <Route path="students" element={<PlaceholderPage title="Hallgatók" />} />
            <Route path="companies" element={<PlaceholderPage title="Cégek" />} />
            <Route path="stats" element={<PlaceholderPage title="Statisztika" />} />
          </Route>

          <Route path="/mentor" element={<MentorLayout />}>
            <Route index element={<PlaceholderPage title="Mentori kezdőlap" />} />
            <Route path="messages" element={<PlaceholderPage title="Üzenetek" />} />
            <Route path="progress" element={<PlaceholderPage title="Haladási napló" />} />
            <Route path="reviews" element={<PlaceholderPage title="Hallgatók értékelése" />} />
            <Route path="profile" element={<PlaceholderPage title="Profil" />} />
          </Route>

          <Route path="/hr" element={<HrLayout />}>
            <Route index element={<PlaceholderPage title="HR kezdőlap" />} />
            <Route path="job-postings" element={<PlaceholderPage title="Álláshirdetések" />} />
            <Route path="messages" element={<PlaceholderPage title="Üzenetek" />} />
            <Route path="applications" element={<PlaceholderPage title="Jelentkezések" />} />
            <Route path="mentors" element={<PlaceholderPage title="Mentorok kezelése" />} />
            <Route path="profile" element={<PlaceholderPage title="Profil" />} />
          </Route>

        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-3">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-xs text-slate-500 text-right">
          © {new Date().getFullYear()} Duális képzési rendszer
        </div>
      </footer>
    </div>
  );
}

export default App;
