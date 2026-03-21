import React from "react";

interface ContentSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  id,
  title,
  children,
}) => {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex items-center gap-4 mb-8 md:mb-10">
        <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-tight leading-tight">
          {title}
        </h2>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <div className="flex flex-col gap-5 text-neutral-400 text-base md:text-lg leading-[1.8] tracking-[0.01em]">
        {children}
      </div>
    </section>
  );
};

export default ContentSection;
