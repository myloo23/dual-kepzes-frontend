import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/landing/HomePage.tsx";
import PositionsPage from "./pages/landing/PositionsPage.tsx";
import MapPage from "./pages/landing/MapPage.tsx";
import StudentRegisterPage from "./pages/auth/StudentRegisterPage.tsx";
import PlaceholderPage from "./pages/PlaceholderPage";

// layouts
import StudentLayout from "./layouts/StudentLayout.tsx";
import TeacherLayout from "./layouts/TeacherLayout.tsx";
import MentorLayout from "./layouts/MentorLayout.tsx";
import HrLayout from "./layouts/HrLayout.tsx";

// admin
import AdminLayout from "./layouts/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminCompanies from "./pages/admin/AdminCompanies.tsx";
import AdminPositions from "./pages/admin/AdminPositions.tsx";
import AdminTags from "./pages/admin/AdminTags.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";

// password reset
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.tsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/register" element={<StudentRegisterPage />} />

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

      <Footer />
    </div>
  );
}

export default App;
