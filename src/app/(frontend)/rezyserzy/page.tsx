import React from "react";
import { getDirectors } from "@/lib/directors";
import { IDirector } from "@/interfaces/IDirectors";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, { PageHeadingMuted } from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";
import DirectorsBrowser from "./_components/directors-browser";

export const revalidate = 300;

// Directors with the most upcoming screenings lead; those without surface
// further down, ordered by filmography size then name.
const byRelevance = (a: IDirector, b: IDirector): number =>
  b.upcomingScreeningsCount - a.upcomingScreeningsCount ||
  b.moviesCount - a.moviesCount ||
  a.name.localeCompare(b.name, "pl");

const DirectorsPage = async () => {
  const { data: directors } = await getDirectors();
  const sorted = [...directors].sort(byRelevance);

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-6">
        <Breadcrumbs items={[{ name: "Reżyserzy", href: "/rezyserzy" }]} />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
        <PageHeading variant="editorial">
          Reżyserzy.
          <PageHeadingMuted>Twórcy na dużym ekranie.</PageHeadingMuted>
        </PageHeading>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Reżyserzy, których kino wraca na duży ekran w&nbsp;polskich kinach
          studyjnych. Retrospektywy, klasyka filmowa i&nbsp;seanse specjalne.
          Wybierz nazwisko i&nbsp;zobacz filmografię oraz aktualny repertuar.
        </p>
      </div>

      <DirectorsBrowser directors={sorted} />

      <Footer />
    </main>
  );
};

export default DirectorsPage;
