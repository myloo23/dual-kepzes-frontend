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

// Helper function to retry lazy imports with page reload on failure
// This fixes "Failed to fetch dynamically imported module" errors after deployments
const lazyRetry = (componentImport: () => Promise<any>) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assuming that the user is not on the latest version of the application.
        // Let's refresh the page immediately.
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }

      // The page has already been reloaded
      // Assuming that user is already using the latest version of the application.
      // Let's let the application crash and raise the error.
      throw error;
    }
  });


// Lazy load page components for better performance
const HomePage = lazyRetry(() => import("./pages/landing/HomePage"));
const PositionsPage = lazyRetry(() => import("./pages/landing/PositionsPage"));
const PublicCompanyProfilePage = lazyRetry(() => import("./pages/landing/PublicCompanyProfilePage"));
const StudentRegisterPage = lazyRetry(() => import("./pages/auth/StudentRegisterPage"));
const PlaceholderPage = lazyRetry(() => import("./components/layout/PlaceholderPage"));
const StudentDashboardPage = lazyRetry(() => import("./pages/student/StudentDashboardPage"));
const StudentNewsPage = lazyRetry(() => import("./pages/student/StudentNewsPage"));

// Lazy load layouts
const TeacherLayout = lazyRetry(() => import("./layouts/TeacherLayout"));
const MentorLayout = lazyRetry(() => import("./layouts/MentorLayout"));
const HrLayout = lazyRetry(() => import("./layouts/HrLayout"));
const UniversityLayout = lazyRetry(() => import("./layouts/UniversityLayout"));
const AdminLayout = lazyRetry(() => import("./layouts/AdminLayout"));

// Lazy load admin pages
const AdminDashboard = lazyRetry(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazyRetry(() => import("./pages/admin/AdminUsers"));
const AdminCompanies = lazyRetry(() => import("./pages/admin/AdminCompanies"));
const AdminPositions = lazyRetry(() => import("./pages/admin/AdminPositions"));
const AdminTags = lazyRetry(() => import("./pages/admin/AdminTags"));
const AdminSettings = lazyRetry(() => import("./pages/admin/AdminSettings"));
const AdminPartnerships = lazyRetry(() => import("./pages/admin/AdminPartnerships"));
const AdminNews = lazyRetry(() => import("./pages/admin/AdminNews"));

// Lazy load other pages
const MentorPartnerships = lazyRetry(() => import("./pages/mentor/MentorPartnerships"));
const HrDashboardPage = lazyRetry(() => import("./pages/hr/HrDashboardPage"));
const HrGuidePage = lazyRetry(() => import("./pages/hr/HrGuidePage"));
const UniversityDashboardPage = lazyRetry(() => import("./pages/university/UniversityDashboardPage"));
const UniversityGuidePage = lazyRetry(() => import("./pages/university/UniversityGuidePage"));
const AdminGuidePage = lazyRetry(() => import("./pages/admin/AdminGuidePage"));
const ForgotPasswordPage = lazyRetry(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazyRetry(() => import("./pages/auth/ResetPasswordPage"));

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


