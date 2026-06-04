"use client";

import {
  Map,
  MapMarker,
  MarkerContent,
  MapControls,
} from "@/components/ui/map";
import { ICinema } from "@/interfaces/ICinema";

const DEFAULT_ZOOM = 15;

interface CinemaMapProps {
  cinema: ICinema;
}

const CinemaMap: React.FC<CinemaMapProps> = ({ cinema }) => {
  if (!cinema.latitude || !cinema.longitude) {
    return null;
  }

  return (
    <div
      className="relative w-full aspect-video max-h-[560px] border border-white/10"
      data-nosnippet
    >
      <Map
        theme="dark"
        center={[cinema.longitude, cinema.latitude]}
        zoom={DEFAULT_ZOOM}
        minZoom={10}
        maxZoom={18}
        scrollZoom={false}
      >
        <MapControls position="bottom-right" showZoom />

        <MapMarker longitude={cinema.longitude} latitude={cinema.latitude}>
          <MarkerContent>
            <div className="relative flex items-center justify-center size-10">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-white/15 animate-ping [animation-duration:2.5s]"
              />
              <span className="absolute inset-1.5 rounded-full border border-white/40" />
              <span className="size-2.5 rounded-full bg-white" />
            </div>
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  );
};

export default CinemaMap;
