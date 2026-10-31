"use client";

import dynamic from "next/dynamic";
import SectionLoader from "@/components/ui/section-loader";
import type { MapCinema } from "./poland-dot-map";

const PolandDotMap = dynamic(() => import("./poland-dot-map"), {
  ssr: false,
  loading: () => (
    <SectionLoader
      label="Ładowanie mapy"
      className="min-h-0 h-[105vw] max-h-[72vh] sm:h-[72vh] sm:max-h-[860px]"
    />
  ),
});

interface CinemaMapLazyProps {
  cinemas: MapCinema[];
}

const CinemaMapLazy: React.FC<CinemaMapLazyProps> = ({ cinemas }) => (
  <PolandDotMap cinemas={cinemas} />
);

export default CinemaMapLazy;
