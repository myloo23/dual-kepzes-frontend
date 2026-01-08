import DashboardLayout, {type  NavItem } from "../components/layout/DashboardLayout";

export default function HrLayout() {
  const navItems: NavItem[] = [
    { to: "/hr/job-postings", label: "Álláshirdetések", hint: "Hirdetés létrehozás/szerkesztés" },
    { to: "/hr/messages", label: "Üzenetek", hint: "Kommunikáció" },
    { to: "/hr/applications", label: "Jelentkezések", hint: "Elfogad / elutasít / várólista" },
    { to: "/hr/mentors", label: "Mentorok kezelése", hint: "Mentori jogosultság kiosztása" },
    { to: "/hr/profile", label: "Profil", hint: "Cég HR adatok" },
  ];

  return (
    <DashboardLayout
      roleLabel="Cég HR"
      title="HR felület"
      navItems={navItems}
    />
  );
}
