import React from "react";
import { POLAND_BORDER } from "../../mapa-kin/_components/poland-border";

export interface CityDot {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  count: number;
}

interface CityDotMapProps {
  cities: CityDot[];
  /** Slugs whose name is printed next to the dot. */
  labelled: ReadonlySet<string>;
  label: string;
}

// Equirectangular projection around the country, with longitude scaled by
// cos(52 deg) so Poland keeps its proportions. Same frame as /mapa-kin.
const MIN_LON = 14.1;
const MAX_LAT = 54.9;
const LON_SCALE = Math.cos((52 * Math.PI) / 180);
const UNIT = 100;
const PAD = 12;
const WIDTH = Math.round((24.2 - MIN_LON) * LON_SCALE * UNIT) + PAD * 2;
const HEIGHT = Math.round((MAX_LAT - 49.0) * UNIT) + PAD * 2;

const project = (lon: number, lat: number): [number, number] => [
  PAD + (lon - MIN_LON) * LON_SCALE * UNIT,
  PAD + (MAX_LAT - lat) * UNIT,
];

const BORDER_PATH = `${POLAND_BORDER.map(([lon, lat], index) => {
  const [x, y] = project(lon, lat);
  return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join("")}Z`;

/**
 * Server-rendered SVG map: Poland's outline and one dot per city, its area
 * proportional to the number of screenings. No map library and no client
 * JavaScript; drawn in currentColor so it follows the theme.
 */
const CityDotMap = ({ cities, labelled, label }: CityDotMapProps) => {
  const max = Math.max(1, ...cities.map((c) => c.count));
  // Largest first, so small dots stay visible on top of big ones.
  const ordered = [...cities].sort((a, b) => b.count - a.count);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={label}
      className="w-full h-auto"
    >
      <path
        d={BORDER_PATH}
        fill="currentColor"
        fillOpacity={0.04}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {ordered.map((city) => {
        const [x, y] = project(city.lon, city.lat);
        const radius = 3 + Math.sqrt(city.count / max) * 16;
        return (
          <circle
            key={city.slug}
            cx={x}
            cy={y}
            r={radius}
            fill="currentColor"
            fillOpacity={0.55}
            stroke="currentColor"
            strokeOpacity={0.9}
            strokeWidth={1}
          >
            <title>{`${city.name}: ${city.count}`}</title>
          </circle>
        );
      })}
      {ordered
        .filter((city) => labelled.has(city.slug))
        .map((city) => {
          const [x, y] = project(city.lon, city.lat);
          const radius = 3 + Math.sqrt(city.count / max) * 16;
          return (
            <text
              key={city.slug}
              x={x + radius + 5}
              y={y + 5}
              fontSize={15}
              fill="currentColor"
              fillOpacity={0.8}
            >
              {city.name}
            </text>
          );
        })}
    </svg>
  );
};

export default CityDotMap;
