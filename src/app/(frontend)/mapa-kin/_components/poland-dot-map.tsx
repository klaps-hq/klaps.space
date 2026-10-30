"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Maximize2 } from "lucide-react";
import { pluralPl } from "@/lib/seo";

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

interface PolandDotMapProps {
  cinemas: MapCinema[];
}

// Simplified outline of Poland (lon, lat), the same one the studio panel
// uses. Good enough for a dot map, not a survey-grade border.
const BORDER: [number, number][] = [
  [14.2, 53.92], [14.6, 54.0], [15.4, 54.17], [16.2, 54.33], [16.9, 54.58], [17.6, 54.78],
  [18.35, 54.83], [18.55, 54.6], [18.65, 54.4], [19.0, 54.35], [19.63, 54.45], [20.5, 54.4],
  [21.5, 54.33], [22.79, 54.36], [23.5, 54.0], [23.5, 53.9], [23.9, 53.15], [23.6, 52.6],
  [23.2, 52.3], [23.6, 52.1], [23.5, 51.7], [23.6, 51.5], [24.1, 50.85], [23.7, 50.4],
  [23.2, 50.2], [22.6, 49.5], [22.86, 49.0], [22.5, 49.1], [21.8, 49.4], [21.0, 49.4],
  [20.3, 49.4], [20.0, 49.2], [19.4, 49.6], [18.85, 49.5], [18.6, 49.9], [18.0, 50.0],
  [17.6, 50.15], [16.9, 50.4], [16.6, 50.15], [16.2, 50.4], [16.3, 50.7], [15.4, 50.8],
  [14.82, 50.87], [15.0, 51.3], [14.7, 51.6], [14.6, 52.0], [14.7, 52.6], [14.2, 52.9],
  [14.4, 53.3],
];

const LON0 = 13.9;
const LAT0 = 55.0;
const SCALE = 100;
const COS = Math.cos((52 * Math.PI) / 180);
const W = (24.4 - LON0) * COS * SCALE;
const H = (LAT0 - 48.9) * SCALE;
// Dot spacing in map units: ~6k dots, cheap to redraw on every frame.
const STEP = 6;
const MIN_ZOOM = 1;
const MAX_ZOOM = 16;
// From this zoom on, individual cinemas and city names are drawn.
const DETAIL_ZOOM = 2.4;
const LABEL_ZOOM = 2.4;
const HIT_PX = 14;

const project = (lon: number, lat: number): [number, number] => [
  (lon - LON0) * COS * SCALE,
  (LAT0 - lat) * SCALE,
];

const POLY = BORDER.map(([lon, lat]) => project(lon, lat));

const inside = (x: number, y: number): boolean => {
  let hit = false;
  for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) {
    const [xi, yi] = POLY[i];
    const [xj, yj] = POLY[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      hit = !hit;
    }
  }
  return hit;
};

const GRID: [number, number][] = [];
for (let y = STEP / 2; y < H; y += STEP) {
  for (let x = STEP / 2; x < W; x += STEP) {
    if (inside(x, y)) GRID.push([x, y]);
  }
}

interface View {
  k: number;
  tx: number;
  ty: number;
}

interface Point extends MapCinema {
  x: number;
  y: number;
}

interface CityCluster {
  key: string;
  name: string;
  x: number;
  y: number;
  cinemas: Point[];
  reach: number;
}

type Hover =
  | { kind: "cinema"; point: Point }
  | { kind: "city"; city: CityCluster }
  | null;

// How far a venue lights up the grid around it, in map units.
const reachOf = (p: MapCinema): number =>
  p.films > 0 ? Math.min(5 + Math.sqrt(p.films) * 1.6, 15) : 3.5;

const weightOf = (p: MapCinema): number =>
  p.isChain ? 0.35 : p.films > 0 ? 1 : 0.4;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/**
 * Dot map of Poland in the studio panel's style: the country as a grid of
 * dots, lit around each venue in proportion to its upcoming programme.
 * Canvas, not SVG, so zooming and panning stay smooth over ~6k dots: wheel
 * or pinch to zoom, drag to pan, buttons for keyboard users. Zoomed in, it
 * draws each venue and the city names; a click opens the cinema page or, on
 * a city cluster, zooms into the city.
 */
const PolandDotMap: React.FC<PolandDotMapProps> = ({ cinemas }) => {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<View>({ k: 1, tx: 0, ty: 0 });
  const [hover, setHover] = useState<Hover>(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const animRef = useRef<number | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragRef = useRef<{ moved: boolean; pinch: number | null }>({
    moved: false,
    pinch: null,
  });

  const points = useMemo<Point[]>(
    () =>
      cinemas.map((c) => {
        const [x, y] = project(c.lon, c.lat);
        return { ...c, x, y };
      }),
    [cinemas]
  );

  const cities = useMemo<CityCluster[]>(() => {
    const byCity = new Map<string, Point[]>();
    for (const p of points) {
      const list = byCity.get(p.city) ?? [];
      list.push(p);
      byCity.set(p.city, list);
    }
    return [...byCity.entries()].map(([name, list]) => ({
      key: name,
      name,
      x: list.reduce((s, p) => s + p.x, 0) / list.length,
      y: list.reduce((s, p) => s + p.y, 0) / list.length,
      cinemas: list,
      reach: Math.max(...list.map(reachOf)),
    }));
  }, [points]);

  // Dot brightness depends only on the data, so it is computed once. Like
  // the studio map, the glow belongs to a city: its reach grows with the
  // films its venues show (chains count for a third), so a city reads as
  // one lit area instead of a few scattered dots.
  const dotAlpha = useMemo(() => {
    const glows = cities.map((c) => {
      const films = c.cinemas.reduce((s, p) => s + p.films * weightOf(p), 0);
      return {
        x: c.x,
        y: c.y,
        films,
        r: films > 0 ? Math.min(9 + Math.sqrt(films) * 2.2, 42) : 5,
      };
    });
    const max = Math.max(...glows.map((g) => g.films), 1);
    const alpha = new Float32Array(GRID.length);
    GRID.forEach(([x, y], i) => {
      let best = 0;
      for (const g of glows) {
        const dx = g.x - x;
        const dy = g.y - y;
        if (Math.abs(dx) > g.r || Math.abs(dy) > g.r) continue;
        const d = Math.hypot(dx, dy);
        if (d > g.r) continue;
        const falloff = 1 - d / g.r;
        const value =
          g.films > 0
            ? (0.3 + 0.7 * Math.min(1, falloff * 1.6)) *
              (0.45 + 0.55 * Math.sqrt(g.films / max))
            : 0.22;
        if (value > best) best = value;
      }
      alpha[i] = best;
    });
    return alpha;
  }, [cities]);

  // Fit the whole country into the container at zoom 1.
  const base = useMemo(() => {
    if (!size.w || !size.h) return { s: 1, ox: 0, oy: 0 };
    const s = Math.min(size.w / W, size.h / H) * 0.94;
    return { s, ox: (size.w - W * s) / 2, oy: (size.h - H * s) / 2 };
  }, [size]);

  const toScreen = useCallback(
    (x: number, y: number, v: View = viewRef.current): [number, number] => [
      (base.ox + x * base.s) * v.k + v.tx,
      (base.oy + y * base.s) * v.k + v.ty,
    ],
    [base]
  );

  // Keeps at least part of the country on screen.
  const clampView = useCallback(
    (v: View): View => {
      const k = clamp(v.k, MIN_ZOOM, MAX_ZOOM);
      const margin = 80;
      const left = (base.ox) * k;
      const right = (base.ox + W * base.s) * k;
      const top = base.oy * k;
      const bottom = (base.oy + H * base.s) * k;
      return {
        k,
        tx: clamp(v.tx, margin - right, size.w - margin - left),
        ty: clamp(v.ty, margin - bottom, size.h - margin - top),
      };
    },
    [base, size]
  );

  const zoomAt = useCallback(
    (factor: number, sx: number, sy: number, v: View = viewRef.current) => {
      const k = clamp(v.k * factor, MIN_ZOOM, MAX_ZOOM);
      const f = k / v.k;
      return clampView({ k, tx: sx - (sx - v.tx) * f, ty: sy - (sy - v.ty) * f });
    },
    [clampView]
  );

  const animateTo = useCallback((target: View) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = viewRef.current;
    if (reduce) {
      setView(target);
      return;
    }
    const start = performance.now();
    const duration = 380;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setView({
        k: from.k + (target.k - from.k) * e,
        tx: from.tx + (target.tx - from.tx) * e,
        ty: from.ty + (target.ty - from.ty) * e,
      });
      animRef.current = t < 1 ? requestAnimationFrame(tick) : null;
    };
    animRef.current = requestAnimationFrame(tick);
  }, []);

  // Zooms so that a map point lands in the centre at zoom k.
  const focusOn = useCallback(
    (x: number, y: number, k: number) => {
      const kk = clamp(k, MIN_ZOOM, MAX_ZOOM);
      const px = (base.ox + x * base.s) * kk;
      const py = (base.oy + y * base.s) * kk;
      animateTo(clampView({ k: kk, tx: size.w / 2 - px, ty: size.h / 2 - py }));
    },
    [animateTo, base, clampView, size]
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Draw.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size.w) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.w, size.h);

    const spacing = STEP * base.s * view.k;
    const radius = clamp(spacing * 0.28, 0.9, 3.2);
    const hoverKey =
      hover?.kind === "city" ? hover.city.key : hover?.kind === "cinema" ? hover.point.city : null;

    for (let i = 0; i < GRID.length; i++) {
      const [sx, sy] = toScreen(GRID[i][0], GRID[i][1], view);
      if (sx < -4 || sy < -4 || sx > size.w + 4 || sy > size.h + 4) continue;
      const a = dotAlpha[i];
      ctx.fillStyle =
        a > 0
          ? `rgba(255,255,255,${(0.2 + 0.8 * a).toFixed(3)})`
          : "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.arc(sx, sy, a > 0.6 ? radius * 1.15 : radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (view.k >= DETAIL_ZOOM) {
      for (const p of points) {
        const [sx, sy] = toScreen(p.x, p.y, view);
        if (sx < -10 || sy < -10 || sx > size.w + 10 || sy > size.h + 10) continue;
        const active = hover?.kind === "cinema" && hover.point.slug === p.slug;
        ctx.beginPath();
        ctx.arc(sx, sy, active ? 6 : 4.5, 0, Math.PI * 2);
        if (p.isOpenAir) {
          ctx.strokeStyle = "rgba(255,255,255,0.85)";
          ctx.lineWidth = 1.5;
          ctx.fillStyle = "#000";
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillStyle = p.isChain
            ? "rgba(255,255,255,0.35)"
            : p.films > 0
              ? "#fff"
              : "rgba(255,255,255,0.55)";
          ctx.fill();
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }

    if (view.k >= LABEL_ZOOM) {
      ctx.font = "500 10px Inter, system-ui, sans-serif";
      ctx.textBaseline = "middle";
      const taken: [number, number, number, number][] = [];
      const ordered = [...cities].sort((a, b) => b.cinemas.length - a.cinemas.length);
      for (const c of ordered) {
        const [sx, sy] = toScreen(c.x, c.y, view);
        if (sx < 0 || sy < 0 || sx > size.w || sy > size.h) continue;
        const label = c.name.toUpperCase();
        const w = ctx.measureText(label).width + 6;
        const box: [number, number, number, number] = [sx + 8, sy - 7, w, 14];
        const overlaps = taken.some(
          ([x, y, bw, bh]) =>
            box[0] < x + bw && box[0] + box[2] > x && box[1] < y + bh && box[1] + box[3] > y
        );
        if (overlaps) continue;
        taken.push(box);
        ctx.fillStyle = c.key === hoverKey ? "#fff" : "rgba(255,255,255,0.6)";
        ctx.fillText(label, sx + 10, sy);
      }
    }
  }, [base, cities, dotAlpha, hover, points, size, toScreen, view]);

  const pick = useCallback(
    (sx: number, sy: number): Hover => {
      const v = viewRef.current;
      if (v.k >= DETAIL_ZOOM) {
        let best: { p: Point; d: number } | null = null;
        for (const p of points) {
          const [px, py] = toScreen(p.x, p.y, v);
          const d = Math.hypot(px - sx, py - sy);
          if (d <= HIT_PX && (!best || d < best.d)) best = { p, d };
        }
        if (best) return { kind: "cinema", point: best.p };
      }
      let bestCity: { c: CityCluster; score: number } | null = null;
      for (const c of cities) {
        const [cx, cy] = toScreen(c.x, c.y, v);
        const r = Math.max(HIT_PX, c.reach * base.s * v.k * 0.8);
        const score = Math.hypot(cx - sx, cy - sy) / r;
        if (score <= 1 && (!bestCity || score < bestCity.score)) {
          bestCity = { c, score };
        }
      }
      if (!bestCity) return null;
      // A city with a single venue behaves like that venue.
      return bestCity.c.cinemas.length === 1
        ? { kind: "cinema", point: bestCity.c.cinemas[0] }
        : { kind: "city", city: bestCity.c };
    },
    [base, cities, points, toScreen]
  );

  const localPoint = (e: { clientX: number; clientY: number }): [number, number] => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  // Wheel zoom needs a non-passive listener to stop the page from scrolling.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const [sx, sy] = localPoint(e);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setView(zoomAt(Math.exp(-e.deltaY * 0.0015), sx, sy));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    dragRef.current.moved = false;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      dragRef.current.pinch = Math.hypot(a.x - b.x, a.y - b.y);
    }
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) {
      if (e.pointerType === "mouse") {
        const [sx, sy] = localPoint(e);
        setHover(pick(sx, sy));
      }
      return;
    }
    const next = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, next);
    if (pointers.current.size === 2 && dragRef.current.pinch) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const rect = canvasRef.current!.getBoundingClientRect();
      const mx = (a.x + b.x) / 2 - rect.left;
      const my = (a.y + b.y) / 2 - rect.top;
      setView(zoomAt(dist / dragRef.current.pinch, mx, my));
      dragRef.current.pinch = dist;
      dragRef.current.moved = true;
      return;
    }
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    if (Math.abs(dx) + Math.abs(dy) > 1) dragRef.current.moved = true;
    const v = viewRef.current;
    setView(clampView({ k: v.k, tx: v.tx + dx, ty: v.ty + dy }));
    setHover(null);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const wasDrag = dragRef.current.moved;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) dragRef.current.pinch = null;
    if (wasDrag || pointers.current.size > 0) return;
    const [sx, sy] = localPoint(e);
    const hit = pick(sx, sy);
    if (!hit) return;
    if (hit.kind === "cinema") {
      // Touch shows the details first; a second tap opens the page.
      if (e.pointerType !== "mouse" && !(hover?.kind === "cinema" && hover.point.slug === hit.point.slug)) {
        setHover(hit);
        return;
      }
      router.push(`/kina/${hit.point.slug}`);
      return;
    }
    setHover(hit);
    focusOn(hit.city.x, hit.city.y, Math.max(viewRef.current.k * 2.2, 6));
  };

  const zoomButton = (factor: number) =>
    animateTo(zoomAt(factor, size.w / 2, size.h / 2));

  const tooltip = (() => {
    if (!hover) return null;
    if (hover.kind === "cinema") {
      const p = hover.point;
      const [sx, sy] = toScreen(p.x, p.y);
      return {
        sx,
        sy,
        title: p.name,
        lines: [
          [p.street, p.city].filter(Boolean).join(", "),
          p.films > 0
            ? `${p.films} ${pluralPl(p.films, "film", "filmy", "filmów")} w repertuarze`
            : "Brak zapowiedzianych seansów",
          p.isOpenAir ? "Kino plenerowe" : p.isChain ? "Kino sieciowe" : "Kino studyjne",
        ],
        hint: "Kliknij, aby otworzyć stronę kina",
      };
    }
    const c = hover.city;
    const studio = c.cinemas.filter((p) => !p.isChain && !p.isOpenAir);
    const playing = c.cinemas.filter((p) => p.films > 0).length;
    const [sx, sy] = toScreen(c.x, c.y);
    return {
      sx,
      sy,
      title: c.name,
      lines: [
        `${c.cinemas.length} ${pluralPl(c.cinemas.length, "miejsce", "miejsca", "miejsc")}, w tym ${studio.length} ${pluralPl(studio.length, "kino studyjne", "kina studyjne", "kin studyjnych")}`,
        `${playing} z repertuarem`,
      ],
      hint: "Kliknij, aby przybliżyć",
    };
  })();

  const buttonClass =
    "flex size-10 items-center justify-center bg-black text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-white";

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={wrapRef}
        // Phones get the map's own aspect ratio (Poland is roughly square),
        // instead of a tall frame with empty bands above and below it.
        className="relative w-full h-[105vw] max-h-[72vh] min-h-[320px] sm:h-[72vh] sm:min-h-[420px] sm:max-h-[860px] border border-white/10 overflow-hidden select-none"
        data-nosnippet
        data-lenis-prevent
      >
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full touch-none ${hover ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"}`}
          style={{ width: size.w, height: size.h }}
          role="img"
          aria-label="Mapa kin studyjnych w Polsce. Lista miast z kinami jest pod mapą."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
          onDoubleClick={(e) => {
            const [sx, sy] = localPoint(e);
            animateTo(zoomAt(2, sx, sy));
          }}
        />

        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 min-w-48 max-w-72 -translate-x-1/2 -translate-y-[calc(100%+16px)] border border-white/20 bg-black/95 px-4 py-3"
            style={{
              left: clamp(tooltip.sx, 110, Math.max(110, size.w - 110)),
              top: Math.max(tooltip.sy, 110),
            }}
          >
            <p className="text-sm font-medium uppercase -tracking-[0.01em] text-white leading-tight">
              {tooltip.title}
            </p>
            {tooltip.lines.map((line) => (
              <p
                key={line}
                className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/55"
              >
                {line}
              </p>
            ))}
            <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/40">
              {tooltip.hint}
            </p>
          </div>
        )}

        <div className="absolute right-3 bottom-3 flex flex-col border border-white/15 divide-y divide-white/15">
          <button type="button" className={buttonClass} onClick={() => zoomButton(1.8)} aria-label="Przybliż">
            <Plus className="size-4" aria-hidden="true" />
          </button>
          <button type="button" className={buttonClass} onClick={() => zoomButton(1 / 1.8)} aria-label="Oddal">
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => animateTo({ k: 1, tx: 0, ty: 0 })}
            aria-label="Pokaż całą Polskę"
          >
            <Maximize2 className="size-4" aria-hidden="true" />
          </button>
        </div>

        <p className="pointer-events-none absolute left-4 bottom-3 hidden sm:block text-[10px] uppercase tracking-[0.22em] text-white/40">
          Przewiń lub uszczypnij, aby przybliżyć. Przeciągnij, aby przesunąć.
        </p>
      </div>

      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/55">
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-white" aria-hidden="true" />
          Kino studyjne z repertuarem
        </li>
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-white/55" aria-hidden="true" />
          Bez zapowiedzianych seansów
        </li>
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-full border border-white/85" aria-hidden="true" />
          Kino plenerowe
        </li>
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-white/35" aria-hidden="true" />
          Kino sieciowe
        </li>
      </ul>
    </div>
  );
};

export default PolandDotMap;
