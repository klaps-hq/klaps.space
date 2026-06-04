import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Kina studyjne";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Przeglądaj",
    title: "Kina",
    subtitle: "Kina studyjne w całej Polsce",
  });
}
