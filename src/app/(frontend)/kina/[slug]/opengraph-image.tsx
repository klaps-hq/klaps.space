import { getCinemaBySlug } from "@/lib/cinemas";
import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - repertuar kina studyjnego";

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const cinema = await getCinemaBySlug(slug);

  const subtitle = [cinema.city.name, cinema.street]
    .filter(Boolean)
    .join(" · ");

  return buildOgImage({
    eyebrow: "Kino",
    title: cinema.name,
    subtitle,
  });
}
