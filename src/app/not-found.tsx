import { Metadata } from "next";
import NotFoundHero from "./_components/not-found/not-found-hero";

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
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <NotFoundHero />
      </div>
    </main>
  );
};

export default NotFoundPage;
