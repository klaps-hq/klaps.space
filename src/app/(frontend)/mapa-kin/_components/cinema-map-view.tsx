"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Map,
  MapClusterLayer,
  MapPopup,
  MapControls,
} from "@/components/ui/map";
import { ICinema } from "@/interfaces/ICinema";

const POLAND_CENTER: [number, number] = [19.4, 52.0];
const POLAND_ZOOM = 5.5;

type SelectedCinema = {
  name: string;
  slug: string;
  address: string;
  coordinates: [number, number];
};

interface CinemaMapViewProps {
  cinemas: ICinema[];
}

function cinemasToGeoJSON(
  cinemas: ICinema[]
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: cinemas.map((c) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [c.longitude!, c.latitude!],
      },
      properties: {
        name: c.name,
        slug: c.slug,
        address: c.street ? `${c.street}, ${c.city.name}` : c.city.name,
      },
    })),
  };
}

const CinemaMapView: React.FC<CinemaMapViewProps> = ({ cinemas }) => {
  const [selected, setSelected] = useState<SelectedCinema | null>(null);

  const geojson = cinemasToGeoJSON(cinemas);

  return (
    <div
      className="relative w-full h-[70vh] min-h-[480px] max-h-[820px] border border-white/10"
      data-nosnippet
      data-lenis-prevent
    >
      <Map
        theme="dark"
        center={POLAND_CENTER}
        zoom={POLAND_ZOOM}
        minZoom={5}
        maxZoom={18}
        scrollZoom
      >
        <MapControls
          position="bottom-right"
          showZoom
          showLocate
          showFullscreen
        />

        <MapClusterLayer
          data={geojson}
          clusterMaxZoom={14}
          clusterRadius={50}
          clusterColors={["#ffffff", "#ffffff", "#ffffff"]}
          clusterThresholds={[10, 30]}
          pointColor="#ffffff"
          pointRadius={8}
          onPointClick={(feature, coordinates) => {
            setSelected({
              name: feature.properties?.name ?? "",
              slug: feature.properties?.slug ?? "",
              address: feature.properties?.address ?? "",
              coordinates,
            });
          }}
        />

        {selected && (
          <MapPopup
            longitude={selected.coordinates[0]}
            latitude={selected.coordinates[1]}
            onClose={() => setSelected(null)}
            className="bg-black border border-white/20 p-0 min-w-[260px] max-w-[320px]"
          >
            <Link
              href={`/kina/${selected.slug}`}
              className="group block p-5 flex flex-col gap-4 hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-base md:text-lg font-medium uppercase -tracking-[0.02em] leading-tight">
                  {selected.name}
                </h3>
                <p className="text-white/55 text-xs uppercase tracking-[0.18em]">
                  {selected.address}
                </p>
              </div>

              <span className="inline-flex items-baseline gap-2 text-[10px] uppercase tracking-[0.28em] text-white/65 group-hover:text-white transition-colors w-fit">
                Sprawdź repertuar
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </MapPopup>
        )}
      </Map>
    </div>
  );
};

export default CinemaMapView;
