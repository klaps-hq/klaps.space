import { notFound } from "next/navigation";
import { OG_SIZE } from "@/lib/og-image";
import { isValidMonth } from "@/lib/month-stats";
import { buildMonthStatsOgImage } from "../_components/month-stats-og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps w liczbach: seanse klasyki w miesiącu";

interface OgImageProps {
  params: Promise<{ miesiac: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { miesiac } = await params;
  if (!isValidMonth(miesiac)) notFound();
  return buildMonthStatsOgImage(miesiac);
}
