import React from "react";
import { MonthBar } from "@/lib/wajda-year";

interface MonthlyChartProps {
  bars: MonthBar[];
  /** Accessible summary; the numbers also appear in the table below. */
  label: string;
}

const MONTHS_SHORT = [
  "sty",
  "lut",
  "mar",
  "kwi",
  "maj",
  "cze",
  "lip",
  "sie",
  "wrz",
  "paź",
  "lis",
  "gru",
];

// Geometry in viewBox units. Text sizes are chosen so labels stay legible
// when the chart shrinks to a phone column (about 0.6x).
const WIDTH = 560;
const HEIGHT = 250;
const TOP = 30;
const BOTTOM = 34;
const PLOT_HEIGHT = HEIGHT - TOP - BOTTOM;
const GAP_RATIO = 0.32;

/**
 * Screenings per month as a server-rendered SVG bar chart. Everything is
 * drawn in currentColor with opacity, so the chart follows the text colour
 * of whatever theme it sits in. Months that have not started show only a
 * baseline tick; the month in progress is drawn lighter and marked with an
 * asterisk, explained by the caption.
 */
const MonthlyChart = ({ bars, label }: MonthlyChartProps) => {
  const max = Math.max(1, ...bars.map((b) => b.screenings ?? 0));
  const slot = WIDTH / bars.length;
  const barWidth = slot * (1 - GAP_RATIO);
  const baseline = TOP + PLOT_HEIGHT;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={label}
      className="w-full h-auto"
    >
      <line
        x1={0}
        x2={WIDTH}
        y1={baseline + 0.5}
        y2={baseline + 0.5}
        stroke="currentColor"
        strokeOpacity={0.25}
      />
      {bars.map((bar, index) => {
        const x = index * slot + (slot - barWidth) / 2;
        const center = x + barWidth / 2;
        const monthLabel = MONTHS_SHORT[Number(bar.month.slice(5, 7)) - 1];
        if (bar.screenings === null) {
          return (
            <g key={bar.month}>
              <line
                x1={x}
                x2={x + barWidth}
                y1={baseline - 1}
                y2={baseline - 1}
                stroke="currentColor"
                strokeOpacity={0.2}
                strokeWidth={2}
                strokeDasharray="3 3"
              />
              <text
                x={center}
                y={HEIGHT - 10}
                textAnchor="middle"
                fontSize={15}
                fill="currentColor"
                fillOpacity={0.3}
              >
                {monthLabel}
              </text>
            </g>
          );
        }
        const height = Math.max(
          (bar.screenings / max) * PLOT_HEIGHT,
          bar.screenings > 0 ? 2 : 0
        );
        return (
          <g key={bar.month}>
            <rect
              x={x}
              y={baseline - height}
              width={barWidth}
              height={height}
              fill="currentColor"
              fillOpacity={bar.partial ? 0.35 : 0.85}
            />
            <text
              x={center}
              y={baseline - height - 8}
              textAnchor="middle"
              fontSize={16}
              fill="currentColor"
              fillOpacity={0.85}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {bar.screenings}
              {bar.partial ? "*" : ""}
            </text>
            <text
              x={center}
              y={HEIGHT - 10}
              textAnchor="middle"
              fontSize={15}
              fill="currentColor"
              fillOpacity={0.55}
            >
              {monthLabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default MonthlyChart;
