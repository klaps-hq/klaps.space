import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - FAQ";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Pomoc",
    title: "FAQ",
    subtitle: "Najczęściej zadawane pytania o seanse, kina i bilety",
  });
}
