export const PREFERRED_CITY_KEY = "preferred_city";
export const PREFERRED_CITY_COOKIE = "preferred_city";

const COOKIE_MAX_AGE = 31536000; // 1 year in seconds

export const setPreferredCityCookie = (cityId: number | null): void => {
  if (typeof document === "undefined") return;

  if (cityId === null) {
    document.cookie = `${PREFERRED_CITY_COOKIE}=; path=/; max-age=0`;
    return;
  }

  document.cookie = `${PREFERRED_CITY_COOKIE}=${cityId}; path=/; max-age=${COOKIE_MAX_AGE}`;
};
