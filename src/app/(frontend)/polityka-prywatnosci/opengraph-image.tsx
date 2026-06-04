import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Polityka prywatności";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Prawne",
    title: "Polityka prywatności",
    subtitle: "Ochrona danych w serwisie",
  });
}
