import { useEffect, useState } from "react";
import { api, type StudentProfile } from "../../lib/api";
import StudentFormModal from "../../components/admin/StudentFormModal";
import AdminUserModal from "../../components/admin/AdminUserModal";

type TabType = "STUDENT" | "COMPANY_ADMIN" | "UNIVERSITY_USER" | "INACTIVE_USER";

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<TabType>("STUDENT");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Student specific modal
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Generic admin/user modal
  const [isGenericModalOpen, setIsGenericModalOpen] = useState(false);
  const [selectedGeneric, setSelectedGeneric] = useState<any | null>(null);

  const [lookupId, setLookupId] = useState("");

  const load = async () => {
    setLoading(true);
    setErr(null);
    setItems([]);
    try {
      let res: any[] = [];
      switch (activeTab) {
        case "STUDENT":
          res = await api.students.list();
          break;
        case "COMPANY_ADMIN":
          res = await api.companyAdmins.list();
          break;
        case "UNIVERSITY_USER":
          res = await api.universityUsers.list();
          break;
        case "INACTIVE_USER":
          res = await api.users.listInactive();
          break;
      }
      setItems(Array.isArray(res) ? res : []);
    } catch (e: any) {
      setErr(e.message || "Hiba az adatok lekérésénél.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [activeTab]);

  const openItem = (item: any) => {
    setMsg(null);
    setErr(null);
    if (activeTab === "STUDENT") {
      setSelectedStudent(item);
      setIsStudentModalOpen(true);
    } else {
      setSelectedGeneric(item);
      setIsGenericModalOpen(true);
    }
  };

  const openById = async (id: string | number) => {
    // Lookup feature currently mainly relevant for students as ID lookup logic is complex across tables
    // Or we can try to fetch from current tab's endpoint
    if (!id) return;
    setLoading(true);
    setErr(null);
    try {
      let item = null;
      switch (activeTab) {
        case "STUDENT":
          item = await api.students.get(id);
          setSelectedStudent(item);
          setIsStudentModalOpen(true);
          break;
        case "COMPANY_ADMIN":
          item = await api.companyAdmins.get(id);
          setSelectedGeneric(item);
          setIsGenericModalOpen(true);
          break;
        case "UNIVERSITY_USER":
          item = await api.universityUsers.get(id);
          setSelectedGeneric(item);
          setIsGenericModalOpen(true);
          break;
        default:
          // generic users do not have get-by-id public endpoint easily without role context usually
          setErr("Keresés ebben a kategóriában nem támogatott ID alapján.");
          return;
      }
      setMsg("Találat betöltve.");
    } catch (e: any) {
      setErr(e.message || "Nem található.");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm("Biztos törlöd/deaktiválod ezt a felhasználót?")) return;
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      switch (activeTab) {
        case "STUDENT":
          await api.students.remove(id);
          break;
        case "COMPANY_ADMIN":
          await api.companyAdmins.remove(id);
          break;
        case "UNIVERSITY_USER":
          await api.universityUsers.remove(id);
          break;
        case "INACTIVE_USER":
          // Can't "delete" inactive user more? maybe fully delete?
          // Usually we just ignore or hard delete. API might not support hard delete yet.
          alert("Inaktív felhasználók végleges törlése funkció még nincs implementálva.");
          return;
      }
      setMsg("Sikeres törlés.");
      if (activeTab === "STUDENT" && selectedStudent?.id === id) setIsStudentModalOpen(false);
      if (activeTab !== "STUDENT" && selectedGeneric?.id === id) setIsGenericModalOpen(false);
      await load();
    } catch (e: any) {
      setErr(e.message || "Törlés sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (id: string | number) => {
    if (activeTab !== "INACTIVE_USER") return;
    setLoading(true);
    try {
      await api.users.reactivate(id);
      setMsg("Felhasználó újraaktiválva.");
      await load();
    } catch (e: any) {
      setErr(e.message || "Hiba az aktiváláskor.");
    } finally {
      setLoading(false);
    }
  }

  const handleSaveStudent = async (data: Record<string, any>) => {
    if (!selectedStudent) return;
    await api.students.update(selectedStudent.id, data);
    setMsg("Hallgató frissítve.");
    await load();
  };

  const handleSaveGeneric = async (data: Record<string, any>) => {
    if (!selectedGeneric) return;
    const id = selectedGeneric.id;
    if (activeTab === "COMPANY_ADMIN") {
      await api.companyAdmins.update(id, data);
    } else if (activeTab === "UNIVERSITY_USER") {
      await api.universityUsers.update(id, data);
    } else if (activeTab === "INACTIVE_USER") {
      // Maybe allow edit of inactive user too?
      // api.users.update(id, data) - if endpoint exists.
      // currently we only have reactivate/deactivate.
      setErr("Inaktív felhasználó szerkesztése nem támogatott.");
      throw new Error("Nem támogatott művelet.");
    }
    setMsg("Adatok mentve.");
    await load();
  };

  // Columns helper
  const renderColumns = (item: any) => {
    if (activeTab === "STUDENT") {
      return (
        <>
          <td className="px-4 py-3 font-medium text-slate-900">{item.fullName ?? item.name ?? "User"}</td>
          <td className="px-4 py-3 text-slate-600">{item.email ?? "-"}</td>
          <td className="px-4 py-3 text-slate-500">{item.neptunCode ?? "-"}</td>
        </>
      )
    } else if (activeTab === "COMPANY_ADMIN") {
      return (
        <>
          <td className="px-4 py-3 font-medium text-slate-900">{item.user?.fullName ?? item.fullName ?? item.name ?? "User"}</td>
          <td className="px-4 py-3 text-slate-600">{item.user?.email ?? item.email ?? "-"}</td>
          <td className="px-4 py-3 text-slate-500">CégID: {item.companyId ?? "-"}</td>
        </>
      )
    } else if (activeTab === "UNIVERSITY_USER") {
      return (
        <>
          <td className="px-4 py-3 font-medium text-slate-900">{item.user?.fullName ?? item.fullName ?? item.name ?? "User"}</td>
          <td className="px-4 py-3 text-slate-600">{item.user?.email ?? item.email ?? "-"}</td>
          <td className="px-4 py-3 text-slate-500">-</td>
        </>
      )
    } else {
      // Inactive Users
      return (
        <>
          <td className="px-4 py-3 font-medium text-slate-900">{item.fullName ?? item.name ?? "User"}</td>
          <td className="px-4 py-3 text-slate-600">{item.email ?? "-"}</td>
          <td className="px-4 py-3 text-slate-500">{item.role ?? "-"}</td>
        </>
      )
    }
  }

  const getTabLabel = (type: TabType) => {
    switch (type) {
      case "STUDENT": return "Hallgatók";
      case "COMPANY_ADMIN": return "Cégadminok";
      case "UNIVERSITY_USER": return "Egyetemi felhasználók";
      case "INACTIVE_USER": return "Inaktív felhasználók";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Felhasználók kezelése</h1>
        <p className="text-sm text-slate-600">
          Különböző szerepkörű felhasználók listázása és szerkesztése.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {(["STUDENT", "COMPANY_ADMIN", "UNIVERSITY_USER", "INACTIVE_USER"] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === t
              ? "bg-white border border-slate-200 border-b-white text-blue-600 -mb-px"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
          >
            {getTabLabel(t)}
          </button>
        ))}
      </div>

      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>}
      {msg && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{msg}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-base font-bold text-slate-800">{getTabLabel(activeTab)}</h2>

          <div className="flex gap-2">
            <input
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="Keresés ID alapján..."
              className="w-40 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <button
              type="button"
              onClick={() => openById(lookupId)}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-900 transition"
            >
              Keresés
            </button>
            <button
              onClick={load}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 transition ml-2"
            >
              Frissítés
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[600px] rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full text-sm relative">
            <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">ID</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Név</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Email</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">
                  {activeTab === "STUDENT" ? "Neptun" : (activeTab === "COMPANY_ADMIN" ? "Cég" : "Egyéb")}
                </th>
                <th className="px-4 py-3 text-right font-semibold bg-slate-50">Művelet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={String(item.id)} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{String(item.id).slice(0, 8)}...</td>

                  {renderColumns(item)}

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {activeTab === "INACTIVE_USER" && (
                        <button
                          onClick={() => handleReactivate(item.id)}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition"
                        >
                          Aktiválás
                        </button>
                      )}

                      {activeTab !== "INACTIVE_USER" && (
                        <button
                          onClick={() => openItem(item)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                        >
                          Szerkesztés
                        </button>
                      )}

                      {/* Delete button available for all, logic determines if hard delete or deactivate */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        {activeTab === "INACTIVE_USER" ? "Törlés" : "Törlés"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr>
                  <td className="px-4 py-12 text-center text-slate-500" colSpan={5}>
                    Nincs adat ebben a kategóriában.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        initialData={selectedStudent}
      />

      <AdminUserModal
        isOpen={isGenericModalOpen}
        onClose={() => setIsGenericModalOpen(false)}
        onSave={handleSaveGeneric}
        initialData={selectedGeneric}
        type={activeTab === "COMPANY_ADMIN" ? "COMPANY_ADMIN" : (activeTab === "UNIVERSITY_USER" ? "UNIVERSITY_USER" : "USER")}
      />
    </div>
  );
}
