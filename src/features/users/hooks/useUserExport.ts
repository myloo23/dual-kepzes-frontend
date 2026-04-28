import { useCallback } from "react";
import type {
  StudentProfile,
  CompanyAdminProfile,
  UniversityUserProfile,
  User,
} from "../../../types/api.types";
import { exportToExcel, getExportFilename } from "../../../utils/export";

type AdminExportableUser =
  | StudentProfile
  | CompanyAdminProfile
  | UniversityUserProfile
  | User;

// Runtime shape when the API returns a student that may wrap data under user/studentProfile
type StudentExportShape = StudentProfile & {
  user?: { fullName?: string; email?: string };
  studentProfile?: { neptunCode?: string | null; currentMajor?: string };
};

type FlatUserRow = {
  fullName?: string;
  email?: string;
  neptunCode?: string;
  currentMajor?: string;
  companyName?: string;
  role?: string;
  isActive?: string;
};

const USER_TAB_NAMES: Record<string, string> = {
  STUDENT: "Hallgatók",
  COMPANY_ADMIN: "Cégadminok",
  UNIVERSITY_USER: "Egyetemi adminok",
  INACTIVE_USER: "Inaktív felhasználók",
};

export const useUserExport = () => {
  const handleExport = useCallback(
    (data: AdminExportableUser[], activeTab: string) => {
      if (!data || data.length === 0) return;

      // Define columns based on active tab
      let columns: { key: keyof FlatUserRow; label: string }[] = [];

      if (activeTab === "STUDENT") {
        columns = [
          { key: "fullName", label: "Név" },
          { key: "email", label: "Email" },
          { key: "neptunCode", label: "Neptun kód" },
          { key: "currentMajor", label: "Szak" },
        ];
      } else if (activeTab === "COMPANY_ADMIN") {
        columns = [
          { key: "fullName", label: "Név" },
          { key: "email", label: "Email" },
          { key: "companyName", label: "Cég" },
        ];
      } else if (activeTab === "UNIVERSITY_USER") {
        columns = [
          { key: "fullName", label: "Név" },
          { key: "email", label: "Email" },
        ];
      } else {
        columns = [
          { key: "email", label: "Email" },
          { key: "role", label: "Szerepkör" },
          { key: "isActive", label: "Aktív" },
        ];
      }

      // Flatten nested data for export
      const flatData = data.map((item): FlatUserRow => {
        switch (activeTab) {
          case "STUDENT": {
            const student = item as StudentExportShape;
            return {
              fullName: student.fullName || student.user?.fullName,
              email: student.email || student.user?.email,
              neptunCode:
                student.neptunCode ||
                student.studentProfile?.neptunCode ||
                "-",
              currentMajor:
                student.currentMajor ||
                student.studentProfile?.currentMajor ||
                "-",
            };
          }
          case "COMPANY_ADMIN": {
            const admin = item as CompanyAdminProfile;
            return {
              fullName: admin.fullName,
              email: admin.email,
              companyName: admin.companyEmployee?.company?.name || "-",
            };
          }
          case "UNIVERSITY_USER": {
            const uni = item as UniversityUserProfile;
            return {
              fullName: uni.fullName,
              email: uni.email,
            };
          }
          case "INACTIVE_USER": {
            const user = item as User;
            return {
              email: user.email,
              role: user.role,
              isActive: user.isActive ? "Igen" : "Nem",
            };
          }
          default:
            return {};
        }
      });

      const tabName = USER_TAB_NAMES[activeTab] || activeTab;
      exportToExcel(
        flatData,
        getExportFilename(`users_${tabName}`, "xlsx"),
        columns,
      );
    },
    [],
  );

  return { handleExport };
};
