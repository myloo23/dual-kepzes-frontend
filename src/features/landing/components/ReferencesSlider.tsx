import { useRef, useState, useEffect } from "react";
import { Mail, Briefcase, Info } from "lucide-react";

// Import images
import sariBenceImg from "../../../assets/reference-images/SariB-V-199x300.jpg";
import vinczeImreImg from "../../../assets/reference-images/VinczeI-V-199x300.jpg";
import vajdaZsuzsannaImg from "../../../assets/reference-images/Vajda_Zs_1635.jpg";
import ivanovicsGergelyImg from "../../../assets/reference-images/Ivanovics_G_446.jpg";
import pappKlaudiaImg from "../../../assets/reference-images/Papp_K_1638.jpg";
import kiralyIldikoImg from "../../../assets/reference-images/Kiraly_I.jpg";
import borzakNikolettImg from "../../../assets/reference-images/Borzsak_N.jpg";
import subaEdinaImg from "../../../assets/reference-images/Suba_E.jpg";
import boldizsarAdriennImg from "../../../assets/reference-images/Adri-1-1-200x300.jpg";

// Data extracted from the user's provided text
const REFERENCES = [
    {
        name: "Sári Bence",
        title: "Mérnökinformatika és villamosmérnök képzés",
        email: "sari.bence@nje.hu",
        description: "Mérnökinformatikus BSc és MBA végzettséggel rendelkezem a Neumann János Egyetemen, szakmai érdeklődésem középpontjában a robotika, a 3D tervezés és nyomtatás, valamint a mikrovezérlők alkalmazása áll. Oktatói és kutatói munkám mellett aktívan részt veszek az egyetemi közéletben, a duális képzés referenseként támogatom a hallgatókat és a partnercégeket, valamint közreműködöm az egyetem nemzetköziesítésében az EU4DUAL projekt keretében.",
        image: sariBenceImg
    },
    {
        name: "Vincze Imre",
        title: "Gépészmérnöki képzés",
        email: "vincze.imre@nje.hu",
        description: "Gépészmérnöki végzettségemet a GAMF-on, minőségügyi szakmérnöki és mesterszintű diplomámat a Budapesti Műszaki és Gazdaságtudományi Egyetemen szereztem. Jelenleg a Neumann János Egyetemen dolgozom mesteroktatóként.",
        image: vinczeImreImg
    },
    {
        name: "Vajda Zsuzsanna",
        title: "Gépészmérnöki képzés",
        email: "vajda.zsuzsanna@nje.hu",
        description: "A Neumann János Egyetemen, Kecskeméten oktatok a GAMF Kar IJAT tanszékének mesteroktatójaként. Munkám során a gyakorlatorientált képzésre és az elméleti ismeretek gyakorlati alkalmazására helyezem a hangsúlyt, támogatva a hallgatók szakmai fejlődését.",
        image: vajdaZsuzsannaImg
    },
    {
        name: "Ivánovics Gergely",
        title: "Járműmérnöki képzés",
        email: "ivanovics.gergely@nje.hu",
        description: "A Neumann János Egyetemen, Kecskeméten oktatok a GAMF Kar IJAT tanszékének mesteroktatójaként. Oktatói munkámban a műszaki ismeretek gyakorlatorientált átadására és a hallgatók szakmai fejlődésének támogatására helyezem a hangsúlyt, különös figyelmet fordítva az elmélet és a gyakorlat összekapcsolására.",
        image: ivanovicsGergelyImg
    },
    {
        name: "Papp Klaudia",
        title: "Járműmérnöki képzés",
        email: "papp.klaudia@nje.hu",
        description: "A Neumann János Egyetemen, Kecskeméten oktatok a GAMF Kar IJAT tanszékének tanársegédeként. Oktatói munkám során a hallgatók szakmai alapjainak megerősítésére és a gyakorlatorientált tudás átadására helyezem a hangsúlyt, támogatva fejlődésüket és sikeres tanulmányaikat.",
        image: pappKlaudiaImg
    },
    {
        name: "Király Ildikó",
        title: "Kertészeti képzések",
        email: "kiraly.ildiko@nje.hu",
        description: "Okleveles kertészmérnöki diplomát és PhD fokozatot szereztem a Budapesti Corvinus Egyetem Kertészettudományi Karán, doktori kutatásomban a Kárpát-medencei almafajták pomológiai és molekuláris jellemzésével foglalkoztam. Jelenleg a Neumann János Egyetem Kertészeti és Vidékfejlesztési Karának egyetemi docense vagyok, a kertészmérnöki MSc szak szakfelelőseként és a duális képzés kari referenseként, kutatási területem a Kárpát-medencei gyümölcsfajták morfológiai és molekuláris vizsgálata.",
        image: kiralyIldikoImg
    },
    {
        name: "Borzák Nikolett",
        title: "Gazdaságtudományi képzések",
        email: "borzak.nikolett@nje.hu",
        description: "A Neumann János Egyetem Gazdaságtudományi Karának beiskolázási csapatában dolgozom, célom, hogy a középiskolások magabiztosan és jó érzéssel válasszák a kecskeméti GTK-t, ahol támogató, közösségépítő közeg várja őket. A Hallgatói Iroda munkatársaként a kari kommunikációért és a duális vállalati kapcsolattartásért felelek, valamint a végzett hallgatókkal való kapcsolattartást is erősítem a kari alumni programokon keresztül.",
        image: borzakNikolettImg
    },
    {
        name: "Suba Edina",
        title: "Gazdaságtudományi képzések",
        email: "suba.edina@nje.hu",
        description: "A Dékáni Hivatal részeként a Hallgatói Irodában az oktatással és a hallgatókkal kapcsolatos ügyek koordinálásával foglalkozom, beleértve a tanulmányi és ösztöndíjügyeket, valamint az oktatók és hallgatók közötti kommunikáció támogatását. Részt veszek a duális képzés és a kötelező szakmai gyakorlatok szervezésében, kapcsolatot tartok vállalati partnerekkel és ösztöndíjprogramokkal, valamint közreműködöm a kari beiskolázási kampányokban és az MBA-képzés ügyintézésében.",
        image: subaEdinaImg
    },
    {
        name: "Dr. Boldizsár Adrienn",
        title: "Logisztikai mérnök képzés",
        email: "boldizsar.adrienn@nje.hu",
        description: "A logisztikai mérnöki alapszak szakfelelőseként és vállalati referensként dolgozom, közlekedésmérnöki alap- és mesterszakos diplomámat a Budapesti Műszaki és Gazdaságtudományi Egyetemen szereztem, majd a Kandó Kálmán Doktori Iskolában folytattam PhD tanulmányaimat. Kutatási területem a fenntartható és gazdaságos áruszállítás, annak társadalmi hatásai és a logisztikai rendszerek összefüggései, jelenleg a KTI – Magyar Közlekedéstudományi és Logisztikai Intézet Logisztikai Innovációs csoportjában dolgozom tudományos munkatársként.",
        image: boldizsarAdriennImg
    },
    {
        name: "Dr. Angeli Eliza",
        title: "DKK vezetője",
        email: "angeli.eliza@nje.hu",
        group: "Duális Képzés Központ",
        description: "A központ szakmai irányítását látom el, meghatározó szerepet töltök be a duális képzések fejlesztésében és minőségbiztosításában. Munkámmal hozzájárulok ahhoz, hogy az egyetemen megvalósuló duális képzések a munkaerőpiaci igényekhez igazodva, magas szakmai színvonalon működjenek."
    },
    {
        name: "Palotai Bernadett",
        title: "Tanulmányi ügyintéző",
        email: "palotai.bernadett@nje.hu",
        group: "Oktatási és Képzési Igazgatóság",
        description: "Tanulmányi ügyintézőként támogatom az oktatásszervezési feladatokat és a hallgatói ügyintézést."
    }
];

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getRandomColor(name: string) {
    const colors = [
        "bg-indigo-100 text-indigo-700",
        "bg-rose-100 text-rose-700",
        "bg-emerald-100 text-emerald-700",
        "bg-amber-100 text-amber-700",
        "bg-sky-100 text-sky-700",
        "bg-violet-100 text-violet-700",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

export default function ReferencesSlider() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Duplicate list for infinite scroll effect
    const displayList = [...REFERENCES, ...REFERENCES];

    useEffect(() => {
        let animationFrameId: number;
        const scrollContainer = scrollRef.current;

        const animate = () => {
            if (!scrollContainer) return;

            // Only auto-scroll if not paused and not dragging
            if (!isPaused && !isDragging) {
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += 0.5; // Adjust speed here
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setIsPaused(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        setIsPaused(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsPaused(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2; // Scroll-fastness
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    return (
        <section className="w-full py-24 bg-white border-t border-dkk-gray/30">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-10">
                <h2 className="text-3xl font-bold text-slate-900 text-center">
                    Duális Referensek és Munkatársak
                </h2>
                <div className="w-20 h-1.5 bg-dkk-blue mx-auto mt-4 rounded-full" />
                <p className="text-center text-slate-600 mt-4 max-w-2xl mx-auto">
                    Ismerje meg a képzések szakmai felelőseit és a központ munkatársait, akik támogatják a duális képzésben résztvevő hallgatókat.
                </p>
            </div>

            <div className="relative group">
                {/* Fade overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

                <div
                    ref={scrollRef}
                    className="flex gap-6 py-4 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing px-4"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsPaused(true)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                >
                    {displayList.map((person, index) => (
                        <div
                            key={`${person.email}-${index}`}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 w-[320px] flex-shrink-0 hover:shadow-lg transition-all duration-300 select-none group/card relative overflow-hidden"
                            title={person.description}
                        >
                            {/* Hover effect gradient */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dkk-blue to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />

                            <div className="flex flex-col items-center text-center gap-4 mb-4">
                                <div className={`h-32 w-32 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-3xl shadow-md overflow-hidden border-4 border-white ${!person.image ? getRandomColor(person.name) : 'bg-slate-100'}`}>
                                    {person.image ? (
                                        <img src={person.image} alt={person.name} className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        getInitials(person.name)
                                    )}
                                </div>
                                <div className="min-w-0 w-full">
                                    <h3 className="font-bold text-slate-900 truncate text-xl">
                                        {person.name}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide truncate mt-1">
                                        {person.group || "Referens"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
                                    <Briefcase size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-slate-700 font-medium leading-snug line-clamp-2" title={person.title}>
                                        {person.title}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 px-1">
                                    <Mail size={18} className="text-dkk-blue flex-shrink-0" />
                                    <a
                                        href={`mailto:${person.email}`}
                                        className="text-sm font-medium text-slate-600 hover:text-dkk-blue hover:underline truncate transition-colors"
                                        draggable="false" // Prevent link dragging
                                    >
                                        {person.email}
                                    </a>
                                </div>

                                {/* Description snippet */}
                                {person.description && (
                                    <div className="pt-2 border-t border-slate-100 mt-2">
                                        <div className="flex items-start gap-2">
                                            <Info size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                                {person.description}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
