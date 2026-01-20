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
            <section id="materials" className="py-16">
                <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-3 text-center">
                    Információs anyagok
                </h2>
                <p className="text-sm text-slate-600 max-w-xl mb-8 text-center mx-auto">
                    Tudj meg többet a duális képzési programról!
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    {materials.map((material) => (
                        <button
                            key={material.id}
                            onClick={() => setSelectedMaterial(material)}
                            className="group relative rounded-lg border border-dkk-gray/30 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 text-left w-40 sm:w-48"
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
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="p-2 text-white text-center">
                                    <p className="text-xs font-semibold">Megtekintés</p>
                                </div>
                            </div>

                            {/* Card footer */}
                            <div className="p-2 border-t border-dkk-gray/20">
                                <h3 className="text-xs font-semibold text-slate-900 group-hover:text-dkk-blue transition-colors truncate">
                                    {material.title}
                                </h3>
                                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{material.description}</p>
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
