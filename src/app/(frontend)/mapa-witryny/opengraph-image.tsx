import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Mapa witryny";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Klaps",
    title: "Mapa witryny",
    subtitle: "Wszystkie sekcje serwisu w jednym miejscu",
  });
}
