import React from "react";
import Image from "next/image";

const FooterBottom: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 pt-8 border-t border-white/5">
      <div className="flex items-center gap-3">
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 opacity-40 transition-opacity hover:opacity-60"
        >
          <Image
            src="/tmdb-logo.svg"
            alt="TMDB"
            width={100}
            height={13}
          />
        </a>
        <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">
          Dane filmowe dostarcza{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/35 hover:text-white/50 transition-colors"
          >
            TMDB
          </a>
          . Serwis nie jest powiązany z&nbsp;TMDB.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-white/25">
          &copy; {new Date().getFullYear()} Klaps
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-white/25">
          Z&nbsp;miłości do kina, nie dla&nbsp;zysku.
        </p>
      </div>
    </div>
  );
};

export default FooterBottom;
