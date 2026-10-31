"use client";

import dynamic from "next/dynamic";
import SectionLoader from "@/components/ui/section-loader";
import type { MapCinema } from "./poland-street-map";

const PolandStreetMap = dynamic(() => import("./poland-street-map"), {
  ssr: false,
  loading: () => (
    <SectionLoader
      label="Ładowanie mapy"
      className="min-h-[360px] h-[110vw] max-h-[78vh] sm:h-[78vh] sm:min-h-[480px] sm:max-h-[900px]"
    />
  ),
});

interface CinemaMapLazyProps {
  cinemas: MapCinema[];
}

const CinemaMapLazy: React.FC<CinemaMapLazyProps> = ({ cinemas }) => (
  <PolandStreetMap cinemas={cinemas} />
);

export default CinemaMapLazy;
