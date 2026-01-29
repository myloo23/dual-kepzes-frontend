import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import BackToTop from "./components/shared/BackToTop";
import ToastContainer from "./components/shared/ToastContainer";
import GlobalSearch from "./components/shared/GlobalSearch";
import PageLoader from "./components/shared/PageLoader";
import { useToast } from "./hooks/useToast";
import { useGlobalSearch } from "./hooks/useGlobalSearch";
import { AuthProvider } from "./features/auth";

// Lazy load page components for better performance
const HomePage = lazy(() => import("./pages/landing/HomePage"));
const PositionsPage = lazy(() => import("./pages/landing/PositionsPage"));
const PublicCompanyProfilePage = lazy(() => import("./pages/landing/PublicCompanyProfilePage"));
const StudentRegisterPage = lazy(() => import("./pages/auth/StudentRegisterPage"));
const PlaceholderPage = lazy(() => import("./components/layout/PlaceholderPage"));
const StudentDashboardPage = lazy(() => import("./pages/student/StudentDashboardPage"));
const StudentNewsPage = lazy(() => import("./pages/student/StudentNewsPage"));

// Lazy load layouts
const TeacherLayout = lazy(() => import("./layouts/TeacherLayout"));
const MentorLayout = lazy(() => import("./layouts/MentorLayout"));
const HrLayout = lazy(() => import("./layouts/HrLayout"));
const UniversityLayout = lazy(() => import("./layouts/UniversityLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));

// Lazy load admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCompanies = lazy(() => import("./pages/admin/AdminCompanies"));
const AdminPositions = lazy(() => import("./pages/admin/AdminPositions"));
const AdminTags = lazy(() => import("./pages/admin/AdminTags"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminPartnerships = lazy(() => import("./pages/admin/AdminPartnerships"));
const AdminNews = lazy(() => import("./pages/admin/AdminNews"));

// Lazy load other pages
const MentorPartnerships = lazy(() => import("./pages/mentor/MentorPartnerships"));
const HrDashboardPage = lazy(() => import("./pages/hr/HrDashboardPage"));
const HrGuidePage = lazy(() => import("./pages/hr/HrGuidePage"));
const UniversityDashboardPage = lazy(() => import("./pages/university/UniversityDashboardPage"));
const UniversityGuidePage = lazy(() => import("./pages/university/UniversityGuidePage"));
const AdminGuidePage = lazy(() => import("./pages/admin/AdminGuidePage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));

function App() {
  const { toasts, removeToast } = useToast();
  const { isOpen: isSearchOpen, close: closeSearch } = useGlobalSearch();

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />

        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/positions" element={<PositionsPage />} />
            <Route path="/companies/:id" element={<PublicCompanyProfilePage />} />
            <Route path="/register" element={<StudentRegisterPage />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="partnerships" element={<AdminPartnerships />} />
              <Route path="companies" element={<AdminCompanies />} />
              <Route path="positions" element={<AdminPositions />} />
              <Route path="tags" element={<AdminTags />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="guide" element={<AdminGuidePage />} />
            </Route>

            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/student" element={<StudentDashboardPage />} />
            <Route path="/student/news" element={<StudentDashboardPage />} />
            <Route path="/student/partnerships" element={<StudentDashboardPage />} />
            <Route path="/student/guide" element={<StudentDashboardPage />} />

            <Route path="/teacher" element={<TeacherLayout />}>
              <Route index element={<PlaceholderPage title="Oktatói kezdőlap" />} />
              <Route path="students" element={<PlaceholderPage title="Hallgatók" />} />
              <Route path="companies" element={<PlaceholderPage title="Cégek" />} />
              <Route path="stats" element={<PlaceholderPage title="Statisztika" />} />
            </Route>

            <Route path="/mentor" element={<MentorLayout />}>
              <Route index element={<PlaceholderPage title="Mentori kezdőlap" />} />
              <Route path="partnerships" element={<MentorPartnerships />} />
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
              <Route path="news" element={<StudentNewsPage />} />
              <Route path="profile" element={<HrDashboardPage />} />
              <Route path="guide" element={<HrGuidePage />} />
            </Route>

            <Route path="/university" element={<UniversityLayout />}>
              <Route index element={<UniversityDashboardPage />} />
              <Route path="students" element={<UniversityDashboardPage />} />
              <Route path="partnerships" element={<UniversityDashboardPage />} />
              <Route path="news" element={<StudentNewsPage />} />
              <Route path="profile" element={<UniversityDashboardPage />} />
              <Route path="guide" element={<UniversityGuidePage />} />
            </Route>
          </Routes>
          </Suspense>
        </main>

        <Footer />
        
        {/* Global UX Components */}
        <GlobalSearch isOpen={isSearchOpen} onClose={closeSearch} />
        <BackToTop />
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </AuthProvider>
  );
}

export default App;


