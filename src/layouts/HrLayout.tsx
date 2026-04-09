import DashboardLayout, { type NavItem } from "./DashboardLayout";

export default function HrLayout() {
  const navItems: NavItem[] = [
    { to: "/hr", label: "Áttekintés és statisztika", end: true },
    { to: "/hr/job-postings", label: "Álláshirdetések" },
    { to: "/hr/applications", label: "Jelentkezések" },
    { to: "/hr/students", label: "Duális helyet keresők", hint: "Keresés a munkát kereső hallgatók között" },
    { to: "/hr/partnerships", label: "Duális hallgatóink", hint: "Szerződött hallgatók nyilvántartása" },
    { to: "/hr/employees", label: "Munkavállalók" },
    { to: "/hr/company-profile", label: "Cégprofil", hint: "Megjelenés és social media linkek" },
    { to: "/hr/news", label: "Hírek" },
    { to: "/hr/profile", label: "Profil beállítások", hint: "Fiók és személyes adatok kezelése" },
    {
      to: "/hr/guide",
      label: "Oktatási segédlet",
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
