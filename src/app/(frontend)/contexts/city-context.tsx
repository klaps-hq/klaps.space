"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ICityOption } from "@/interfaces/ICities";
import {
  PREFERRED_CITY_KEY,
  PREFERRED_VOIVODESHIP_KEY,
  setPreferredCityCookie,
  setPreferredVoivodeshipCookie,
} from "@/lib/city-storage";
import { formatVoivodeship, isVoivodeship } from "@/lib/voivodeships";

export type CityOption = { value: number | null; label: string };

const ALL_CITIES_OPTION: CityOption = {
  value: null,
  label: "Wszystkie miasta",
};

const ALL_CITIES_LABEL = ALL_CITIES_OPTION.label;

/** Exactly one of the two is set; both null means "no filter". */
interface LocationState {
  cityId: number | null;
  voivodeship: string | null;
}

const EMPTY_LOCATION: LocationState = { cityId: null, voivodeship: null };

interface SetLocationOptions {
  /** When false, skips the URL update and refresh - the caller owns navigation. */
  navigate?: boolean;
}

interface CityContextValue {
  cityId: number | null;
  voivodeship: string | null;
  /** Display label of the active filter: city name, voivodeship or "Wszystkie miasta". */
  locationLabel: string;
  isHydrated: boolean;
  setCityId: (cityId: number | null, options?: SetLocationOptions) => void;
  setVoivodeship: (
    voivodeship: string | null,
    options?: SetLocationOptions
  ) => void;
  options: CityOption[];
  cities: ICityOption[];
}

const CityContext = createContext<CityContextValue | null>(null);

export const usePreferredCity = (): CityContextValue => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("usePreferredCity must be used within CityProvider");
  }
  return context;
};

interface CityProviderProps {
  children: ReactNode;
  cities: ICityOption[];
}

const HYDRATION_SUBSCRIBE = () => () => {};

const resolveInitialLocation = (
  cities: ICityOption[],
  pathname: string
): LocationState => {
  if (typeof window === "undefined") {
    return EMPTY_LOCATION;
  }

  // Movie pages accept ?city= from shared screening links so the
  // recipient lands on the city the sharer was looking at.
  if (
    pathname === "/" ||
    pathname === "/seanse" ||
    pathname.startsWith("/filmy/")
  ) {
    const params = new URLSearchParams(window.location.search);
    const urlCity = params.get("city");
    if (urlCity) {
      const parsed = Number(urlCity);
      if (cities.some((city) => city.id === parsed)) {
        return { cityId: parsed, voivodeship: null };
      }
    }
    const urlVoivodeship = params.get("voivodeship");
    if (urlVoivodeship && isVoivodeship(urlVoivodeship)) {
      return { cityId: null, voivodeship: urlVoivodeship };
    }
  }

  const storedCity = localStorage.getItem(PREFERRED_CITY_KEY);
  if (storedCity) {
    const parsed = Number(storedCity);
    if (cities.some((city) => city.id === parsed)) {
      return { cityId: parsed, voivodeship: null };
    }
  }

  const storedVoivodeship = localStorage.getItem(PREFERRED_VOIVODESHIP_KEY);
  if (storedVoivodeship && isVoivodeship(storedVoivodeship)) {
    return { cityId: null, voivodeship: storedVoivodeship };
  }

  return EMPTY_LOCATION;
};

const persistLocation = (location: LocationState): void => {
  localStorage.setItem(
    PREFERRED_CITY_KEY,
    location.cityId !== null ? String(location.cityId) : ""
  );
  localStorage.setItem(
    PREFERRED_VOIVODESHIP_KEY,
    location.voivodeship ?? ""
  );
  setPreferredCityCookie(location.cityId);
  setPreferredVoivodeshipCookie(location.voivodeship);
};

export const CityProvider = ({ children, cities }: CityProviderProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const options = useMemo<CityOption[]>(
    () => [ALL_CITIES_OPTION, ...cities.map((c) => ({ value: c.id, label: c.name }))],
    [cities]
  );

  const [location, setLocationState] = useState<LocationState>(() =>
    resolveInitialLocation(cities, pathname)
  );
  const isHydrated = useSyncExternalStore(
    HYDRATION_SUBSCRIBE,
    () => true,
    () => false
  );

  // Persist the initial URL-derived selection (deep links); an empty
  // initial state must not wipe a preference stored by another tab.
  useEffect(() => {
    if (location.cityId === null && location.voivodeship === null) {
      return;
    }
    persistLocation(location);
  }, [location]);

  const locationLabel = useMemo(() => {
    if (location.cityId !== null) {
      return (
        cities.find((c) => c.id === location.cityId)?.name ?? ALL_CITIES_LABEL
      );
    }
    if (location.voivodeship !== null) {
      return formatVoivodeship(location.voivodeship);
    }
    return ALL_CITIES_LABEL;
  }, [location, cities]);

  const setLocation = useCallback(
    (newLocation: LocationState, options?: SetLocationOptions) => {
      setLocationState(newLocation);
      persistLocation(newLocation);

      if (options?.navigate === false) {
        return;
      }

      if (pathname === "/" || pathname === "/seanse") {
        const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
        if (newLocation.cityId !== null) {
          params.set("city", String(newLocation.cityId));
        } else {
          params.delete("city");
        }
        if (newLocation.voivodeship !== null) {
          params.set("voivodeship", newLocation.voivodeship);
        } else {
          params.delete("voivodeship");
        }
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(newUrl, { scroll: false });
      }

      router.refresh();
    },
    [pathname, router]
  );

  const setCityId = useCallback(
    (cityId: number | null, options?: SetLocationOptions) => {
      setLocation({ cityId, voivodeship: null }, options);
    },
    [setLocation]
  );

  const setVoivodeship = useCallback(
    (voivodeship: string | null, options?: SetLocationOptions) => {
      setLocation({ cityId: null, voivodeship }, options);
    },
    [setLocation]
  );

  const value = useMemo(
    () => ({
      cityId: location.cityId,
      voivodeship: location.voivodeship,
      locationLabel,
      isHydrated,
      setCityId,
      setVoivodeship,
      options,
      cities,
    }),
    [
      location,
      locationLabel,
      isHydrated,
      setCityId,
      setVoivodeship,
      options,
      cities,
    ]
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};
