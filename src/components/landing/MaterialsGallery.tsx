// src/components/landing/MaterialsGallery.tsx
import { useState } from "react";
import ImageModal from "../shared/ImageModal";
import rollupImage from "../../assets/logos/dkk_logos/DKK roll-up_2024.png";
import flyer1Image from "../../assets/logos/dkk_logos/Flyer front_1.png";
import flyer2Image from "../../assets/logos/dkk_logos/Flyer front_2.png";

type Material = {
    id: string;
    title: string;
    description: string;
    image: string;
};

const materials: Material[] = [
    {
        id: "rollup",
        title: "Duális Képzési Központ Roll-up",
        description: "Bemutatkozó roll-up banner",
        image: rollupImage,
    },
    {
        id: "flyer1",
        title: "Duplázd az Esélyeid",
        description: "Információs szórólap - Ballagás",
        image: flyer1Image,
    },
    {
        id: "flyer2",
        title: "Duplázd az Esélyeid",
        description: "Információs szórólap - Hallgató",
        image: flyer2Image,
    },
];

export default function MaterialsGallery() {
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

    return (
        <>
            <section id="materials" className="py-10 border-t border-dkk-gray/30">
                <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-3">
                    Információs anyagok
                </h2>
                <p className="text-sm text-slate-600 max-w-xl mb-6">
                    Tudj meg többet a duális képzési programról! Kattints az anyagokra a nagyobb méretű megtekintéshez.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {materials.map((material) => (
                        <button
                            key={material.id}
                            onClick={() => setSelectedMaterial(material)}
                            className="group relative rounded-xl border border-dkk-gray/30 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 text-left"
                        >
                            {/* Image preview */}
                            <div className="aspect-[3/4] overflow-hidden bg-slate-50">
                                <img
                                    src={material.image}
                                    alt={material.title}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                <div className="p-4 text-white">
                                    <p className="text-xs font-medium mb-1">{material.description}</p>
                                    <p className="text-sm">Kattints a megtekintéshez →</p>
                                </div>
                            </div>

                            {/* Card footer */}
                            <div className="p-3 border-t border-dkk-gray/20">
                                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-dkk-blue transition-colors">
                                    {material.title}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">{material.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Modal */}
            <ImageModal
                isOpen={selectedMaterial !== null}
                onClose={() => setSelectedMaterial(null)}
                imageSrc={selectedMaterial?.image || ""}
                imageAlt={selectedMaterial?.title || ""}
                title={selectedMaterial?.title}
            />
        </>
    );
}
