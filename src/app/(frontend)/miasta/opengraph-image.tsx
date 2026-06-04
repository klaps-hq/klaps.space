import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Miasta";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Przeglądaj",
    title: "Miasta",
    subtitle: "Kina studyjne i seanse w Twoim mieście",
  });
}
