import React from "react";

interface SectionHeaderProps {
  prefix?: string;
  title: string;
  description?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  prefix,
  title,
  description,
}) => {
  return (
    <h2 className="flex flex-col gap-1 max-w-fit">
      <span className="text-blood-red text-sm uppercase tracking-widest">
        {prefix}
      </span>

      <span className="text-white text-4xl md:text-6xl font-bold uppercase">
        {title}
      </span>

      {description && (
        <p className="text-neutral-400 text-base md:text-lg max-w-xl leading-relaxed">
          {description}
        </p>
      )}
    </h2>
  );
};

export default SectionHeader;
