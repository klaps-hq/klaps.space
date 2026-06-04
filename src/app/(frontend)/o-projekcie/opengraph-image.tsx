import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - O projekcie";

export default function OgImage() {
  return buildOgImage({
    title: "O projekcie",
    subtitle: "Niezależny przewodnik po repertuarze kin studyjnych w Polsce",
  });
}
