import React from "react";

type ContactSidebarItemProps = {
  label: string;
  children: React.ReactNode;
};

const ContactSidebarItem: React.FC<ContactSidebarItemProps> = ({
  label,
  children,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs uppercase font-semibold tracking-[0.3em] text-blood-red">
        {label}
      </span>
      {children}
    </div>
  );
};

export default ContactSidebarItem;
