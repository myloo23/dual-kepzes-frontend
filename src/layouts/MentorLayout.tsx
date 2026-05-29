import DashboardLayout, { type NavItem } from "./DashboardLayout";

export default function MentorLayout() {
  const navItems: NavItem[] = [
    {
      to: "/mentor/partnerships",
      label: "Saját partnerek",
      hint: "Hozzám rendelt hallgatók",
    },
    {
      to: "/mentor/positions",
      label: "Cég hirdetései",
      hint: "Vállalati álláslehetőségek",
    },
    {
      to: "/mentor/stats",
      label: "Statisztika",
      hint: "Képzési mutatók és elemzések",
    },
    {
      to: "/mentor/news",
      label: "Hírek",
      hint: "Közlemények és hírek",
    },
    { to: "/mentor/profile", label: "Profil", hint: "Mentor adatok" },
    {
      to: "/mentor/guide",
      label: "Oktatási segédlet",
      hint: "Prezentációk és tananyagok",
    },
  ];

  return (
    <DashboardLayout
      roleLabel="Mentor"
      title="Mentori felület"
      navItems={navItems}
    />
  );
}
