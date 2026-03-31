import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../features/auth";
import LoginCard from "../../features/auth/components/LoginCard";
import JobSlider from "../../features/positions/components/JobSlider";
import MaterialsGallery from "../../features/landing/components/MaterialsGallery";
import ReferencesSlider from "../../features/landing/components/ReferencesSlider";
import DualInfoSection from "../../features/landing/components/DualInfoSection";
import HowToUseVideo from "../../features/landing/components/HowToUseVideo";
import RegistrationPromo from "../../features/landing/components/RegistrationPromo";
import HomeMapSection from "../../features/landing/components/HomeMapSection";
import logoImage from "../../assets/logos/dkk_logos/logó.png";
import njeLogoImage from "../../assets/logos/nje_logos/nje_logo2.png";
import { ROLE_NAVIGATION_PATHS, type UserRole } from "../../config/navigation";

function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, login, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);

    try {
      const res = await api.login(email.trim(), password);

      console.log("API Válasz:", res);
      console.log("Kapott role:", res.user.role);

      login(res.token, res.user as any); // TODO: Ensure API response matches User type fully

      const normalizedRole = res.user.role as UserRole;
      const roleConfig = ROLE_NAVIGATION_PATHS[normalizedRole] as {
        dashboard: string;
        loginRedirect?: string;
        news?: string;
      };
      const target = roleConfig?.loginRedirect ?? roleConfig?.dashboard;
      console.log("Számított útvonal:", target);

      if (target) {
        navigate(target, { replace: true });
      } else {
        console.warn(
          `Ismeretlen szerepkör: ${normalizedRole}, visszatérés a főoldalra.`,
        );
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
    // Navigate to positions page with query param to open modal
    navigate(`/positions?id=${positionId}`);
  };

  // Felhasználó adatainak lekérése
  const userInfo = user
    ? {
        name: user.email || "Felhasználó", // Note: API types might need full name check
        role: user.role,
        dashboardPath:
          ROLE_NAVIGATION_PATHS[user.role as UserRole]?.dashboard || "/",
      }
    : null;

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-8">
        {/* HERO SECTION */}
        <section
          id="home"
          className="pt-10 pb-16 lg:pt-20 lg:pb-24 grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center"
        >
          {/* Left Content */}
          <div className="space-y-10 animate-fade-in">
            <Link
              to="/"
              className="flex items-center gap-8 group/logos cursor-pointer w-fit"
            >
              <img
                src={logoImage}
                alt="Duális Képzési Központ"
                className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 group-hover/logos:scale-105 dark:brightness-0 dark:invert"
              />
              <div className="w-px h-12 bg-slate-300 dark:bg-slate-700"></div>
              <img
                src={njeLogoImage}
                alt="Neumann János Egyetem"
                className="h-20 sm:h-24 w-auto object-contain transition-transform duration-300 group-hover/logos:scale-105 dark:brightness-0 dark:invert"
              />
            </Link>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-slate-900 dark:text-slate-50 leading-[1.05] text-balance transition-colors">
                Duális képzési <br />
                <span className="text-dkk-blue">online rendszer</span>
              </h1>
              <p className="text-xl leading-relaxed text-slate-500 dark:text-slate-400 max-w-lg font-normal transition-colors">
                Egy egységes platform a hallgatók, céges partnerek és az
                egységes adminisztráció számára.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: "🎓",
                  text: "Hallgatói jelentkezés és dokumentumfeltöltés",
                },
                { icon: "🏢", text: "Céges pozíciók és jelentkezéskezelés" },
                { icon: "📘", text: "Haladási napló és mentor jóváhagyás" },
                { icon: "📝", text: "Félév végi értékelések és admin felület" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800/80 group"
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">
                    {feature.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug transition-colors">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Login/User Card */}
          <div className="relative animate-slide-in-from-right lg:pl-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-[3rem] blur-3xl opacity-60 dark:opacity-40 -z-10 transform translate-y-10 transition-all"></div>

            {!isAuthenticated ? (
              <div className="relative transform transition-all hover:scale-[1.01] duration-500">
                <LoginCard
                  email={email}
                  password={password}
                  loginError={loginError}
                  loading={loading}
                  onEmailChange={setEmail}
                  onPasswordChange={setPassword}
                  onSubmit={handleLoginSubmit}
                />
              </div>
            ) : userInfo ? (
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl dark:shadow-none p-10 text-center border border-white/50 dark:border-slate-800 relative overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10 transition-colors">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center text-4xl font-bold text-slate-700 dark:text-slate-200 mx-auto mb-6 shadow-inner ring-4 ring-white dark:ring-slate-900 transition-colors">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
                  {userInfo.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 transition-colors">
                  Bejelentkezve
                </p>

                <button
                  onClick={() => navigate(userInfo.dashboardPath)}
                  className="w-full bg-slate-900 dark:bg-dkk-blue text-white font-medium py-4 px-6 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 dark:shadow-blue-900/20 active:scale-95"
                >
                  <span>Irányítópult megnyitása</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>

                <button
                  onClick={logout}
                  className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  Kijelentkezés
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* JOBS SECTION */}
        <section
          id="jobs"
          className="py-24 border-t border-slate-100 dark:border-slate-800/50 transition-colors"
        >
          <div className="text-center mb-16 space-y-4">
            <span className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase transition-colors">
              Lehetőségek
            </span>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 transition-colors">
              Aktuális Állásajánlatok
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed transition-colors">
              Partnercégeink által meghirdetett teljes munkaidős
              álláslehetőségek. Fedezd fel a legújabb nyitott pozíciókat.
            </p>
          </div>

          <JobSlider onViewDetails={handleViewJobDetails} />

          <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/positions")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Összes állás megtekintése
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m-4-4H3"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                navigate("/positions");
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100);
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800/50"
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Térképes nézet
            </button>
          </div>

          <div className="mt-16">
            <HomeMapSection />
          </div>
        </section>

        {/* TUTORIAL VIDEO SECTION */}
        <section className="py-24 border-t border-slate-100 dark:border-slate-800/50 transition-colors">
          <HowToUseVideo />
        </section>

        {/* REGISTRATION PROMO */}
        <RegistrationPromo />

        {/* INFO SECTION */}
        <section className="py-12 border-t border-slate-100 dark:border-slate-800/50 transition-colors">
          <DualInfoSection />
        </section>

        {/* REFERENCES */}
        <section className="py-12 border-t border-slate-100 dark:border-slate-800/50 transition-colors lg:border-none">
          <ReferencesSlider />
        </section>

        {/* GALLERY */}
        <div className="py-12">
          <MaterialsGallery />
        </div>

        {/* CONTACT */}
        <section
          id="contact"
          className="py-24 border-t border-slate-100 dark:border-slate-800/50 text-center transition-colors"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 transition-colors">
              Kérdése van?
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 transition-colors">
              A rendszer egyetemi pilot projekt részeként készül. Kérdés esetén
              forduljon az egyetem duális képzési koordinátorához.
            </p>
            <a
              href="mailto:dualis@nje.hu"
              className="inline-block text-blue-600 dark:text-blue-400 font-medium hover:underline transition-colors"
            >
              Kapcsolatfelvétel
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
