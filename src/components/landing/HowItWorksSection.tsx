// src/components/landing/HowItWorksSection.tsx

const steps = [
    {
        title: "1. Jelentkezés",
        description: "A hallgató feltölti a dokumentumait és jelentkezik a számára szimpatikus pozíciókra.",
    },
    {
        title: "2. Céges kiválasztás",
        description: "A céges admin áttekinti a jelentkezéseket, interjút szervez és kiválasztja a megfelelő jelölteket.",
    },
    {
        title: "3. Szerződés és státusz",
        description: "Az egyetem jóváhagyja a duális státuszt, és a rendszer nyomon követi a szerződéses adatokat.",
    },
    {
        title: "4. Naplózás és értékelés",
        description: "A hallgató naplózza a tevékenységét, a mentor jóváhagyja, majd félév végén mindkét fél értékel.",
    },
];

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-10 border-t border-slate-200">
            <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-4">
                Hogyan működik a duális rendszer?
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                {steps.map((step) => (
                    <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <h3 className="font-semibold mb-1">{step.title}</h3>
                        <p className="text-slate-600">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
