import { type Application, type ApplicationStatus } from "../../../lib/api";

interface CompanyApplicationCardProps {
    application: Application;
    isExpanded: boolean;
    isLoadingExpand: boolean;
    isActionLoading: boolean;
    isDeleting: boolean;
    onToggleExpand: (id: string) => void;
    onDecision: (id: string, status: "ACCEPTED" | "REJECTED") => void;
    onDeleteClick: (id: string) => void;
}

const statusLabels: Record<ApplicationStatus, string> = {
    SUBMITTED: "Beküldve",
    ACCEPTED: "Elfogadva",
    REJECTED: "Elutasítva",
    NO_RESPONSE: "Nincs válasz"
};

export const CompanyApplicationCard = ({
    application: displayApp,
    isExpanded,
    isLoadingExpand,
    isActionLoading,
    isDeleting,
    onToggleExpand,
    onDecision,
    onDeleteClick
}: CompanyApplicationCardProps) => {
    return (
        <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-semibold text-slate-900">
                {displayApp.position?.title ?? "Pozíció"}
            </div>
            <div className="text-sm text-slate-600">
                Státusz: {statusLabels[displayApp.status] ?? displayApp.status}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
                <button
                    onClick={() => onToggleExpand(String(displayApp.id))}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-70"
                    disabled={isLoadingExpand}
                >
                    {isLoadingExpand ? "Betöltés..." : isExpanded ? "Bezárás" : "Megtekintés"}
                </button>
                <button
                    onClick={() => onDecision(String(displayApp.id), "ACCEPTED")}
                    disabled={isActionLoading}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                    {isActionLoading ? "Mentés..." : "Elfogadás"}
                </button>
                <button
                    onClick={() => onDecision(String(displayApp.id), "REJECTED")}
                    disabled={isActionLoading}
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                >
                    Elutasítás
                </button>
                <button
                    onClick={() => onDeleteClick(String(displayApp.id))}
                    disabled={isDeleting}
                    className="rounded-lg border border-red-300 bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                    {isDeleting ? "Törlés..." : "🗑️ Törlés"}
                </button>
            </div>
            {isExpanded && (
                <>
                    {displayApp.student && (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <span className="text-xl">👨‍🎓</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Jelentkező részletes adatai</h4>
                                    <p className="text-xs text-slate-500">Személyes és tanulmányi információk</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                {/* Personal Info */}
                                <div className="space-y-3">
                                    <h5 className="text-sm font-medium text-slate-900 border-b border-slate-200 pb-1 mb-2">
                                        Személyes adatok
                                    </h5>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-slate-500">Név:</div>
                                        <div className="col-span-2 font-medium text-slate-900">{displayApp.student.fullName}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-slate-500">Neptun kód:</div>
                                        <div className="col-span-2 font-medium text-slate-900 font-mono bg-slate-100 px-1.5 py-0.5 rounded w-fit text-xs">
                                            {displayApp.student.studentProfile?.neptunCode || "Nincs megadva"}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-slate-500">Email:</div>
                                        <div className="col-span-2 font-medium text-slate-900 break-all">{displayApp.student.email}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-slate-500">Telefon:</div>
                                        <div className="col-span-2 font-medium text-slate-900">{displayApp.student.phoneNumber}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-slate-500">Anyja neve:</div>
                                        <div className="col-span-2 font-medium text-slate-900">{displayApp.student.studentProfile?.mothersName || "Nincs megadva"}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-slate-500">Született:</div>
                                        <div className="col-span-2 font-medium text-slate-900">
                                            {(() => {
                                                const profile = displayApp.student.studentProfile;
                                                console.log('Student Profile Data:', profile);
                                                console.log('Full Student Data:', displayApp.student);
                                                
                                                // Check all possible locations for birth date
                                                const birthDate = profile?.birthDate || 
                                                                profile?.dateOfBirth || 
                                                                (profile as any)?.birth_date ||
                                                                (displayApp.student as any)?.birthDate ||
                                                                (displayApp.student as any)?.dateOfBirth;
                                                
                                                console.log('Found birthDate:', birthDate);
                                                return birthDate ? new Date(birthDate).toLocaleDateString("hu-HU") : "Nincs megadva";
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Studies */}
                                <div className="space-y-3">
                                    <h5 className="text-sm font-medium text-slate-900 border-b border-slate-200 pb-1 mb-2">
                                        Lakcím és Tanulmányok
                                    </h5>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-slate-500">Lakcím:</div>
                                        <div className="col-span-2 font-medium text-slate-900">
                                            {displayApp.student.studentProfile?.location ? (
                                                `${displayApp.student.studentProfile.location.zipCode} ${displayApp.student.studentProfile.location.city}, ${displayApp.student.studentProfile.location.address}`
                                            ) : (
                                                "Nincs megadva"
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-slate-500">Intézmény:</div>
                                        <div className="col-span-2 font-medium text-slate-900">{displayApp.student.studentProfile?.highSchool || "Nincs megadva"}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-slate-500">Szak:</div>
                                        <div className="col-span-2 font-medium text-slate-900">{displayApp.student.studentProfile?.currentMajor || "Nincs megadva"}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-slate-500">Tagozat:</div>
                                        <div className="col-span-2 font-medium text-slate-900">
                                            {displayApp.student.studentProfile?.studyMode === "NAPPALI" ? "Nappali" : "Levelező"}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-slate-500">Végzés éve:</div>
                                        <div className="col-span-2 font-medium text-slate-900">{displayApp.student.studentProfile?.graduationYear || "Nincs megadva"}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-slate-500">Nyelvvizsga:</div>
                                        <div className="col-span-2 font-medium text-slate-900">
                                            {displayApp.student.studentProfile?.hasLanguageCert ? (
                                                <span className="text-emerald-600 flex items-center gap-1">
                                                    ✓ Van
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">Nincs</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {!displayApp.student && (
                        <div className="mt-4 text-sm text-slate-600">
                            A jelentkező részletes adatai nem elérhetők.
                        </div>
                    )}
                </>
            )}
            {displayApp.companyNote && (
                <div className="mt-2 text-sm text-slate-700">Megjegyzés: {displayApp.companyNote}</div>
            )}
        </div>
    );
};
