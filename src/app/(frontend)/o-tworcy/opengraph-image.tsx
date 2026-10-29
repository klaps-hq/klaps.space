import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Robert Siński, twórca serwisu";

export default function OgImage() {
  return buildOgImage({
    eyebrow: "Twórca",
    title: "Robert Siński",
    subtitle:
      "Kto stoi za przewodnikiem po seansach specjalnych w kinach studyjnych",
  });
}
