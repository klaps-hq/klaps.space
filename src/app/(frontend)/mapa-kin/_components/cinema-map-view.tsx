"use client";

import { useState } from "react";
import Link from "next/link";
import { Map, MapClusterLayer, MapPopup, MapControls } from "@/components/ui/map";
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
        address: c.street
          ? `${c.street}, ${c.city.name}`
          : c.city.name,
      },
    })),
  };
}

const CinemaMapView: React.FC<CinemaMapViewProps> = ({ cinemas }) => {
  const [selected, setSelected] = useState<SelectedCinema | null>(null);

  const geojson = cinemasToGeoJSON(cinemas);

  return (
    <section data-nosnippet>
      <div className="relative">
        <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-blood-red z-10 pointer-events-none" />
        <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-blood-red z-10 pointer-events-none" />

        <div className="h-[70vh] max-h-[800px] w-full">
          <Map
            theme="dark"
            center={POLAND_CENTER}
            zoom={POLAND_ZOOM}
            minZoom={5}
            maxZoom={18}
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
              clusterColors={["#dc1301", "#b01001", "#8a0d01"]}
              clusterThresholds={[10, 30]}
              pointColor="#dc1301"
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
                className="bg-dark-ink border border-white/10 p-0 min-w-[220px] max-w-[280px]"
              >
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-white text-sm font-bold uppercase tracking-wide leading-tight">
                      {selected.name}
                    </h3>
                    <p className="text-white/50 text-xs uppercase tracking-wider">
                      {selected.address}
                    </p>
                  </div>

                  <Link
                    href={`/kina/${selected.slug}`}
                    className="inline-flex items-center gap-1.5 text-blood-red text-xs uppercase tracking-widest font-semibold transition-colors duration-200 hover:text-white"
                  >
                    Sprawdz repertuar
                  </Link>
                </div>
              </MapPopup>
            )}
          </Map>
        </div>
      </div>

      {cinemas.length === 0 && (
        <p className="text-neutral-500 text-sm mt-6 text-center">
          Brak kin z danymi lokalizacji do wyswietlenia na mapie.
        </p>
      )}
    </section>
  );
};

export default CinemaMapView;
