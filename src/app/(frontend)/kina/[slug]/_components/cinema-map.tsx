"use client";

import { MapPin } from "lucide-react";
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
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-black/40 shadow-lg shadow-white/20">
              <MapPin className="w-4 h-4 text-black" />
            </div>
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  );
};

export default CinemaMap;
