import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/landing/HomePage";
import PositionsPage from "./pages/landing/PositionsPage";
import PublicCompanyProfilePage from "./pages/landing/PublicCompanyProfilePage";
import StudentRegisterPage from "./pages/auth/StudentRegisterPage";
import PlaceholderPage from "./components/layout/PlaceholderPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";

import StudentLayout from "./layouts/StudentLayout";
import TeacherLayout from "./layouts/TeacherLayout";
import MentorLayout from "./layouts/MentorLayout";
import HrLayout from "./layouts/HrLayout";
import CompanyProfilePage from "./pages/hr/CompanyProfilePage";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminPositions from "./pages/admin/AdminPositions";
import AdminTags from "./pages/admin/AdminTags";
import AdminSettings from "./pages/admin/AdminSettings";

import StudentNewsPage from "./pages/student/StudentNewsPage";
import AdminNews from "./pages/admin/AdminNews";


import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/companies/:id" element={<PublicCompanyProfilePage />} />
          <Route path="/register" element={<StudentRegisterPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="positions" element={<AdminPositions />} />
            <Route path="tags" element={<AdminTags />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="news" element={<AdminNews />} />
          </Route>

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboardPage />} />
            <Route path="jobs" element={<PlaceholderPage title="Állások" />} />
            <Route path="profile" element={<PlaceholderPage title="Saját adataim" />} />
            <Route path="applications" element={<PlaceholderPage title="Megpályázott állások" />} />
            <Route path="faq" element={<PlaceholderPage title="Q&A / Útmutató" />} />
            <Route path="progress" element={<PlaceholderPage title="Haladási napló" />} />
            <Route path="chat" element={<PlaceholderPage title="Chat" />} />
            <Route path="survey" element={<PlaceholderPage title="Elégedettségi kérdőív" />} />
            <Route path="news" element={<StudentNewsPage />} />
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

          {/* HR routes section */}
          <Route path="/hr" element={<HrLayout />}>
            <Route index element={<PlaceholderPage title="HR kezdőlap" />} />
            <Route path="job-postings" element={<PlaceholderPage title="Álláshirdetések" />} />
            <Route path="messages" element={<PlaceholderPage title="Üzenetek" />} />
            <Route path="applications" element={<PlaceholderPage title="Jelentkezések" />} />
            <Route path="mentors" element={<PlaceholderPage title="Mentorok kezelése" />} />
            <Route path="company-profile" element={<CompanyProfilePage />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
