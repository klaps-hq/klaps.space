import { getCityBySlug } from "@/lib/cities";
import { buildOgImage, OG_SIZE } from "@/lib/og-image";
import { inPlace } from "@/lib/seo";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - kino plenerowe w mieście";

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  // A failed lookup still yields a usable card instead of a broken image.
  const city = await getCityBySlug(slug)
    .then((data) => data.city)
    .catch(() => null);

  return buildOgImage({
    eyebrow: "Pod gołym niebem",
    title: city
      ? `Kino plenerowe ${inPlace(city.nameDeclinated ?? city.name)}`
      : "Kino plenerowe",
    subtitle: "Letnie seanse i miejsca pokazów",
  });
}
