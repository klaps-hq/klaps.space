import React from "react";

const FooterBottom: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-8 border-t border-white/5">
      <p className="text-xs uppercase tracking-[0.2em] text-white/25">
        &copy; {new Date().getFullYear()} Klaps
      </p>
      <p className="text-xs uppercase tracking-[0.2em] text-white/25">
        Z&nbsp;miłości do kina, nie dla&nbsp;zysku.
      </p>
    </div>
  );
};

export default FooterBottom;
