import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../features/auth";
import LoginCard from "../../features/auth/components/LoginCard";
import JobSlider from "../../features/positions/components/JobSlider";
import MaterialsGallery from "../../features/landing/components/MaterialsGallery";
import ReferencesSlider from "../../features/landing/components/ReferencesSlider";
import DualInfoSection from "../../features/landing/components/DualInfoSection";
import logoImage from "../../assets/logos/dkk_logos/logó.png";
import njeLogoImage from "../../assets/logos/nje_logos/nje_logo2.png";

// Definiáljuk az útvonalakat a szerepkörökhöz
const roleToPath: Record<string, string> = {
  STUDENT: "/student",
  TEACHER: "/teacher",
  MENTOR: "/mentor",
  HR: "/hr",
  COMPANY_ADMIN: "/hr",
  ADMIN: "/admin",
  SYSTEM_ADMIN: "/admin",
  SUPER_ADMIN: "/admin",
};

function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);

    try {
      const res = await api.login(email.trim(), password);

      console.log("API Válasz:", res);
      console.log("Kapott role:", res.user.role);

      console.log("Kapott role:", res.user.role);

      login(res.token, res.user as any); // TODO: Ensure API response matches User type fully

      const normalizedRole = res.user.role;
      const target = roleToPath[normalizedRole];
      console.log("Számított útvonal:", target);

      if (target) {
        navigate(target, { replace: true });
      } else {
        console.warn(`Ismeretlen szerepkör: ${normalizedRole}, visszatérés a főoldalra.`);
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      console.error("Login hiba:", err);
      setLoginError(err?.message || "Sikertelen bejelentkezés.");
    } finally {
      setLoading(false);
    }
  };



  const handleViewJobDetails = (positionId: string | number) => {
    // Navigate to positions page and scroll to the specific position
    sessionStorage.setItem("highlightPositionId", String(positionId));
    navigate("/positions");
  };

  // Felhasználó adatainak lekérése
  const userInfo = user ? {
    name: user.email || "Felhasználó", // Note: API types might need full name check
    role: user.role,
    dashboardPath: roleToPath[user.role] || "/"
  } : null;

  // Szerepkör szép megjelenítése
  // (Eltávolítva)

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8">
      {/* HERO + LOGIN/WELCOME */}
      <section
        id="home"
        className="py-10 lg:py-16 grid gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center"
      >
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <img
              src={logoImage}
              alt="Duális Képzési Központ"
              className="h-14 sm:h-16 lg:h-20 object-contain"
            />
            <img
              src={njeLogoImage}
              alt="Neumann János Egyetem"
              className="h-20 sm:h-24 lg:h-28 object-contain"
            />
          </div>
          <p className="text-sm font-semibold text-dkk-blue mb-2">
            Duális képzések online felülete
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4 text-balance">
            Duális képzési online rendszer
          </h1>
          <p className="text-base sm:text-sm lg:text-base text-slate-600 mb-6 max-w-xl">
            Egy egységes platform a hallgatók, céges partnerek és az
            egyetem számára a duális képzés jelentkezési, szerződéses
            és naplózási folyamatainak kezelésére.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
            <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white/80 p-3 shadow-sm">
              <span className="text-lg">🎓</span>
              <span>Hallgatói jelentkezés és dokumentumfeltöltés</span>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white/80 p-3 shadow-sm">
              <span className="text-lg">🏢</span>
              <span>Céges pozíciók és jelentkezéskezelés</span>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white/80 p-3 shadow-sm">
              <span className="text-lg">📘</span>
              <span>Haladási napló és mentor jóváhagyás</span>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white/80 p-3 shadow-sm">
              <span className="text-lg">📝</span>
              <span>Félév végi értékelések és admin felület</span>
            </div>
          </div>
        </div>

        {!isAuthenticated ? (
          <LoginCard
            email={email}
            password={password}
            loginError={loginError}
            loading={loading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLoginSubmit}
          />
        ) : userInfo ? (
          <div className="bg-slate-50 rounded-2xl shadow-xl p-8 text-slate-900 border border-slate-200 transition-all duration-300 hover:shadow-2xl max-w-md w-full mx-auto lg:mx-0">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-dkk-blue border-2 border-slate-200 mx-auto mb-4 shadow-sm">
                {userInfo.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-3xl font-bold mb-2 break-words leading-tight text-slate-900">{userInfo.name}</h3>
              <p className="text-slate-600 font-medium text-lg">Üdvözöljük a rendszerben!</p>
            </div>

            <button
              onClick={() => navigate(userInfo.dashboardPath)}
              className="w-full bg-dkk-blue text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span>Irányítópult megnyitása</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        ) : null}
      </section>

      {/* ÁLLÁSAJÁNLATOK SZEKCIÓ */}
      <section id="jobs" className="py-10 border-t border-dkk-gray/30">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
            Aktuális Állásajánlatok
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Partnercégeink által meghirdetett teljes munkaidős álláslehetőségek.
            Ezek az állások függetlenek a duális képzési programtól, és bárki
            számára elérhetőek.
          </p>
        </div>

        <JobSlider onViewDetails={handleViewJobDetails} />

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/positions")}
            className="inline-flex items-center gap-2 text-sm font-medium text-dkk-blue hover:text-dkk-blue/80 hover:underline transition"
          >
            Összes állás megtekintése →
          </button>
        </div>
      </section>

      <section className="border-t border-dkk-gray/30">
        <DualInfoSection />
      </section>

      <section>
        <ReferencesSlider />
      </section>

      <MaterialsGallery />

      {/* KAPCSOLAT */}
      <section id="contact" className="py-12 border-t border-dkk-gray/30 text-center">
        <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-3">
          Kapcsolat
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          A rendszer egyetemi pilot projekt részeként készül. Kérdés
          esetén forduljon az egyetem duális képzési koordinátorához.
        </p>
      </section>
    </div>
  );
}

export default HomePage;
