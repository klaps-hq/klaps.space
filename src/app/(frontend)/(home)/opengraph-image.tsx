import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Seanse specjalne i klasyka filmowa w kinach studyjnych";

export default function OgImage() {
  return buildOgImage({
    title: "Klaps",
    subtitle: "Seanse specjalne i klasyka filmowa w kinach studyjnych w Polsce",
  });
}
