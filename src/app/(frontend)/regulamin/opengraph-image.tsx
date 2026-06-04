import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Regulamin";

export default function OgImage() {
  return buildOgImage({
    title: "Regulamin",
    subtitle: "Zasady korzystania z serwisu",
  });
}
