import { cookies } from "next/headers";
import {
  PREFERRED_CITY_COOKIE,
  PREFERRED_VOIVODESHIP_COOKIE,
} from "./city-storage";
import { isVoivodeship } from "./voivodeships";

interface SearchParamsWithLocation {
  city?: string;
  voivodeship?: string;
}

/** At most one of the two is set - the API treats city > voivodeship anyway. */
export interface PreferredLocation {
  cityId?: string;
  voivodeship?: string;
}

const decodeCookieValue = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/**
 * Resolution order: explicit URL params first (city wins over
 * voivodeship), then the stored preference cookies (same priority).
 * Unknown voivodeship values are dropped so they never reach the API.
 */
export const getPreferredLocation = async (
  searchParams?: SearchParamsWithLocation
): Promise<PreferredLocation> => {
  if (searchParams?.city) {
    return { cityId: searchParams.city };
  }
  if (searchParams?.voivodeship && isVoivodeship(searchParams.voivodeship)) {
    return { voivodeship: searchParams.voivodeship };
  }

  const cookieStore = await cookies();

  const cityCookie = cookieStore.get(PREFERRED_CITY_COOKIE)?.value;
  if (cityCookie) {
    return { cityId: cityCookie };
  }

  const voivodeshipCookie = decodeCookieValue(
    cookieStore.get(PREFERRED_VOIVODESHIP_COOKIE)?.value
  );
  if (voivodeshipCookie && isVoivodeship(voivodeshipCookie)) {
    return { voivodeship: voivodeshipCookie };
  }

  return {};
};
