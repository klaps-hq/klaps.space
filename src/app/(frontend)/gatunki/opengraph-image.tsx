import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Gatunki filmowe";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Przeglądaj",
    title: "Gatunki",
    subtitle: "Filtruj seanse po nastroju wieczoru",
  });
}
