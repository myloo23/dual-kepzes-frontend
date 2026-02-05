import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type CompanyRegisterPayload, type Location } from '@/lib/api';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button';
import { ArrowRight, Building2, User, MapPin } from 'lucide-react';
import { cn } from '@/utils/cn';

const INITIAL_LOCATION: Location = {
    country: "Magyarország",
    zipCode: "",
    city: "",
    address: ""
};

export const CompanyRegistrationForm = () => {
    const navigate = useNavigate();
    const { showError, showSuccess } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1); // 1: User Info, 2: Company Info

    // Form State
    const [formData, setFormData] = useState<CompanyRegisterPayload>({
        admin: {
            email: '',
            password: '',
            fullName: '',
            phoneNumber: '',
            jobTitle: ''
        },
        company: {
            name: '',
            taxId: '',
            locations: [INITIAL_LOCATION],
            contactName: '',
            contactEmail: '',
            description: '',
            website: '',
            hasOwnApplication: false,
        }
    });

    const [gdprAccepted, setGdprAccepted] = useState(false);

    const updateAdmin = (field: keyof typeof formData.admin, value: string) => {
        setFormData((prev: CompanyRegisterPayload) => ({
            ...prev,
            admin: { ...prev.admin, [field]: value }
        }));
    };

    const updateCompany = (field: keyof typeof formData.company, value: any) => {
        setFormData((prev: CompanyRegisterPayload) => ({
            ...prev,
            company: { ...prev.company, [field]: value }
        }));
    };

    const updateLocation = (index: number, field: keyof Location, value: string | number) => {
        setFormData((prev: CompanyRegisterPayload) => {
            const newLocations = [...prev.company.locations];
            newLocations[index] = { ...newLocations[index], [field]: value };
            return {
                ...prev,
                company: { ...prev.company, locations: newLocations }
            };
        });
    };

    const addLocation = () => {
        setFormData((prev: CompanyRegisterPayload) => ({
            ...prev,
            company: {
                ...prev.company,
                locations: [...prev.company.locations, { ...INITIAL_LOCATION }]
            }
        }));
    };

    const removeLocation = (index: number) => {
        if (formData.company.locations.length <= 1) return;
        setFormData((prev: CompanyRegisterPayload) => ({
            ...prev,
            company: {
                ...prev.company,
                locations: prev.company.locations.filter((_: Location, i: number) => i !== index)
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!gdprAccepted) {
            showError("A regisztrációhoz el kell fogadni az Adatkezelési Tájékoztatót.");
            return;
        }

        setIsLoading(true);

        try {
            await api.registerCompany(formData);
            
            showSuccess("Sikeres regisztráció! Hamarosan felvesszük Önökkel a kapcsolatot.");
            
            navigate('/');
        } catch (error: any) {
            console.error('Registration error:', error);
            const msg = error.data?.message || error.message || "Hiba történt a regisztráció során.";
            showError(`Regisztráció sikertelen: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 w-full max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Céges Partner Regisztráció
                </h1>
                <p className="text-slate-500">
                    Csatlakozzon duális képzési rendszerünkhöz vállalati partnerként
                </p>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center justify-center mb-8">
                <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    step === 1 ? "bg-blue-100 text-blue-700" : "text-slate-500"
                )}>
                    <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                         step === 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                    )}>1</div>
                    Adminisztrátor adatok
                </div>
                <div className="w-12 h-px bg-slate-200 mx-2" />
                <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    step === 2 ? "bg-blue-100 text-blue-700" : "text-slate-500"
                )}>
                     <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                         step === 2 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                    )}>2</div>
                    Cégadatok
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* STEP 1: ADMIN USER INFO */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Teljes név *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                    <input
                                        required
                                        type="text"
                                        value={formData.admin.fullName}
                                        onChange={e => updateAdmin('fullName', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                        placeholder="Az adminisztrátor neve"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Telefonszám *</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.admin.phoneNumber}
                                    onChange={e => updateAdmin('phoneNumber', e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                    placeholder="+36 30 123 4567"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email cím *</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.admin.email}
                                    onChange={e => {
                                        updateAdmin('email', e.target.value);
                                        // Auto-fill company contact email if empty
                                        if(!formData.company.contactEmail) {
                                            updateCompany('contactEmail', e.target.value);
                                        }
                                    }}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                    placeholder="admin@ceg.hu"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Jelszó *</label>
                                <input
                                    required
                                    type="password"
                                    value={formData.admin.password}
                                    onChange={e => updateAdmin('password', e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                    placeholder="Legalább 8 karakter"
                                />
                            </div>

                             <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Munkakör / Pozíció *</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.admin.jobTitle}
                                    onChange={e => updateAdmin('jobTitle', e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                    placeholder="pl. HR Igazgató"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button 
                                type="button" 
                                onClick={() => {
                                    const { fullName, email, password, jobTitle } = formData.admin;
                                    if(fullName && email && password && jobTitle) {
                                        setStep(2);
                                    } else {
                                        showError("Kérjük töltsön ki minden kötelező mezőt!");
                                    }
                                }}
                                className="group"
                            >
                                Tovább a cégadatokhoz
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: COMPANY INFO */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                         <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Cég neve *</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                        <input
                                            required
                                            value={formData.company.name}
                                            onChange={e => updateCompany('name', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Hivatalos cégnév"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Adószám *</label>
                                    <input
                                        required
                                        value={formData.company.taxId}
                                        onChange={e => updateCompany('taxId', e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="xxxxxxxx-x-xx"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Weboldal</label>
                                    <input
                                        type="url"
                                        value={formData.company.website || ''}
                                        onChange={e => updateCompany('website', e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Kapcsolattartó Név *</label>
                                    <input
                                        required
                                        value={formData.company.contactName}
                                        onChange={e => updateCompany('contactName', e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                         </div>

                        {/* Locations */}
                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Telephelyek címek
                                </h3>
                                <button type="button" onClick={addLocation} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                                    + További cím hozzáadása
                                </button>
                            </div>

                            {formData.company.locations.map((loc: Location, index: number) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2 first:pt-0 relative">
                                    {formData.company.locations.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeLocation(index)}
                                            className="absolute top-0 right-0 text-slate-400 hover:text-red-500 text-xs"
                                        >
                                            Törlés
                                        </button>
                                    )}
                                    <div className="md:col-span-1">
                                        <input
                                            required
                                            value={loc.zipCode}
                                            onChange={e => updateLocation(index, 'zipCode', e.target.value)}
                                            placeholder="Ir.szám"
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <input
                                            required
                                            value={loc.city}
                                            onChange={e => updateLocation(index, 'city', e.target.value)}
                                            placeholder="Város"
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <input
                                            required
                                            value={loc.address}
                                            onChange={e => updateLocation(index, 'address', e.target.value)}
                                            placeholder="Utca, házszám"
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        required
                                        checked={gdprAccepted}
                                        onChange={e => setGdprAccepted(e.target.checked)}
                                        className="peer h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                </div>
                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                    Kijelentem, hogy elolvastam és elfogadom az <a href="#" className="text-blue-600 hover:underline">Adatkezelési Tájékoztatót</a>, valamint hozzájárulok a megadott adatok kezeléséhez.
                                </span>
                            </label>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" type="button" onClick={() => setStep(1)}>
                                Vissza
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                variant="primary"
                            >
                                {isLoading ? "Regisztráció..." : "Regisztráció beküldése"}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};
