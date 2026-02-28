import React from "react";
import Image from "next/image";

interface MultiCityPosterImageProps {
  posterUrl: string;
  title: string;
}

const MultiCityPosterImage: React.FC<MultiCityPosterImageProps> = ({
  posterUrl,
  title,
}) => {
  return (
    <div className="relative aspect-2/3 w-full max-w-[315px] shrink-0">
      <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-blood-red z-10 pointer-events-none" />
      <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-blood-red z-10 pointer-events-none" />

      <Image
        src={posterUrl}
        alt={`Plakat filmu ${title}`}
        fill
        className="object-cover"
        sizes="(max-width: 1100px) 0vw, 35vw"
      />
    </div>
  );
};

export default MultiCityPosterImage;
