import { Mail, Briefcase } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import type { ReferencePerson } from "../types";

interface ReferenceDetailModalProps {
  person: ReferencePerson | null;
  isOpen: boolean;
  onClose: () => void;
}

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
    "bg-nje-amethyst/15 text-nje-amethyst",
    "bg-nje-jaffa/15 text-nje-jaffa",
    "bg-nje-cyan/15 text-nje-cyan-dark",
    "bg-nje-anthracite/10 text-nje-anthracite",
    "bg-nje-amethyst/10 text-nje-amethyst-light",
    "bg-nje-jaffa/10 text-nje-jaffa-dark",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function ReferenceDetailModal({
  person,
  isOpen,
  onClose,
}: ReferenceDetailModalProps) {
  if (!person) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="overflow-hidden p-0"
      size="4xl"
      hideHeader={true}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Side: Photo & Quick Info */}
        <div className="w-full md:w-2/5 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center text-center transition-colors">
          <div
            className={`h-40 w-40 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-4xl shadow-lg border-4 border-white dark:border-slate-800 mb-6 overflow-hidden transition-colors ${!person.image ? getRandomColor(person.name) : "bg-white dark:bg-slate-800"}`}
          >
            {person.image ? (
              <img
                src={person.image}
                alt={person.name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              getInitials(person.name)
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1 transition-colors">
            {person.name}
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-6 transition-colors">
            {person.group || "Referens"}
          </p>

          <div className="w-full space-y-3 text-left">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
              <div className="flex items-start gap-3">
                <Briefcase
                  size={18}
                  className="text-slate-400 dark:text-slate-500 mt-0.5 transition-colors"
                />
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-snug transition-colors">
                  {person.title}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-nje-anthracite/10 dark:border-slate-700 shadow-sm hover:border-nje-jaffa/30 dark:hover:border-nje-jaffa/30 transition-colors group">
              <div className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="text-nje-jaffa group-hover:scale-110 transition-transform"
                />
                <a
                  href={`mailto:${person.email}`}
                  className="text-sm font-medium text-nje-anthracite/60 dark:text-slate-400 hover:text-nje-jaffa dark:hover:text-nje-jaffa-light truncate transition-colors"
                >
                  {person.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Description */}
        <div className="w-full md:w-3/5 p-8 flex flex-col bg-white dark:bg-slate-900 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-nje-anthracite dark:text-slate-100 border-b-2 border-nje-jaffa/30 dark:border-nje-jaffa/20 pb-1 transition-colors">
              Bemutatkozás
            </h4>
          </div>

          <div className="prose prose-slate prose-sm text-slate-600 dark:text-slate-300 leading-relaxed overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 text-justify transition-colors">
            {person.description ? (
              person.description
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line, idx) => {
                  // Handle bullet points
                  if (
                    line.trim().startsWith("- ") ||
                    line.trim().startsWith("• ")
                  ) {
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-2 mb-2 pl-4"
                      >
                        <span className="text-nje-jaffa mt-1.5 h-1.5 w-1.5 rounded-full bg-current flex-shrink-0 transition-colors" />
                        <span>{line.replace(/^[-•]\s+/, "")}</span>
                      </div>
                    );
                  }
                  // Handle effectively "headers" (lines ending in colon or short bold-like lines)
                  // We'll just make lines ending in ':' bold
                  if (line.trim().endsWith(":")) {
                    return (
                      <p
                        key={idx}
                        className="mb-2 font-bold text-slate-800 dark:text-slate-100 mt-4 transition-colors"
                      >
                        {line}
                      </p>
                    );
                  }
                  // Standard paragraph
                  return (
                    <p key={idx} className="mb-4 last:mb-0">
                      {line}
                    </p>
                  );
                })
            ) : (
              <p className="italic text-slate-400 dark:text-slate-500 transition-colors">
                Nincs elérhető bemutatkozás.
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
