import { getPaginatedScreenings } from "@/lib/screenings";
import { getGenres } from "@/lib/genres";
import { getPreferredCityId } from "@/lib/get-preferred-city";
import ScreeningsPageInner from "./screenings-page-inner";

interface ScreeningsPageContentProps {
  searchParams: {
    city?: string;
    genre?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    page?: string;
  };
}

const ScreeningsPageContent = async ({
  searchParams,
}: ScreeningsPageContentProps) => {
  const currentPage = searchParams.page ? Number(searchParams.page) : 1;
  const cityId = await getPreferredCityId(searchParams);

  const [screeningsResponse, genres] = await Promise.all([
    getPaginatedScreenings({
      cityId,
      genreId: searchParams.genre,
      dateFrom: searchParams.dateFrom,
      dateTo: searchParams.dateTo,
      search: searchParams.search,
      page: currentPage,
      limit: 24,
    }),
    getGenres(),
  ]);

  const isPaginated = !Array.isArray(screeningsResponse);
  const screenings = isPaginated ? screeningsResponse.data : screeningsResponse;
  const page = isPaginated ? screeningsResponse.meta.page : 1;
  const totalPages = isPaginated ? screeningsResponse.meta.totalPages : 1;

  console.log(screeningsResponse);

  return (
    <ScreeningsPageInner
      screenings={screenings || []}
      genres={genres}
      currentPage={page}
      totalPages={totalPages}
    />
  );
};

export default ScreeningsPageContent;
