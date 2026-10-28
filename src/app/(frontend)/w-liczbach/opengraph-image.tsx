import { OG_SIZE } from "@/lib/og-image";
import { currentMonth } from "@/lib/month-stats";
import { buildMonthStatsOgImage } from "./_components/month-stats-og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps w liczbach: seanse klasyki w bieżącym miesiącu";
export const revalidate = 3600;

export default function OgImage() {
  return buildMonthStatsOgImage(currentMonth());
}
