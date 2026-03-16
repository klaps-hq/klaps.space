import { getCinemasWithCoordinates } from "@/lib/cinemas";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import CinemaMapLazy from "./_components/cinema-map-lazy";

export const revalidate = 300;

const CinemaMapPage = async () => {
  const cinemas = await getCinemasWithCoordinates();

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={[{ name: "Mapa kin", href: "/mapa-kin" }]} />
          <SectionHeader
            prefix="Mapa"
            title="Kina studyjne"
            description="Interaktywna mapa kin studyjnych i niezaleznych w calej Polsce."
          />
        </div>

        <CinemaMapLazy cinemas={cinemas} />
      </div>
    </main>
  );
};

export default CinemaMapPage;
