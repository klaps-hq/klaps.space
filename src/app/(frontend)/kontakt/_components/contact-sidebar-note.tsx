import React from "react";

type ContactSidebarNoteProps = {
  text: string;
};

const ContactSidebarNote: React.FC<ContactSidebarNoteProps> = ({ text }) => {
  return <p className="text-sm text-neutral-500 leading-relaxed">{text}</p>;
};

export default ContactSidebarNote;
