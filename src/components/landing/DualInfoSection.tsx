import { ArrowRight, Building2, GraduationCap } from "lucide-react";

export default function DualInfoSection() {
    return (
        <section className="py-16 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2">

                    {/* Duális Képzés Leírás */}
                    <div className="relative">
                        <div className="absolute -left-4 -top-4 w-20 h-20 bg-blue-100 rounded-full blur-xl opacity-60" />
                        <div className="relative bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                                <GraduationCap size={14} />
                                Duális Képzés
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Mi a Duális Képzés?
                            </h2>

                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    A duális képzés során a hallgató az egyetemi tanulmányai mellett egy vállalatnál is aktívan részt vesz a munkában.
                                    A tanulmányi idő alatt <strong>folyamatos kapcsolatban áll a céggel</strong>, hallgatói munkaszerződéssel dolgozik, és havi juttatásban részesül.
                                </p>
                                <p>
                                    A szorgalmi időszakot az egyetemen tölti, míg az egyetemi szünetekben hosszabb, szervezett vállalati gyakorlati időszakokon vesz részt,
                                    a szak képzési programja mellett a cég saját képzési rendszerét is teljesítve.
                                </p>
                                <p>
                                    A duális képzés mindhárom fél számára előnyös: a hallgató már diplomája megszerzése előtt értékes szakmai tapasztalatot és piacképes tudást szerez,
                                    a vállalat saját igényeire szabott jövőbeli munkavállalókat képez, az egyetem pedig gyakorlatorientáltabb, munkaerőpiac-közeli képzést biztosít.
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <a
                                    href="https://gamf.nje.hu/dualis-kepzes"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-dkk-blue font-semibold hover:underline"
                                >
                                    További részletek a GAMF oldalán <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Duális Képzési Központ */}
                    <div className="relative">
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-100 rounded-full blur-xl opacity-60" />
                        <div className="relative bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full flex flex-col">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-6 w-fit">
                                <Building2 size={14} />
                                Duális Képzési Központ
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                A Központ Feladatai
                            </h2>

                            <div className="space-y-4 text-slate-600 leading-relaxed mb-6">
                                <p>
                                    A <strong>Neumann János Egyetem Duális Képzési Központja</strong> a duális képzések szakmai és szervezeti hátterét biztosítja,
                                    összefogja az egyetem és a vállalati partnerek együttműködését, valamint támogatja a hallgatók duális tanulmányainak teljes folyamatát.
                                </p>
                                <p>
                                    A központ feladatai közé tartozik a vállalati kapcsolatok koordinálása, a képzések működtetésének összehangolása,
                                    valamint a hallgatók és a cégek folyamatos szakmai és adminisztratív támogatása.
                                </p>
                            </div>

                            {/* Leader Highlight */}
                            <div className="mt-auto bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                        EA
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Dr. Angeli Eliza</h4>
                                        <p className="text-xs text-rose-600 font-bold uppercase mb-2">A KÖZPONT VEZETŐJE</p>
                                        <p className="text-sm text-slate-600 leading-snug">
                                            Meghatározó szerepet tölt be a duális képzések fejlesztésében és minőségbiztosításában.
                                            <a href="mailto:angeli.eliza@nje.hu" className="text-dkk-blue hover:underline ml-1">
                                                angeli.eliza@nje.hu
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
