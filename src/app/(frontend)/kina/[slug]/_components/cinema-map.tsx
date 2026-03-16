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
      className="relative w-full aspect-video max-h-[500px]"
      data-nosnippet
    >
      <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-blood-red z-10 pointer-events-none" />
      <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-blood-red z-10 pointer-events-none" />

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
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blood-red border-2 border-white/20 shadow-lg shadow-blood-red/30">
              <MapPin className="w-4 h-4 text-white" />
            </div>
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  );
};

export default CinemaMap;
