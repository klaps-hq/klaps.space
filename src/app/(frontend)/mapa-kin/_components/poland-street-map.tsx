"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type MapLibreGL from "maplibre-gl";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import { Map, MapControls, MapPopup, useMap } from "@/components/ui/map";
import { pluralPl } from "@/lib/seo";
import { POLAND_BORDER } from "./poland-border";

export interface MapCinema {
  slug: string;
  name: string;
  city: string;
  street: string | null;
  lat: number;
  lon: number;
  /** Films with an upcoming screening. */
  films: number;
  isChain: boolean;
  isOpenAir: boolean;
}

interface PolandStreetMapProps {
  cinemas: MapCinema[];
}

// Pan limits around the country. MapLibre will not zoom out past a view
// that fits inside them, so the margins are wide enough for all of Poland
// to fit both in a wide (~2:1) desktop frame and a narrow phone one; the
// mask covers what lies beyond the border.
const POLAND_BOUNDS: [[number, number], [number, number]] = [
  [8.0, 46.6],
  [30.3, 57.0],
];
const POLAND_FIT: [[number, number], [number, number]] = [
  [14.1, 49.0],
  [24.15, 54.85],
];

// Venue kinds, drawn from most to least relevant.
type VenueKind = "studio" | "idle" | "openAir" | "chain";

const kindOf = (cinema: MapCinema): VenueKind =>
  cinema.isChain
    ? "chain"
    : cinema.isOpenAir
      ? "openAir"
      : cinema.films > 0
        ? "studio"
        : "idle";

const PLACE_LABEL_MIN_ZOOM = 8;

// Swaps every ["get", "name:en"] in a style expression for the local name.
const preferLocalName = (value: unknown): unknown => {
  if (!Array.isArray(value)) return value;
  if (value.length === 2 && value[0] === "get" && value[1] === "name:en") {
    return ["get", "name"];
  }
  return value.map(preferLocalName);
};

const SOURCE = "klaps-cinemas";
const MASK_SOURCE = "klaps-poland-mask";
const LAYER = {
  mask: "klaps-mask",
  border: "klaps-border",
  clusterGlow: "klaps-cluster-glow",
  clusters: "klaps-clusters",
  clusterCount: "klaps-cluster-count",
  pointGlow: "klaps-point-glow",
  points: "klaps-points",
  pointCore: "klaps-point-core",
  labels: "klaps-labels",
} as const;

// The world with Poland cut out: everything outside the country is black,
// like the page around the map, so it reads as Poland only.
const MASK: GeoJSON.Feature<GeoJSON.Polygon> = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-180, -85],
        [180, -85],
        [180, 85],
        [-180, 85],
        [-180, -85],
      ],
      POLAND_BORDER,
    ],
  },
};

interface SelectedVenue {
  slug: string;
  name: string;
  address: string;
  films: number;
  kind: VenueKind;
  coordinates: [number, number];
}

const KIND_LABEL: Record<VenueKind, string> = {
  studio: "Kino studyjne",
  idle: "Kino studyjne",
  openAir: "Kino plenerowe",
  chain: "Kino sieciowe",
};

interface CinemaLayersProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Point>;
  onSelect: (venue: SelectedVenue) => void;
}

/**
 * Mask, border and the venues as MapLibre layers, so a few hundred points
 * stay one draw call. Clusters split as you zoom in; from street level on
 * every venue carries its name.
 */
const CinemaLayers: React.FC<CinemaLayersProps> = ({ data, onSelect }) => {
  const { map, isLoaded } = useMap();
  const router = useRouter();

  useEffect(() => {
    if (!map || !isLoaded) return;

    // The basemap names countries in English ("POLAND"); the page is about
    // one country, so they go. Place names wait until the clusters have
    // split: at country scale the white discs cut them in half ("Krako")
    // and border towns of the neighbours ("Brest") spilled over the mask.
    for (const layer of map.getStyle().layers) {
      if (layer.type !== "symbol") continue;
      // Carto labels prefer English names ("KRAKOW", "WARSAW"); local ones
      // carry the Polish spelling.
      const textField = map.getLayoutProperty(layer.id, "text-field");
      if (textField) {
        map.setLayoutProperty(layer.id, "text-field", preferLocalName(textField));
      }
      if (layer.id.includes("country")) {
        map.setLayoutProperty(layer.id, "visibility", "none");
      } else if (layer.id.startsWith("place")) {
        map.setLayerZoomRange(
          layer.id,
          Math.max(layer.minzoom ?? 0, PLACE_LABEL_MIN_ZOOM),
          layer.maxzoom ?? 24
        );
      }
    }

    map.addSource(MASK_SOURCE, { type: "geojson", data: MASK });
    map.addLayer({
      id: LAYER.mask,
      type: "fill",
      source: MASK_SOURCE,
      // Opaque, so no foreign city or region name shows through.
      paint: { "fill-color": "#000", "fill-opacity": 1 },
    });
    map.addLayer({
      id: LAYER.border,
      type: "line",
      source: MASK_SOURCE,
      paint: {
        "line-color": "rgba(255,255,255,0.35)",
        "line-width": ["interpolate", ["linear"], ["zoom"], 5, 0.8, 10, 1.4],
      },
    });

    map.addSource(SOURCE, {
      type: "geojson",
      data,
      cluster: true,
      clusterMaxZoom: 11,
      clusterRadius: 40,
    });
    // A cluster is a solid white disc that grows with its venue count,
    // inside a soft glow: bigger scenes read as brighter spots.
    const clusterRadius: MapLibreGL.ExpressionSpecification = [
      "interpolate",
      ["linear"],
      ["sqrt", ["get", "point_count"]],
      1.4,
      9,
      3,
      12,
      9,
      22,
    ];
    map.addLayer({
      id: LAYER.clusterGlow,
      type: "circle",
      source: SOURCE,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#fff",
        "circle-opacity": 0.12,
        "circle-blur": 0.6,
        "circle-radius": ["*", clusterRadius, 2.1],
      },
    });
    map.addLayer({
      id: LAYER.clusters,
      type: "circle",
      source: SOURCE,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#fff",
        "circle-radius": clusterRadius,
      },
    });
    map.addLayer({
      id: LAYER.clusterCount,
      type: "symbol",
      source: SOURCE,
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["Montserrat SemiBold"],
        "text-size": ["interpolate", ["linear"], ["get", "point_count"], 2, 10, 80, 13],
        "text-allow-overlap": true,
        "text-ignore-placement": true,
      },
      paint: { "text-color": "#000" },
    });
    // Venue markers have to stand out from a dark grey basemap at every
    // zoom, so kinds differ by shape (solid disc, ring, ring with a dot)
    // rather than by shades of grey, and each sits in a soft glow.
    // MapLibre accepts ["zoom"] only as the input of a top-level
    // interpolate, so the scale and the per-kind size live in the stops.
    const markerRadius = (
      scale: number,
      chainScale = scale
    ): MapLibreGL.ExpressionSpecification => {
      const at = (radius: number): MapLibreGL.ExpressionSpecification => [
        "match",
        ["get", "kind"],
        "chain",
        radius * chainScale,
        radius * scale,
      ];
      return ["interpolate", ["linear"], ["zoom"], 6, at(7), 11, at(9), 16, at(12)];
    };
    const notCluster: MapLibreGL.FilterSpecification = [
      "!",
      ["has", "point_count"],
    ];
    map.addLayer({
      id: LAYER.pointGlow,
      type: "circle",
      source: SOURCE,
      filter: notCluster,
      paint: {
        "circle-color": "#fff",
        "circle-opacity": [
          "match",
          ["get", "kind"],
          "studio",
          0.4,
          "chain",
          0.16,
          0.28,
        ],
        "circle-blur": 0.75,
        "circle-radius": markerRadius(2.4),
      },
    });
    map.addLayer({
      id: LAYER.points,
      type: "circle",
      source: SOURCE,
      filter: notCluster,
      paint: {
        "circle-radius": markerRadius(1, 0.85),
        "circle-color": [
          "match",
          ["get", "kind"],
          "studio",
          "#fff",
          "chain",
          "#a3a3a3",
          "#000",
        ],
        "circle-stroke-color": [
          "match",
          ["get", "kind"],
          "idle",
          "#fff",
          "openAir",
          "#fff",
          "#000",
        ],
        "circle-stroke-width": [
          "match",
          ["get", "kind"],
          "idle",
          3,
          "openAir",
          3,
          2,
        ],
      },
    });
    map.addLayer({
      id: LAYER.pointCore,
      type: "circle",
      source: SOURCE,
      filter: ["all", notCluster, ["==", ["get", "kind"], "openAir"]],
      paint: {
        "circle-color": "#fff",
        "circle-radius": markerRadius(0.4),
      },
    });
    map.addLayer({
      id: LAYER.labels,
      type: "symbol",
      source: SOURCE,
      filter: ["!", ["has", "point_count"]],
      minzoom: 11,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Montserrat Medium"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 11, 12, 16, 14],
        "text-anchor": "left",
        "text-offset": [1.2, 0],
        "text-max-width": 14,
        "text-optional": true,
        // Programme venues win label collisions, multiplexes lose them.
        "symbol-sort-key": [
          "match",
          ["get", "kind"],
          "studio",
          0,
          "openAir",
          1,
          "idle",
          2,
          3,
        ],
      },
      paint: {
        "text-color": [
          "match",
          ["get", "kind"],
          "chain",
          "rgba(255,255,255,0.65)",
          "#fff",
        ],
        "text-halo-color": "#000",
        "text-halo-width": 2,
      },
    });

    const onClusterClick = async (e: MapLibreGL.MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const source = map.getSource(SOURCE) as MapLibreGL.GeoJSONSource;
      const zoom = await source.getClusterExpansionZoom(
        feature.properties.cluster_id
      );
      map.easeTo({
        center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
        zoom,
      });
    };
    const onPointClick = (e: MapLibreGL.MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const p = feature.properties;
      onSelect({
        slug: p.slug,
        name: p.name,
        address: p.address,
        films: Number(p.films),
        kind: p.kind,
        coordinates: (feature.geometry as GeoJSON.Point).coordinates as [
          number,
          number,
        ],
      });
    };
    // Warm the cinema page on hover, so the popup link opens at once.
    const onPointEnter = (e: MapLibreGL.MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = "pointer";
      const slug = e.features?.[0]?.properties.slug;
      if (slug) router.prefetch(`/kina/${slug}`, { kind: PrefetchKind.FULL });
    };
    const onEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const onLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", LAYER.clusters, onClusterClick);
    map.on("click", LAYER.points, onPointClick);
    map.on("mouseenter", LAYER.clusters, onEnter);
    map.on("mouseleave", LAYER.clusters, onLeave);
    map.on("mouseenter", LAYER.points, onPointEnter);
    map.on("mouseleave", LAYER.points, onLeave);

    return () => {
      map.off("click", LAYER.clusters, onClusterClick);
      map.off("click", LAYER.points, onPointClick);
      map.off("mouseenter", LAYER.clusters, onEnter);
      map.off("mouseleave", LAYER.clusters, onLeave);
      map.off("mouseenter", LAYER.points, onPointEnter);
      map.off("mouseleave", LAYER.points, onLeave);
      try {
        for (const id of Object.values(LAYER).reverse()) {
          if (map.getLayer(id)) map.removeLayer(id);
        }
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
        if (map.getSource(MASK_SOURCE)) map.removeSource(MASK_SOURCE);
      } catch {
        // The map is already gone on unmount.
      }
    };
  }, [map, isLoaded, data, onSelect, router]);

  return null;
};

/**
 * Street map of Poland (roads, buildings, place names from the Carto dark
 * basemap) with every venue that has coordinates. Everything outside the
 * border is masked and out of pan range. Scrolling the page past the map
 * keeps working: Ctrl or Cmd plus wheel zooms, and on a phone two fingers
 * move the map while one finger scrolls the page.
 */
const PolandStreetMap: React.FC<PolandStreetMapProps> = ({ cinemas }) => {
  const [selected, setSelected] = useState<SelectedVenue | null>(null);

  const data = useMemo<GeoJSON.FeatureCollection<GeoJSON.Point>>(
    () => ({
      type: "FeatureCollection",
      features: cinemas.map((c) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [c.lon, c.lat] },
        properties: {
          slug: c.slug,
          name: c.name,
          address: [c.street, c.city].filter(Boolean).join(", "),
          films: c.films,
          kind: kindOf(c),
        },
      })),
    }),
    [cinemas]
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative w-full h-[110vw] max-h-[78vh] min-h-[360px] sm:h-[78vh] sm:min-h-[480px] sm:max-h-[900px] border border-white/10 overflow-hidden"
        data-nosnippet
      >
        <Map
          theme="dark"
          bounds={POLAND_FIT}
          fitBoundsOptions={{ padding: 16 }}
          maxBounds={POLAND_BOUNDS}
          minZoom={4}
          maxZoom={18}
          dragRotate={false}
          pitchWithRotate={false}
          touchPitch={false}
          cooperativeGestures
          locale={{
            "CooperativeGesturesHandler.WindowsHelpText":
              "Ctrl + przewijanie przybliża mapę",
            "CooperativeGesturesHandler.MacHelpText":
              "⌘ + przewijanie przybliża mapę",
            "CooperativeGesturesHandler.MobileHelpText":
              "Przesuwaj mapę dwoma palcami",
          }}
        >
          <CinemaLayers data={data} onSelect={setSelected} />
          <MapControls position="bottom-right" showZoom showLocate />

          {selected && (
            <MapPopup
              longitude={selected.coordinates[0]}
              latitude={selected.coordinates[1]}
              onClose={() => setSelected(null)}
              offset={14}
              className="!rounded-none !shadow-none bg-black border border-white/20 !p-0 min-w-[240px] max-w-[300px]"
            >
              <Link
                href={`/kina/${selected.slug}`}
                className="group block hover:bg-white/[0.03] transition-colors"
              >
                <div className="px-5 pt-4 pb-3 border-b border-white/10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2">
                    {KIND_LABEL[selected.kind]}
                  </p>
                  <h3 className="text-white text-base font-medium uppercase -tracking-[0.02em] leading-tight">
                    {selected.name}
                  </h3>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-white/55">
                    {selected.address}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/55">
                    {selected.films > 0
                      ? `${selected.films} ${pluralPl(selected.films, "film", "filmy", "filmów")} w repertuarze`
                      : "Brak zapowiedzianych seansów"}
                  </p>
                </div>
                <div className="px-5 py-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-white/65 group-hover:text-white transition-colors">
                    Sprawdź repertuar
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-white/65 group-hover:text-white transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            </MapPopup>
          )}
        </Map>
      </div>

      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/55">
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-white" aria-hidden="true" />
          Kino studyjne z repertuarem
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full border-2 border-white" aria-hidden="true" />
          Bez zapowiedzianych seansów
        </li>
        <li className="flex items-center gap-2">
          <span
            className="flex size-3 items-center justify-center rounded-full border-2 border-white"
            aria-hidden="true"
          >
            <span className="size-1 rounded-full bg-white" />
          </span>
          Kino plenerowe
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#a3a3a3]" aria-hidden="true" />
          Kino sieciowe
        </li>
        <li className="flex items-center gap-2">
          <span
            className="flex size-4 items-center justify-center rounded-full bg-white text-[8px] font-semibold text-black shadow-[0_0_0_4px_rgba(255,255,255,0.12)]"
            aria-hidden="true"
          >
            5
          </span>
          Kilka kin, kliknij, aby przybliżyć
        </li>
      </ul>
    </div>
  );
};

export default PolandStreetMap;
