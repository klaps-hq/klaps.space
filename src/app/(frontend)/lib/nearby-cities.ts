import { ICity } from "@/interfaces/ICities";
import { getCinemas, isWithinPoland } from "./cinemas";

const EARTH_RADIUS_KM = 6371;
const DEFAULT_LIMIT = 6;

export interface NearbyCity {
  slug: string;
  name: string;
  /** Rounded great-circle distance between the cities' cinema centroids. */
  distanceKm: number;
}

interface Point {
  lat: number;
  lng: number;
}

const toRad = (deg: number): number => (deg * Math.PI) / 180;

const haversineKm = (a: Point, b: Point): number => {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

/**
 * Nearest other cities with an indexable page, by the distance between the
 * centroids of each city's cinemas. One call: the nationwide cinema list
 * (the same cached URL as /mapa-kin) carries the coordinates and city of
 * every venue, so no per-city or per-cinema requests are needed.
 *
 * `indexableCities` is the sitemap's city set (getIndexableSlugs); null
 * means that lookup failed and, as on the hubs, every city is linked.
 */
export const getNearbyCities = async (
  cityId: number,
  indexableCities: ReadonlySet<string> | null,
  limit: number = DEFAULT_LIMIT
): Promise<NearbyCity[]> => {
  const { data: groups } = await getCinemas({ limit: 1000 });

  const centroids = new Map<number, { city: ICity; point: Point }>();
  for (const { city, cinemas } of groups) {
    const points: Point[] = cinemas.flatMap((c) =>
      c.latitude != null &&
      c.longitude != null &&
      isWithinPoland(c.latitude, c.longitude)
        ? [{ lat: c.latitude, lng: c.longitude }]
        : []
    );
    if (points.length === 0) continue;
    centroids.set(city.id, {
      city,
      point: {
        lat: points.reduce((sum, p) => sum + p.lat, 0) / points.length,
        lng: points.reduce((sum, p) => sum + p.lng, 0) / points.length,
      },
    });
  }

  const origin = centroids.get(cityId);
  if (!origin) return [];

  return [...centroids.values()]
    .filter(
      ({ city }) =>
        city.id !== cityId &&
        (indexableCities === null || indexableCities.has(city.slug))
    )
    .map(({ city, point }) => ({
      slug: city.slug,
      name: city.name,
      distanceKm: Math.max(1, Math.round(haversineKm(origin.point, point))),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
};
