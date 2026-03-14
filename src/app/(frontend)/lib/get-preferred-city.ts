import { cookies } from "next/headers";
import { PREFERRED_CITY_COOKIE } from "./city-storage";

interface SearchParamsWithCity {
  city?: string;
}

export const getPreferredCityId = async (
  searchParams?: SearchParamsWithCity
): Promise<string | undefined> => {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(PREFERRED_CITY_COOKIE)?.value;
  return searchParams?.city ?? cookieValue ?? undefined;
};
