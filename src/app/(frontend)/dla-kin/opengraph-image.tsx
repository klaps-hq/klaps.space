import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Dla kin";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Dla kin",
    title: "Odznaka klaps.space",
    subtitle: "Pokażcie widzom, gdzie znaleźć Wasze seanse specjalne",
  });
}
