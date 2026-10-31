import { buildOgImage, OG_SIZE } from "@/lib/og-image";
import { getClassicMonths } from "@/lib/landing-pages";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - klasyka w kinach w miesiącu";

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const month = getClassicMonths().find((m) => m.slug === slug);

  return buildOgImage({
    eyebrow: "Klasyka w kinach",
    title: month
      ? `${month.name.charAt(0).toUpperCase()}${month.name.slice(1)} ${month.year}`
      : "Klasyka w kinach",
    subtitle: "Filmy sprzed lat na dużym ekranie w kinach w całej Polsce",
  });
}
