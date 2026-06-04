import React from "react";
import { getYouTubeEmbedUrl } from "@/lib/utils";
import MovieSectionHeading from "./movie-section-heading";

interface MovieTrailerProps {
  videoUrl: string;
}

const MovieTrailer: React.FC<MovieTrailerProps> = ({ videoUrl }) => {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  if (!embedUrl) return null;

  return (
    <section className="relative bg-black text-white border-t border-white/10">
      <MovieSectionHeading eyebrow="Materiały" title="Zwiastun" />

      <div className="px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-24 border-t border-white/10">
        <div className="aspect-video w-full max-w-5xl overflow-hidden bg-black/40">
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
