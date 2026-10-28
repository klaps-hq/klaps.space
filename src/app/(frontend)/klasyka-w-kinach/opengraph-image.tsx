import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Klasyka w kinach";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Na dużym ekranie",
    title: "Klasyka w kinach",
    subtitle: "Filmy sprzed lat w repertuarze kin w całej Polsce",
  });
}
