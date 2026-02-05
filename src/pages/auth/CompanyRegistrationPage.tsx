import { CompanyRegistrationForm } from '@/features/auth/components/CompanyRegistrationForm';

export const CompanyRegistrationPage = () => {
    return (
        <div className="min-h-screen relative flex flex-col bg-slate-50">
            {/* Simple gradient background instead of missing animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-0" />
            
            <main className="flex-1 container mx-auto px-4 py-20 flex items-center justify-center relative z-10">
                <CompanyRegistrationForm />
            </main>

            <footer className="text-center py-6 text-slate-400 text-sm relative z-10">
                &copy; {new Date().getFullYear()} Duális Képzési Rendszer
            </footer>
        </div>
    );
};

export default CompanyRegistrationPage;
