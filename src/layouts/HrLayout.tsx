import DashboardLayout, { type NavItem } from "./DashboardLayout";

export default function HrLayout() {
  const navItems: NavItem[] = [
    { to: "/hr", label: "Dashboard", end: true },
    { to: "/hr/job-postings", label: "Álláshirdetések" },
    { to: "/hr/applications", label: "Jelentkezések" },
    { to: "/hr/students", label: "Hallgatók" },
    { to: "/hr/partnerships", label: "Partnerek" },
    { to: "/hr/employees", label: "Munkavállalók" },
    { to: "/hr/company-profile", label: "Cégprofil" },
    { to: "/hr/news", label: "Hírek" },
    { to: "/hr/profile", label: "Saját profil" },
    {
      to: "/hr/guide",
      label: "Tananyag",
      hint: "Útmutató az oldal használatához",
    },
  ];

  return (
    <DashboardLayout
      roleLabel="CÉGADMIN"
      title="Duális rendszer"
      homeLink="/hr"
      navItems={navItems}
    />
  );
}
