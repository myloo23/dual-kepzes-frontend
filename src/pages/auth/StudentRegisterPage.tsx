import StudentRegisterForm from "../../features/auth/components/StudentRegisterForm";

export default function StudentRegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Hallgatói regisztráció</h1>
          <p className="text-sm text-slate-600">
            Töltsd ki a kötelező mezőket. A Neptun kód opcionális.
          </p>
        </div>

        <StudentRegisterForm />
      </div>
    </div>
  );
}
