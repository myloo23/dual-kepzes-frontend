import DashboardLayout, { type NavItem } from "./DashboardLayout";

export default function UniversityLayout() {
  const navItems: NavItem[] = [
    { to: "/university", label: "Dashboard", end: true },
    { to: "/university/students", label: "Hallgatók" },
    { to: "/university/partnerships", label: "Partnerkapcsolatok" },
    { to: "/university/news", label: "Hírek" },
    { to: "/university/profile", label: "Saját profil" },
    { to: "/university/guide", label: "Tananyag", hint: "Útmutató az oldal használatához" },
  ];

  return (
    <DashboardLayout
      roleLabel="EGYETEMI"
      title="Duális rendszer"
      homeLink="/university"
      navItems={navItems}
    />
  );
}
