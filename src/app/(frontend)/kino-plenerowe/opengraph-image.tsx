import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Kino plenerowe";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Pod gołym niebem",
    title: "Kino plenerowe",
    subtitle: "Letnie seanse i miejsca pokazów w polskich miastach",
  });
}
