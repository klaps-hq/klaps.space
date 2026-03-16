"use client";

import dynamic from "next/dynamic";
import { ICinema } from "@/interfaces/ICinema";
import SectionLoader from "@/components/ui/section-loader";

const CinemaMapView = dynamic(() => import("./cinema-map-view"), {
  ssr: false,
  loading: () => (
    <SectionLoader
      label="Ladowanie mapy"
      className="min-h-0 h-[70vh] max-h-[800px]"
    />
  ),
});

interface CinemaMapLazyProps {
  cinemas: ICinema[];
}

const CinemaMapLazy: React.FC<CinemaMapLazyProps> = ({ cinemas }) => {
  return <CinemaMapView cinemas={cinemas} />;
};

export default CinemaMapLazy;
