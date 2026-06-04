import { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/common/site-header";
import Footer from "@/app/(home)/_components/footer";

export const metadata: Metadata = {
  title: "404 - Nie znaleziono",
  description:
    "Strona, której szukasz, nie istnieje. Wróć do repertuaru kin studyjnych.",
  robots: {
    index: false,
    follow: false,
  },
};

const NotFoundPage = () => {
  return (
    <main className="bg-black text-white min-h-screen flex flex-col">
      <SiteHeader />

      <section className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <h1 className="text-[clamp(7rem,30vw,22rem)] font-medium uppercase -tracking-[0.04em] leading-[0.85] text-white">
          404
        </h1>

        <p className="mt-8 md:mt-12 max-w-[48ch] text-lg md:text-2xl lg:text-3xl text-white/75 leading-[1.4] -tracking-[0.005em]">
          Ten klaps poszedł w&nbsp;próżnię. Strona, której szukasz, nie
          istnieje lub została przeniesiona.
        </p>

        <div className="mt-10 md:mt-14 flex flex-wrap items-center gap-x-10 gap-y-5">
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

      <Footer />
    </main>
  );
};

export default NotFoundPage;
