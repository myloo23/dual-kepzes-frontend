import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import LoginCard from "../../components/landing/LoginCard";
import HowItWorksSection from "../../components/landing/HowItWorksSection";
import JobSlider from "../../components/landing/JobSlider";
import MaterialsGallery from "../../components/landing/MaterialsGallery";
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
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);

    try {
      const res = await api.login(email.trim(), password);

      console.log("API Válasz:", res);
      console.log("Kapott role:", res.user.role);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      const normalizedRole = res.user.role.trim().toUpperCase();
      localStorage.setItem("role", normalizedRole);

      // Értesítjük a Navbar-t a változásról
      window.dispatchEvent(new Event("localStorageUpdated"));

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

  // Ha már be van jelentkezve, átirányítjuk
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) return;

    const userRole = role.trim().toUpperCase();
    const target = roleToPath[userRole];
    if (target) navigate(target, { replace: true });
  }, [navigate]);

  const handleViewJobDetails = (positionId: string | number) => {
    // Navigate to positions page and scroll to the specific position
    sessionStorage.setItem("highlightPositionId", String(positionId));
    navigate("/positions");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8">
      {/* HERO + LOGIN */}
      <section
        id="home"
        className="py-10 lg:py-16 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center"
      >
        <div>
          <div className="flex items-center gap-4 mb-6">
            <img
              src={logoImage}
              alt="Duális Képzési Központ"
              className="h-16 lg:h-20 object-contain"
            />
            <img
              src={njeLogoImage}
              alt="Neumann János Egyetem"
              className="h-24 lg:h-28 object-contain"
            />
          </div>
          <p className="text-sm font-medium text-dkk-blue mb-2">
            Duális képzések online felülete
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Duális képzési online rendszer
          </h1>
          <p className="text-slate-600 mb-4 max-w-xl">
            Egy egységes platform a hallgatók, céges partnerek és az
            egyetem számára a duális képzés jelentkezési, szerződéses
            és naplózási folyamatainak kezelésére.
          </p>
          <ul className="space-y-1.5 text-sm text-slate-700">
            <li>🎓 Hallgatói jelentkezés és dokumentumfeltöltés</li>
            <li>🏢 Céges pozíciók és jelentkezéskezelés</li>
            <li>📘 Haladási napló és mentor jóváhagyás</li>
            <li>📝 Félév végi értékelések és admin felület</li>
          </ul>
        </div>

        <LoginCard
          email={email}
          password={password}
          loginError={loginError}
          loading={loading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleLoginSubmit}
        />
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

      <HowItWorksSection />

      <MaterialsGallery />

      {/* KAPCSOLAT */}
      <section id="contact" className="py-10 border-t border-dkk-gray/30">
        <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-3">
          Kapcsolat
        </h2>
        <p className="text-sm text-slate-600 max-w-xl">
          A rendszer egyetemi pilot projekt részeként készül. Kérdés
          esetén forduljon az egyetem duális képzési koordinátorához.
        </p>
      </section>
    </div>
  );
}

export default HomePage;