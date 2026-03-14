import React from "react";

type ContactInfoItemProps = {
  label: string;
  value: string;
  href?: string;
};

const ContactInfoItem: React.FC<ContactInfoItemProps> = ({
  label,
  value,
  href,
}) => {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-neutral-800 last:border-b-0">
      <span className="text-sm uppercase tracking-[0.12em] text-neutral-500">
        {label}
      </span>
      {href ? (
        <a
          href={href}
          className="text-white/80 text-lg md:text-xl font-medium hover:text-blood-red transition-colors duration-300"
        >
          {value}
        </a>
      ) : (
        <span className="text-white/80 text-lg md:text-xl font-medium">
          {value}
        </span>
      )}
    </div>
  );
};

export default ContactInfoItem;
