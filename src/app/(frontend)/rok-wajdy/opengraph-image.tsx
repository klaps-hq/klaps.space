import { buildOgImage, OG_SIZE } from "@/lib/og-image";
import { getDirectorBySlug } from "@/lib/directors";
import { screeningsLabel } from "@/lib/month-stats";
import { pluralPl } from "@/lib/seo";
import { tmdbPhotoSrc } from "@/lib/tmdb";
import { getWajdaYearData, WAJDA_SLUG, WAJDA_YEAR } from "@/lib/wajda-year";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `Rok Wajdy w liczbach: filmy Andrzeja Wajdy w polskich kinach w ${WAJDA_YEAR}`;
export const revalidate = 3600;

/** OG card: the headline numbers next to the director's portrait. */
export default async function OgImage() {
  const [data, director] = await Promise.all([
    getWajdaYearData().catch(() => null),
    getDirectorBySlug(WAJDA_SLUG).catch(() => null),
  ]);
  const profile = data?.profile;

  return buildOgImage({
    eyebrow: `Rok Wajdy ${WAJDA_YEAR}`,
    title: "Wajda w liczbach",
    subtitle:
      profile && profile.screenings > 0
        ? `${screeningsLabel(profile.screenings)} w ${profile.cities} ${pluralPl(profile.cities, "mieście", "miastach", "miastach")}`
        : "Filmy Andrzeja Wajdy w polskich kinach",
    posterUrl: director ? tmdbPhotoSrc(director.photoUrl, "w500") : null,
  });
}
