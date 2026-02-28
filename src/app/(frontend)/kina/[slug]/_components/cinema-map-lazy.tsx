"use client";

import dynamic from "next/dynamic";
import { ICinema } from "@/interfaces/ICinema";
import SectionLoader from "@/components/ui/section-loader";

const CinemaMap = dynamic(() => import("./cinema-map"), {
  ssr: false,
  loading: () => (
    <SectionLoader
      label="Ładowanie mapy"
      className="min-h-0 aspect-video max-h-[500px]"
    />
  ),
});

interface CinemaMapLazyProps {
  cinema: ICinema;
}

const CinemaMapLazy: React.FC<CinemaMapLazyProps> = ({ cinema }) => {
  return <CinemaMap cinema={cinema} />;
};

export default CinemaMapLazy;
