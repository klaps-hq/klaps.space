import React from "react";

type MovieTrailerProps = {
  videoUrl: string;
};

const MovieTrailer: React.FC<MovieTrailerProps> = ({ videoUrl }) => {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide">
        Zwiastun
      </h2>

      <div className="aspect-video w-full max-w-4xl overflow-hidden border border-white/10 bg-neutral-950">
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-contain"
          preload="metadata"
        >
          <track kind="captions" />
        </video>
      </div>
    </section>
  );
};

export default MovieTrailer;
