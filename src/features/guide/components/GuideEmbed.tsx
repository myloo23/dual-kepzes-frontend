import type { GuideCourse } from "../types";

interface GuideEmbedProps {
  course: GuideCourse;
}

export function GuideEmbed({ course }: GuideEmbedProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative w-full h-0 pt-[56.25%] shadow-md mt-6 mb-4 overflow-hidden rounded-lg will-change-transform">
        <iframe
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0 p-0 m-0"
          src={course.embedUrl}
          allowFullScreen
          allow="fullscreen"
          title={course.title}
        />
      </div>
      <div className="text-center text-xs text-slate-400 dark:text-slate-500 transition-colors">
        <a
          href={course.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-300 transition-colors hover:underline"
        >
          {course.presentationName}
        </a>{" "}
        by {course.author}
      </div>
    </div>
  );
}
