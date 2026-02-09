import { useCallback } from "react";
import { exportToExcel, getExportFilename } from "../../../utils/export";
const USER_TAB_NAMES: Record<string, string> = {
  STUDENT: "Hallgatók",
  COMPANY_ADMIN: "Cégadminok",
  UNIVERSITY_USER: "Egyetemi adminok",
  INACTIVE_USER: "Inaktív felhasználók",
};

export const useUserExport = () => {
  const handleExport = useCallback((data: any[], activeTab: string) => {
    if (!data || data.length === 0) return;

    // Define columns based on active tab
    let columns: { key: string; label: string }[] = [];

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

    // Flatten nested data for CSV
    const flatData = data.map((item) => {
      // Create a flat object based on the item type
      const flat: any = {};

      switch (activeTab) {
        case "STUDENT": {
          const student = item as any; // Cast for easier access
          flat.fullName = student.fullName || student.user?.fullName;
          flat.email = student.email || student.user?.email;
          flat.neptunCode =
            student.neptunCode || student.studentProfile?.neptunCode || "-";
          flat.currentMajor =
            student.currentMajor || student.studentProfile?.currentMajor || "-";
          break;
        }
        case "COMPANY_ADMIN": {
          const admin = item as any;
          flat.fullName = admin.fullName;
          flat.email = admin.email;
          flat.companyName = admin.companyEmployee?.company?.name || "-";
          break;
        }
        case "UNIVERSITY_USER": {
          const uni = item as any;
          flat.fullName = uni.fullName;
          flat.email = uni.email;
          break;
        }
        case "INACTIVE_USER": {
          const user = item as any;
          flat.email = user.email;
          flat.role = user.role;
          flat.isActive = user.isActive ? "Igen" : "Nem";
          break;
        }
      }
      return flat;
    });

    const tabName = USER_TAB_NAMES[activeTab] || activeTab;
    exportToExcel(
      flatData,
      getExportFilename(`users_${tabName}`, "xlsx"),
      columns,
    );
  }, []);

  return { handleExport };
};
