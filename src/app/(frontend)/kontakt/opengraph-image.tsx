import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Kontakt";

export default function OgImage() {
  return buildOgImage({
    title: "Kontakt",
    subtitle: "Napisz do nas. Odpowiadamy w ciągu kilku dni roboczych",
  });
}
