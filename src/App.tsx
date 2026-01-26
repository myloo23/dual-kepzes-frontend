import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/landing/HomePage";
import PositionsPage from "./pages/landing/PositionsPage";
import PublicCompanyProfilePage from "./pages/landing/PublicCompanyProfilePage";
import StudentRegisterPage from "./pages/auth/StudentRegisterPage";
import PlaceholderPage from "./components/layout/PlaceholderPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";

import TeacherLayout from "./layouts/TeacherLayout";
import MentorLayout from "./layouts/MentorLayout";
import HrLayout from "./layouts/HrLayout";
import HrDashboardPage from "./pages/hr/HrDashboardPage";
import UniversityLayout from "./layouts/UniversityLayout";
import UniversityDashboardPage from "./pages/university/UniversityDashboardPage";
import StudentNewsPage from "./pages/student/StudentNewsPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminPositions from "./pages/admin/AdminPositions";
import AdminTags from "./pages/admin/AdminTags";
import AdminSettings from "./pages/admin/AdminSettings";

import AdminNews from "./pages/admin/AdminNews";


import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import { AuthProvider } from "./features/auth";

function App() {
  return (
    <AuthProvider>
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
            <Route path="/student" element={<StudentDashboardPage />} />
            <Route path="/student/news" element={<StudentDashboardPage />} />

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
              <Route index element={<HrDashboardPage />} />
              <Route path="job-postings" element={<HrDashboardPage />} />
              <Route path="applications" element={<HrDashboardPage />} />
              <Route path="partnerships" element={<HrDashboardPage />} />
              <Route path="employees" element={<HrDashboardPage />} />
              <Route path="company-profile" element={<HrDashboardPage />} />
              <Route path="profile" element={<HrDashboardPage />} />
            </Route>

            <Route path="/university" element={<UniversityLayout />}>
              <Route index element={<UniversityDashboardPage />} />
              <Route path="students" element={<UniversityDashboardPage />} />
              <Route path="news" element={<StudentNewsPage />} />
              <Route path="profile" element={<UniversityDashboardPage />} />
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;


