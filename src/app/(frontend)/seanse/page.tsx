import { Suspense } from "react";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import ScreeningsPageContent from "./_components/screenings-page-content";
import ScreeningsPageLoader from "./_components/screenings-page-loader";

export const revalidate = 300;

type SearchParams = {
  city?: string;
  genre?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: string;
};

interface ScreeningsPageProps {
  searchParams: Promise<SearchParams>;
}

const ScreeningsPage = async ({ searchParams }: ScreeningsPageProps) => {
  const params = await searchParams;

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={[{ name: "Seanse", href: "/seanse" }]} />
          <SectionHeader
            prefix="Repertuar"
            title="Seanse"
          description="Pełna lista seansów specjalnych i klasyki filmowej w kinach studyjnych w całej Polsce."
          />
        </div>

        <Suspense fallback={<ScreeningsPageLoader />}>
          <ScreeningsPageContent searchParams={params} />
        </Suspense>
      </div>
    </main>
  );
};

export default ScreeningsPage;
