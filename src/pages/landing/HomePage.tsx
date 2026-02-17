import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../features/auth";
import LoginCard from "../../features/auth/components/LoginCard";
import JobSlider from "../../features/positions/components/JobSlider";
import MaterialsGallery from "../../features/landing/components/MaterialsGallery";
import ReferencesSlider from "../../features/landing/components/ReferencesSlider";
import DualInfoSection from "../../features/landing/components/DualInfoSection";
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
      const target = ROLE_NAVIGATION_PATHS[normalizedRole]?.dashboard;
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
    <div className="bg-white">
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
                className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 group-hover/logos:scale-105"
              />
              <div className="w-px h-12 bg-slate-300"></div>
              <img
                src={njeLogoImage}
                alt="Neumann János Egyetem"
                className="h-20 sm:h-24 w-auto object-contain transition-transform duration-300 group-hover/logos:scale-105"
              />
            </Link>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-slate-900 leading-[1.05] text-balance">
                Duális képzési <br />
                <span className="text-dkk-blue">online rendszer</span>
              </h1>
              <p className="text-xl leading-relaxed text-slate-500 max-w-lg font-normal">
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
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100/80"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-sm font-medium text-slate-700 leading-snug">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Login/User Card */}
          <div className="relative animate-slide-in-from-right lg:pl-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-purple-50 rounded-[3rem] blur-3xl opacity-60 -z-10 transform translate-y-10"></div>

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
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-10 text-center border border-white/50 relative overflow-hidden ring-1 ring-slate-900/5">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center text-4xl font-bold text-slate-700 mx-auto mb-6 shadow-inner ring-4 ring-white">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {userInfo.name}
                </h3>
                <p className="text-slate-500 mb-8">Bejelentkezve</p>

                <button
                  onClick={() => navigate(userInfo.dashboardPath)}
                  className="w-full bg-slate-900 text-white font-medium py-4 px-6 rounded-xl hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95"
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
                  className="mt-4 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors duration-200"
                >
                  Kijelentkezés
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* JOBS SECTION */}
        <section id="jobs" className="py-24 border-t border-slate-100">
          <div className="text-center mb-16 space-y-4">
            <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">
              Lehetőségek
            </span>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
              Aktuális Állásajánlatok
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Partnercégeink által meghirdetett teljes munkaidős
              álláslehetőségek. Fedezd fel a legújabb nyitott pozíciókat.
            </p>
          </div>

          <JobSlider onViewDetails={handleViewJobDetails} />

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/positions")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-900 text-sm font-medium hover:bg-slate-200 transition-colors"
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
          </div>
        </section>

        {/* INFO SECTION */}
        <section className="py-12 border-t border-slate-100">
          <DualInfoSection />
        </section>

        {/* REFERENCES */}
        <section className="py-12">
          <ReferencesSlider />
        </section>

        {/* GALLERY */}
        <div className="py-12">
          <MaterialsGallery />
        </div>

        {/* CONTACT */}
        <section
          id="contact"
          className="py-24 border-t border-slate-100 text-center"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Kérdése van?
            </h2>
            <p className="text-lg text-slate-500">
              A rendszer egyetemi pilot projekt részeként készül. Kérdés esetén
              forduljon az egyetem duális képzési koordinátorához.
            </p>
            <a
              href="mailto:dualis@nje.hu"
              className="inline-block text-blue-600 font-medium hover:underline"
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
