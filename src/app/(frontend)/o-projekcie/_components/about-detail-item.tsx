import React from "react";

type AboutDetailItemProps = {
  title: string;
  description: string;
};

const AboutDetailItem: React.FC<AboutDetailItemProps> = ({
  title,
  description,
}) => {
  return (
    <>
      <span className="text-white/80 font-medium">{title}</span>
      <span className="block text-neutral-500 mt-1">{description}</span>
    </>
  );
};

export default AboutDetailItem;
