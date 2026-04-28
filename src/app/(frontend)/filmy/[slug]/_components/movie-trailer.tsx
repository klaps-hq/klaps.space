import React from "react";
import { getYouTubeEmbedUrl } from "@/lib/utils";

interface MovieTrailerProps {
  videoUrl: string;
}

const MovieTrailer: React.FC<MovieTrailerProps> = ({ videoUrl }) => {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  if (!embedUrl) return null;

  return (
    <section className="relative bg-black text-white border-t border-white/10">
      <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="mb-8 flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
          <span className="h-px w-12 bg-white/30" aria-hidden="true" />
          <span>Materiały</span>
        </div>
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase leading-[0.9] -tracking-[0.03em] text-white">
          Zwiastun
        </h2>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-24 border-t border-white/10">
        <div className="aspect-video w-full max-w-5xl overflow-hidden border border-white/10 bg-black/40">
          <iframe
            src={embedUrl}
            title="Zwiastun filmu"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default MovieTrailer;
