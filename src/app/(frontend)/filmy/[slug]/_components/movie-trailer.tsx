import React from "react";
import { getYouTubeEmbedUrl } from "@/lib/utils";

interface MovieTrailerProps {
  videoUrl: string;
}

const MovieTrailer: React.FC<MovieTrailerProps> = ({ videoUrl }) => {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  if (!embedUrl) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide">
        Zwiastun
      </h2>

      <div className="aspect-video w-full overflow-hidden border border-white/10 bg-neutral-950">
        <iframe
          src={embedUrl}
          title="Zwiastun filmu"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </section>
  );
};

export default MovieTrailer;
