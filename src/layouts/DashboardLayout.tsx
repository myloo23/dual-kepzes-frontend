import { type ReactNode, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "../utils/cn";
import { useAuth } from "../features/auth";
import Breadcrumbs from "../components/shared/Breadcrumbs";
import njeLogoImage from "../assets/logos/nje_logos/nje_logo2.webp";

export type NavItem = {
  to: string;
  label: string;
  hint?: string;
  end?: boolean;
};

export default function DashboardLayout(props: {
  roleLabel: string;
  title?: string;
  navItems: NavItem[];
  sidebarTop?: ReactNode;
  homeLink?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuth();

  const userEmail = user?.email ?? null;

  return (
    <div className="min-h-screen bg-nje-pearl dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">

        {/* Mobil fejléc */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={njeLogoImage}
              alt="NJE"
              width={167}
              height={120}
              className="h-10 w-auto object-contain dark:brightness-0 dark:invert"
            />
            <div>
              <div className="text-[11px] font-semibold text-nje-amethyst dark:text-nje-amethyst-light uppercase tracking-widest">
                {props.roleLabel}
              </div>
              <div className="text-sm font-bold text-nje-anthracite dark:text-slate-100">
                {props.title ?? "Vezérlőpult"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((p) => !p)}
            className="rounded-lg border border-nje-anthracite/20 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-semibold text-nje-anthracite dark:text-slate-300 transition-colors"
          >
            {mobileOpen ? "Bezár" : "Menü"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
          {/* Sidebar */}
          <aside
            className={cn(
              "rounded-2xl overflow-hidden shadow-card dark:shadow-none transition-colors",
              mobileOpen ? "block" : "hidden",
              "lg:block lg:self-start",
            )}
          >
            {/* Sidebar brand header */}
            <div className="sidebar-brand-bar px-5 pt-6 pb-5 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -right-2 top-16 w-16 h-16 rounded-full bg-nje-jaffa/20 pointer-events-none" />

              <NavLink
                to={props.homeLink || "/"}
                className="block relative z-10"
              >
                <img
                  src={njeLogoImage}
                  alt="Neumann János Egyetem"
                  width={167}
                  height={120}
                  className="h-14 w-auto object-contain brightness-0 invert mb-4"
                />
                <div className="text-[10px] font-semibold text-white/60 uppercase tracking-widest mb-0.5">
                  {props.roleLabel}
                </div>
                <div className="text-sm font-bold text-white">
                  {props.title ?? "Vezérlőpult"}
                </div>
                {userEmail && (
                  <div className="mt-1 text-[11px] text-white/50 truncate">
                    {userEmail}
                  </div>
                )}
              </NavLink>
            </div>

            {/* Nav body */}
            <div className="bg-white dark:bg-slate-900 px-3 py-3 border-x border-b border-nje-anthracite/10 dark:border-slate-800 rounded-b-2xl">
              {props.sidebarTop && (
                <div className="mb-2 px-2">{props.sidebarTop}</div>
              )}

              <nav className="space-y-0.5">
                {props.navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-xl px-3 py-2.5 text-sm transition-all duration-150",
                        isActive
                          ? "bg-nje-amethyst-faint dark:bg-nje-amethyst/20 text-nje-amethyst dark:text-nje-amethyst-light font-semibold border-l-[3px] border-nje-jaffa pl-[calc(0.75rem-3px)]"
                          : "text-nje-anthracite dark:text-slate-300 hover:bg-nje-pearl dark:hover:bg-slate-800/50 hover:text-nje-anthracite font-medium border-l-[3px] border-transparent pl-[calc(0.75rem-3px)]",
                      )
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <div>{item.label}</div>
                    {item.hint && (
                      <div className="text-[11px] opacity-50 mt-0.5">
                        {item.hint}
                      </div>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-3 pt-3 border-t border-nje-anthracite/10 dark:border-slate-800">
                <button
                  onClick={logout}
                  className="w-full rounded-xl bg-nje-anthracite dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold text-white hover:bg-nje-anthracite-dark dark:hover:bg-slate-700 transition-colors"
                >
                  Kijelentkezés
                </button>
              </div>
            </div>
          </aside>

          {/* Tartalom */}
          <main className="rounded-2xl border border-nje-anthracite/10 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-card dark:shadow-none transition-colors">
            <Breadcrumbs className="mb-6" />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
