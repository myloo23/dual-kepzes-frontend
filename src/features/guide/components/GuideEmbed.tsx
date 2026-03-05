interface GuideEmbedProps {
  title?: string;
}

export function GuideEmbed({ title = "Tananyag" }: GuideEmbedProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative w-full h-0 pt-[56.25%] shadow-md mt-6 mb-4 overflow-hidden rounded-lg will-change-transform">
        <iframe
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0 p-0 m-0"
          src="https://www.canva.com/design/DAHBAAK86Kc/9vTO1exI26OpupqJ7es-Mg/view?embed"
          allowFullScreen
          allow="fullscreen"
          title={title}
        />
      </div>
      <div className="text-center text-xs text-slate-400 dark:text-slate-500 transition-colors">
        <a
          href="https://www.canva.com/design/DAHBAAK86Kc/9vTO1exI26OpupqJ7es-Mg/view?utm_content=DAHBAAK86Kc&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-300 transition-colors hover:underline"
        >
          Green Yellow Pink Creative Employee Training Presentation
        </a>{" "}
        by Bettina B
      </div>
    </div>
  );
}
