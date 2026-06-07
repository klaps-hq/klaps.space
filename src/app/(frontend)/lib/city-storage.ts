export const PREFERRED_CITY_KEY = "preferred_city";
export const PREFERRED_CITY_COOKIE = "preferred_city";
export const PREFERRED_VOIVODESHIP_KEY = "preferred_voivodeship";
export const PREFERRED_VOIVODESHIP_COOKIE = "preferred_voivodeship";

const COOKIE_MAX_AGE = 31536000; // 1 year in seconds

const setCookie = (name: string, value: string | null): void => {
  if (typeof document === "undefined") return;

  if (value === null) {
    document.cookie = `${name}=; path=/; max-age=0`;
    return;
  }

  // Voivodeship names carry Polish diacritics - keep cookie values ASCII.
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}`;
};

export const setPreferredCityCookie = (cityId: number | null): void => {
  setCookie(PREFERRED_CITY_COOKIE, cityId === null ? null : String(cityId));
};

export const setPreferredVoivodeshipCookie = (
  voivodeship: string | null
): void => {
  setCookie(PREFERRED_VOIVODESHIP_COOKIE, voivodeship);
};
