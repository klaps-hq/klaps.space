import React from "react";

interface MovieSectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

const MovieSectionHeading: React.FC<MovieSectionHeadingProps> = ({
  eyebrow,
  title,
  description,
}) => (
  <div className="px-6 md:px-12 lg:px-16 pt-16 md:pt-24 pb-10 md:pb-12">
    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
      {eyebrow}
    </p>
    <h2 className="mt-3 md:mt-4 text-3xl md:text-4xl lg:text-5xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white">
      {title}
    </h2>
    {description && (
      <p className="mt-5 md:mt-6 max-w-[60ch] text-base md:text-lg text-white/55 leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

export default MovieSectionHeading;
