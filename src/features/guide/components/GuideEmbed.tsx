
interface GuideEmbedProps {
  title?: string;
}

export function GuideEmbed({ title = "Tananyag" }: GuideEmbedProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        className="relative w-full h-0 pt-[56.25%] shadow-md mt-6 mb-4 overflow-hidden rounded-lg will-change-transform"
      >
        <iframe 
          loading="lazy" 
          className="absolute inset-0 w-full h-full border-0 p-0 m-0"
          src="https://www.canva.com/design/DAHAWIQXn10/A7w23ousYwiKKpHynOUPmQ/view?embed" 
          allowFullScreen 
          allow="fullscreen"
          title={title}
        />
      </div>
      <div className="text-center text-xs text-slate-400">
        <a 
          href="https://www.canva.com/design/DAHAWIQXn10/A7w23ousYwiKKpHynOUPmQ/view?utm_content=DAHAWIQXn10&utm_campaign=designshare&utm_medium=embeds&utm_source=link" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Green Yellow Pink Creative Employee Training Presentation
        </a> by Betty B
      </div>
    </div>
  );
}
