import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Reżyserzy";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Przeglądaj",
    title: "Reżyserzy",
    subtitle: "Twórcy, których kino wraca na duży ekran",
  });
}
