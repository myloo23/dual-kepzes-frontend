import DashboardLayout, { type NavItem } from "./DashboardLayout";

export default function AdminLayout() {
  const navItems: NavItem[] = [
    { to: "/admin", label: "Dashboard", end: true },
    { to: "/admin/users", label: "Felhasználók" },
    { to: "/admin/partnerships", label: "Partnerek" },
    { to: "/admin/companies", label: "Cégek" },
    { to: "/admin/positions", label: "Pozíciók" },
    { to: "/admin/news", label: "Hírek" },
    { to: "/admin/tags", label: "Címkék / Tag-ek" },
    { to: "/admin/settings", label: "Beállítások" },
    { to: "/admin/guide", label: "Tananyag", hint: "Útmutató az oldal használatához" },
  ];

  return (
    <DashboardLayout
      roleLabel="ADMIN"
      title="Duális rendszer"
      homeLink="/admin"
      navItems={navItems}
      sidebarTop={
        <div className="mb-2 px-2 py-1 text-[11px] text-slate-500">
          Adminisztrációs felület
        </div>
      }
    />
  );
}
