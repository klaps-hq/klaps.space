import React from "react";

type FaqItemProps = {
  question: string;
  children: React.ReactNode;
};

const FaqItem: React.FC<FaqItemProps> = ({ question, children }) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-white/80 font-medium text-base md:text-lg leading-snug">
        {question}
      </h3>

      <div className="text-neutral-400 text-base md:text-lg leading-[1.8] tracking-[0.01em]">
        {children}
      </div>
    </div>
  );
};

export default FaqItem;
