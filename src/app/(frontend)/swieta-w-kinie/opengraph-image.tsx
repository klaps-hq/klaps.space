import { buildOgImage, OG_SIZE } from "@/lib/og-image";
import { getChristmasSeason } from "@/lib/christmas";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Świąteczne hity w kinach";

export default function OgImage() {
  const season = getChristmasSeason();
  return buildOgImage({
    eyebrow: "Na dużym ekranie",
    title: `Świąteczne hity w kinach ${season.year}`,
    subtitle: "Seanse od 1 grudnia do 6 stycznia, miasto po mieście",
  });
}
