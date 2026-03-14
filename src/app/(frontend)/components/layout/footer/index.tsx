import React from "react";
import FooterBrand from "./footer-brand";
import FooterNav from "./footer-nav";
import FooterBottom from "./footer-bottom";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-dark-ink px-4 md:px-8 pt-16 pb-10 md:pt-20 md:pb-12">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood-red/60 to-transparent" />

      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          <FooterBrand />
          <FooterNav />
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
