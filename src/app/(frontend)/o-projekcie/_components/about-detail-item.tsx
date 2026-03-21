import React from "react";

interface AboutDetailItemProps {
  title: string;
  description: string;
}

const AboutDetailItem: React.FC<AboutDetailItemProps> = ({
  title,
  description,
}) => {
  return (
    <>
      <span className="text-white font-semibold">{title}</span>
      <span className="block text-neutral-500 mt-1">{description}</span>
    </>
  );
};

export default AboutDetailItem;
