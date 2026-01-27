import DashboardLayout, { type NavItem } from "./DashboardLayout";

export default function HrLayout() {
  const navItems: NavItem[] = [
    { to: "/hr", label: "Dashboard", end: true },
    { to: "/hr/job-postings", label: "Álláshirdetések" },
    { to: "/hr/applications", label: "Jelentkezések" },
    { to: "/hr/partnerships", label: "Partnerek" },
    { to: "/hr/employees", label: "Munkavállalók" },
    { to: "/hr/company-profile", label: "Cégprofil" },
    { to: "/hr/profile", label: "Saját profil" },
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
