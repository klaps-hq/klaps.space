import React from "react";

type MovieDetailsItemProps = {
  label: string;
  value: string;
};

const MovieDetailsItem: React.FC<MovieDetailsItemProps> = ({
  label,
  value,
}) => {
  return (
    <div className="flex flex-col gap-1 border-l-4 border-l-blood-red pl-4">
      <dt className="text-neutral-500 text-sm uppercase tracking-widest">
        {label}
      </dt>
      <dd className="text-white text-base md:text-lg leading-relaxed break-words">
        {value}
      </dd>
    </div>
  );
};

export default MovieDetailsItem;
