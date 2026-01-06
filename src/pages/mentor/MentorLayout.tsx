import DashboardLayout, { type NavItem } from "../../components/DashboardLayout";

export default function MentorLayout() {
  const navItems: NavItem[] = [
    { to: "/mentor/messages", label: "Üzenetek", hint: "Kommunikáció hallgatókkal" },
    { to: "/mentor/progress", label: "Haladási napló", hint: "Hallgatók naplói" },
    { to: "/mentor/reviews", label: "Hallgatók értékelése", hint: "Saját hallgatók értékelése" },
    { to: "/mentor/profile", label: "Profil", hint: "Mentor adatok" },
  ];

  return (
    <DashboardLayout
      roleLabel="Mentor"
      title="Mentori felület"
      navItems={navItems}
    />
  );
}
