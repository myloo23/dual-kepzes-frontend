import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, MapPinned, Video } from "lucide-react";
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
import logoImage from "../../assets/logos/dkk_logos/logo.webp";
import njeLogoImageLight from "../../assets/logos/nje_logos/nje_logo2.webp";
import njeLogoImageDark from "../../assets/logos/nje_logos/nje_logo3.webp";
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

      login(res.token, res.user as any);

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
    } catch (err: unknown) {
      console.error("Login hiba:", err);
      setLoginError(err instanceof Error ? err.message : "Sikertelen bejelentkezés.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewJobDetails = (positionId: string | number) => {
    navigate(`/positions?id=${positionId}`);
  };

  const handleScrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const topOffset = 96;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - topOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  };

  const userInfo = user
    ? {
        name: user.email || "Felhasználó",
        role: user.role,
        dashboardPath:
          ROLE_NAVIGATION_PATHS[user.role as UserRole]?.dashboard || "/",
      }
    : null;

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">

      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <section
        id="home"
        className="relative overflow-hidden pt-10 pb-20 lg:pt-24 lg:pb-32"
      >
        {/* Decorative brand circles */}
        <div className="pointer-events-none absolute -right-32 top-0 w-[560px] h-[560px] rounded-full bg-gradient-to-bl from-nje-amethyst/10 to-nje-cyan/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-nje-jaffa/10 to-transparent blur-3xl" />
        {/* Floating accent circles (brand shapes) */}
        <div className="pointer-events-none absolute right-[12%] top-[15%] w-24 h-24 rounded-full border-[3px] border-nje-jaffa/20" />
        <div className="pointer-events-none absolute right-[8%] top-[55%] w-12 h-12 rounded-full bg-nje-cyan/10" />
        <div className="pointer-events-none absolute left-[5%] top-[40%] w-8 h-8 rounded-full bg-nje-amethyst/15" />

        <div className="relative max-w-[1240px] mx-auto px-6 lg:px-8 grid gap-14 lg:grid-cols-[1.15fr_1fr] items-center">
          {/* Left content */}
          <div className="space-y-10 animate-fade-in">
            {/* Logos */}
            <Link
              to="/"
              className="flex items-center gap-6 group/logos cursor-pointer w-fit"
            >
              <img
                src={njeLogoImageLight}
                alt="Neumann János Egyetem"
                width={167}
                height={120}
                className="h-20 sm:h-28 w-auto object-contain transition-transform duration-300 group-hover/logos:scale-105 dark:hidden"
              />
              <img
                src={njeLogoImageDark}
                alt="Neumann János Egyetem"
                width={270}
                height={120}
                className="hidden h-20 sm:h-28 w-auto object-contain transition-transform duration-300 group-hover/logos:scale-105 dark:block dark:brightness-0 dark:invert"
              />
              <div className="w-px h-16 bg-nje-anthracite/20 dark:bg-slate-700" />
              <img
                src={logoImage}
                alt="Duális Képzési Központ"
                width={216}
                height={100}
                className="h-14 sm:h-18 w-auto object-contain transition-transform duration-300 group-hover/logos:scale-105 dark:brightness-0 dark:invert"
              />
            </Link>

            {/* Headline */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-nje-amethyst-faint dark:bg-nje-amethyst/20 border border-nje-amethyst/20 px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-nje-jaffa animate-pulse" />
                <span className="text-xs font-bold text-nje-amethyst dark:text-nje-amethyst-light uppercase tracking-widest">
                  NJE Duális Platform
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-nje-anthracite dark:text-slate-50 leading-[1.1]">
                Duplázd az{" "}
                <span className="text-gradient-jaffa">esélyeid!</span>
              </h1>
              <p className="text-lg leading-relaxed text-nje-anthracite/60 dark:text-slate-400 max-w-lg font-normal">
                Egy egységes platform a hallgatók, céges partnerek és az
                egyetemi adminisztráció számára.
              </p>
            </div>

            {/* Feature chips */}
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: "🎓", text: "Hallgatói jelentkezés és dokumentumfeltöltés" },
                { icon: "🏢", text: "Céges pozíciók és jelentkezéskezelés" },
                { icon: "📘", text: "Haladási napló és mentor jóváhagyás" },
                { icon: "📝", text: "Félév végi értékelések és admin felület" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-nje-pearl dark:bg-slate-900 border border-nje-anthracite/8 dark:border-slate-800 hover:border-nje-jaffa/30 hover:bg-nje-jaffa-faint dark:hover:bg-slate-800/80 transition-all group"
                >
                  <span className="text-xl transition-transform group-hover:scale-110 mt-0.5">
                    {feature.icon}
                  </span>
                  <span className="text-sm font-medium text-nje-anthracite dark:text-slate-300 leading-snug">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right content – login / user card */}
          <div className="relative animate-slide-in-from-right lg:pl-6">
            {/* Soft glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-nje-jaffa/10 to-nje-amethyst/10 rounded-[3rem] blur-3xl opacity-70 -z-10 translate-y-8" />

            {!isAuthenticated ? (
              <div className="relative transition-transform hover:scale-[1.01] duration-500">
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
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-card dark:shadow-none border border-nje-anthracite/10 dark:border-slate-800 overflow-hidden relative transition-colors">
                {/* Brand bar */}
                <div className="h-1 w-full bg-gradient-to-r from-nje-jaffa via-nje-amethyst to-nje-cyan" />
                <div className="p-10 text-center">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-6 w-fit">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-nje-jaffa/20 to-nje-amethyst/20 flex items-center justify-center text-3xl font-bold text-nje-amethyst dark:text-nje-amethyst-light ring-4 ring-nje-pearl dark:ring-slate-900">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-nje-jaffa border-2 border-white dark:border-slate-900" />
                  </div>

                  <h3 className="text-xl font-bold text-nje-anthracite dark:text-slate-100 mb-1">
                    {userInfo.name}
                  </h3>
                  <p className="text-sm text-nje-anthracite/50 dark:text-slate-400 mb-8">
                    Bejelentkezve
                  </p>

                  <button
                    onClick={() => navigate(userInfo.dashboardPath)}
                    className="w-full bg-gradient-to-r from-nje-jaffa to-nje-amethyst text-white font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-jaffa active:scale-95"
                  >
                    <span>Irányítópult megnyitása</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>

                  <button
                    onClick={logout}
                    className="mt-4 text-sm font-medium text-nje-anthracite/40 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    Kijelentkezés
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── JOBS SECTION ─────────────────────────────────────── */}
      <section aria-label="Gyorsnavigáció" className="pb-10 lg:pb-14">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-8">
          <div className="rounded-3xl border border-nje-anthracite/10 dark:border-slate-800 bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm p-4 sm:p-5 shadow-sm">
            <div className="mb-4 px-2">
              <p className="text-xs font-bold tracking-widest uppercase text-nje-amethyst dark:text-nje-amethyst-light">
                Tartalomjegyzék
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "jobs",
                  label: "Álláslehetőség",
                  icon: Briefcase,
                  iconStyle: "text-nje-jaffa",
                },
                {
                  id: "home-map",
                  label: "Térkép",
                  icon: MapPinned,
                  iconStyle: "text-nje-cyan-dark dark:text-nje-cyan",
                },
                {
                  id: "promo-video",
                  label: "Promó videó",
                  icon: Video,
                  iconStyle: "text-nje-amethyst dark:text-nje-amethyst-light",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleScrollToSection(item.id)}
                    className="group flex items-center gap-3 rounded-2xl border border-nje-anthracite/10 dark:border-slate-700 bg-nje-pearl/65 dark:bg-slate-800/70 px-4 py-4 text-left hover:border-nje-jaffa/35 dark:hover:border-nje-jaffa/45 hover:bg-nje-jaffa-faint dark:hover:bg-slate-800 transition-all"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-nje-anthracite/10 dark:border-slate-700">
                      <Icon className={`h-5 w-5 ${item.iconStyle}`} />
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-nje-anthracite dark:text-slate-100">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        id="jobs"
        className="py-24 bg-nje-pearl dark:bg-slate-900/50 border-y border-nje-anthracite/8 dark:border-slate-800/50 transition-colors"
      >
        <div className="max-w-[1240px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-bold tracking-widest text-nje-jaffa uppercase">
              Lehetőségek
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-nje-anthracite dark:text-slate-50">
              Aktuális Állásajánlatok
            </h2>
            <p className="text-lg text-nje-anthracite/60 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Partnercégeink által meghirdetett teljes munkaidős
              álláslehetőségek. Fedezd fel a legújabb nyitott pozíciókat.
            </p>
          </div>

          <JobSlider onViewDetails={handleViewJobDetails} />

          <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/positions")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-nje-anthracite text-white text-sm font-semibold hover:bg-nje-anthracite-dark transition-colors shadow-sm"
            >
              Összes állás megtekintése
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m-4-4H3" />
              </svg>
            </button>
            <button
              onClick={() => {
                navigate("/positions");
                setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-nje-cyan-faint dark:bg-nje-cyan/10 text-nje-cyan-dark dark:text-nje-cyan text-sm font-semibold hover:bg-nje-cyan/15 transition-colors border border-nje-cyan/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Térképes nézet
            </button>
          </div>

          <div id="home-map" className="mt-16">
            <HomeMapSection />
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 lg:px-8">
        {/* TUTORIAL VIDEO */}
        <section
          id="promo-video"
          className="py-24 border-b border-nje-anthracite/8 dark:border-slate-800/50 transition-colors"
        >
          <HowToUseVideo />
        </section>

        {/* REGISTRATION PROMO */}
        <RegistrationPromo />

        {/* INFO SECTION */}
        <section className="py-12 border-t border-nje-anthracite/8 dark:border-slate-800/50 transition-colors">
          <DualInfoSection />
        </section>

        {/* REFERENCES */}
        <section className="py-12 border-t border-nje-anthracite/8 dark:border-slate-800/50 transition-colors lg:border-none">
          <ReferencesSlider />
        </section>

        {/* GALLERY */}
        <div className="py-12">
          <MaterialsGallery />
        </div>

        {/* CONTACT */}
        <section
          id="contact"
          className="relative py-24 border-t border-nje-anthracite/8 dark:border-slate-800/50 text-center overflow-hidden transition-colors"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-nje-amethyst/5 to-nje-cyan/5 blur-3xl" />
          <div className="relative max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-nje-amethyst-faint dark:bg-nje-amethyst/20 border border-nje-amethyst/20 px-4 py-1.5 mb-2">
              <span className="text-xs font-bold text-nje-amethyst dark:text-nje-amethyst-light uppercase tracking-widest">
                Kapcsolat
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-nje-anthracite dark:text-slate-50">
              Kérdése van?
            </h2>
            <p className="text-lg text-nje-anthracite/60 dark:text-slate-400">
              A rendszer egyetemi pilot projekt részeként készül. Kérdés esetén
              forduljon az egyetem duális képzési koordinátorához.
            </p>
            <a
              href="mailto:dualis@nje.hu"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-nje-jaffa to-nje-amethyst px-6 py-3 text-white font-bold shadow-jaffa hover:opacity-90 transition"
            >
              Kapcsolatfelvétel
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
