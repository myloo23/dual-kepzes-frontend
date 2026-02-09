interface GuideFormEmbedProps {
  title?: string;
}

export function GuideFormEmbed({ title = "Kérdőív" }: GuideFormEmbedProps) {
  // Using the new short link provided by the user
  const formUrl = "https://forms.office.com/r/XPdAwffgB3";

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-900">
            Visszajelzés és Kérdőív
          </h3>
        </div>
        <div className="relative w-full h-0 pt-[120%] md:pt-[80%] lg:pt-[60%]">
          <iframe
            src={formUrl}
            title={title}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
          />
        </div>
        <div className="p-2 text-center bg-slate-50 text-xs text-slate-500 border-t border-slate-200">
          Ha nem jelenik meg a kérdőív,{" "}
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            kattints ide a megnyitáshoz
          </a>
          .
        </div>
      </div>
    </div>
  );
}
