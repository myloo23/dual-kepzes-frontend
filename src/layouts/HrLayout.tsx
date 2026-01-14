// src/layouts/HrLayout.tsx
import DashboardLayout, { type NavItem } from "../components/layout/DashboardLayout";

export default function HrLayout() {
  const navItems: NavItem[] = [
    { to: "/hr", label: "Kezdőlap", hint: "Áttekintés" },
    { to: "/hr/job-postings", label: "Álláshirdetések", hint: "Hirdetés létrehozás/szerkesztés" },
    { to: "/hr/messages", label: "Üzenetek", hint: "Kommunikáció" },
    { to: "/hr/applications", label: "Jelentkezések", hint: "Elfogad / elutasít / várólista" },
    { to: "/hr/mentors", label: "Mentorok kezelése", hint: "Mentori jogosultság kiosztása" },
    { to: "/hr/company-profile", label: "Cégprofil", hint: "Cég adatainak kezelése" },
  ];

  return (
    <DashboardLayout
      roleLabel="Cég HR"
      title="HR felület"
      navItems={navItems}
    />
  );
}