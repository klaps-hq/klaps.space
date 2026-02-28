import React from "react";

type HowItWorksStepProps = {
  number: string;
  title: string;
  description: string;
};

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-blood-red text-4xl md:text-5xl font-bold leading-none">
        {number}
      </span>

      <h3 className="text-white text-lg md:text-xl font-bold uppercase tracking-[0.06em]">
        {title}
      </h3>

      <p className="text-neutral-400 text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default HowItWorksStep;
