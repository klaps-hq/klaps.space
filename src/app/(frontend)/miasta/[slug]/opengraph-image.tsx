import { getCityBySlug } from "@/lib/cities";
import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - kina studyjne w mieście";

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const { city } = await getCityBySlug(slug);

  return buildOgImage({
    eyebrow: "Miasto",
    title: city.name,
    subtitle: `Kina studyjne i seanse specjalne w ${city.nameDeclinated ?? city.name}`,
  });
}
