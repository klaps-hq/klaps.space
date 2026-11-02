import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Repertuar seansów specjalnych";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Repertuar",
    title: "Seanse",
    subtitle: "Seanse specjalne i klasyka filmowa w kinach w Polsce",
  });
}
