import DashboardLayout, { type NavItem } from "../../components/DashboardLayout";

export default function TeacherLayout() {
  const navItems: NavItem[] = [
    { to: "/teacher/students", label: "Hallgatók", hint: "Ki hol dolgozik, státuszok" },
    { to: "/teacher/companies", label: "Cégek", hint: "Hallgatók cégekhez rendelve" },
    { to: "/teacher/stats", label: "Statisztika", hint: "Diagramok, haladás, összesítések" },
  ];

  return (
    <DashboardLayout
      roleLabel="Oktató"
      title="Oktatói felület"
      navItems={navItems}
    />
  );
}
