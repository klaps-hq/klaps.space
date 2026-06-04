import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Repertuar kin studyjnych";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Repertuar",
    title: "Seanse",
    subtitle: "Seanse specjalne i klasyka filmowa w kinach studyjnych",
  });
}
