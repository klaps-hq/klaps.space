import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Mapa kin studyjnych";

export default function OgImage() {
  return buildOgImage({
    title: "Mapa kin",
    subtitle: "Wszystkie kina studyjne na mapie Polski",
  });
}
