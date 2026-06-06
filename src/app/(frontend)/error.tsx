"use client";

import React from "react";
import Link from "next/link";
import SiteHeader from "@/components/common/site-header";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ reset }) => {
  return (
    <main className="bg-black text-white min-h-screen flex flex-col">
      <SiteHeader />

      <section className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <h1 className="text-[clamp(7rem,30vw,22rem)] font-medium uppercase -tracking-[0.04em] leading-[0.85] text-white">
          500
        </h1>

        <p className="mt-8 md:mt-12 max-w-[48ch] text-lg md:text-2xl lg:text-3xl text-white/75 leading-[1.4] -tracking-[0.005em]">
          Coś poszło nie tak po naszej stronie. Spróbuj ponownie za chwilę
          albo wróć do repertuaru.
        </p>

        <div className="mt-10 md:mt-14 flex flex-wrap items-center gap-x-8 gap-y-5">
          <button
            type="button"
            onClick={reset}
            className="group inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
          >
            Spróbuj ponownie
            <span
              aria-hidden="true"
              className="transition-transform group-hover:rotate-90 duration-300"
            >
              ↻
            </span>
          </button>
          <Link
            href="/"
            className="text-base uppercase text-white border-b border-white/50 pb-0.5 hover:border-white transition-colors"
          >
            Strona główna
          </Link>
          <Link
            href="/seanse"
            className="text-base uppercase text-white border-b border-white/50 pb-0.5 hover:border-white transition-colors"
          >
            Zobacz seanse
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
