"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Maximize2 } from "lucide-react";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
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

// Outline of Poland (lon, lat) from Natural Earth 1:50m, simplified to
// ~0.01 degrees: finer than the dot grid, so the coast and the mountain
// border read as they should.
const BORDER: [number, number][] = [
  [23.61, 51.52], [23.68, 51.39], [23.66, 51.35], [23.66, 51.31], [23.86, 51.13], [23.99, 50.94],
  [24.10, 50.87], [24.11, 50.84], [24.00, 50.81], [23.98, 50.79], [24.05, 50.72], [24.09, 50.62],
  [24.09, 50.53], [23.97, 50.41], [23.71, 50.38], [23.04, 49.90], [22.71, 49.61], [22.65, 49.54],
  [22.73, 49.30], [22.71, 49.17], [22.85, 49.08], [22.84, 49.04], [22.81, 49.02], [22.58, 49.08],
  [22.47, 49.08], [22.02, 49.21], [21.97, 49.30], [21.89, 49.34], [21.64, 49.41], [21.35, 49.43],
  [21.08, 49.42], [21.00, 49.34], [20.95, 49.32], [20.87, 49.31], [20.80, 49.33], [20.73, 49.37],
  [20.62, 49.39], [20.36, 49.39], [20.16, 49.32], [20.11, 49.27], [20.06, 49.18], [19.92, 49.22],
  [19.80, 49.19], [19.76, 49.20], [19.79, 49.27], [19.77, 49.37], [19.63, 49.41], [19.48, 49.58],
  [19.44, 49.60], [19.25, 49.51], [19.15, 49.40], [18.97, 49.40], [18.94, 49.50], [18.83, 49.51],
  [18.81, 49.61], [18.59, 49.76], [18.56, 49.88], [18.35, 49.93], [18.31, 49.91], [18.03, 50.04],
  [17.98, 50.00], [17.87, 49.97], [17.83, 49.98], [17.68, 50.10], [17.63, 50.12], [17.59, 50.16],
  [17.71, 50.19], [17.74, 50.23], [17.72, 50.30], [17.70, 50.31], [17.55, 50.26], [17.42, 50.25],
  [17.15, 50.38], [16.88, 50.43], [16.87, 50.41], [16.99, 50.26], [16.99, 50.24], [16.84, 50.19],
  [16.68, 50.10], [16.64, 50.10], [16.60, 50.12], [16.49, 50.25], [16.33, 50.37], [16.23, 50.39],
  [16.21, 50.42], [16.28, 50.48], [16.38, 50.52], [16.41, 50.59], [16.28, 50.66], [16.01, 50.61],
  [15.95, 50.67], [15.73, 50.74], [15.39, 50.80], [15.28, 50.88], [15.26, 50.96], [15.13, 50.99],
  [14.99, 51.01], [14.98, 50.89], [14.81, 50.86], [14.96, 51.10], [15.02, 51.25], [14.94, 51.44],
  [14.91, 51.46], [14.72, 51.52], [14.71, 51.54], [14.74, 51.63], [14.72, 51.66], [14.62, 51.77],
  [14.60, 51.83], [14.67, 51.90], [14.75, 52.08], [14.70, 52.11], [14.69, 52.15], [14.71, 52.21],
  [14.68, 52.25], [14.62, 52.28], [14.55, 52.36], [14.62, 52.53], [14.51, 52.65], [14.25, 52.78],
  [14.13, 52.88], [14.14, 52.93], [14.19, 52.98], [14.29, 53.03], [14.37, 53.11], [14.41, 53.20],
  [14.41, 53.28], [14.30, 53.56], [14.26, 53.73], [14.58, 53.64], [14.55, 53.71], [14.56, 53.82],
  [14.21, 53.87], [14.20, 53.92], [14.21, 53.95], [14.25, 53.93], [14.38, 53.92], [14.72, 54.02],
  [15.29, 54.14], [16.19, 54.29], [16.56, 54.55], [16.89, 54.60], [17.26, 54.73], [17.84, 54.82],
  [18.32, 54.84], [18.76, 54.68], [18.80, 54.63], [18.50, 54.74], [18.44, 54.74], [18.59, 54.51],
  [18.67, 54.43], [18.84, 54.37], [18.98, 54.35], [19.41, 54.39], [19.60, 54.46], [20.21, 54.42],
  [22.17, 54.36], [22.73, 54.35], [22.82, 54.40], [22.98, 54.37], [23.02, 54.35], [23.04, 54.30],
  [23.17, 54.28], [23.37, 54.20], [23.45, 54.14], [23.48, 54.08], [23.48, 53.96], [23.60, 53.60],
  [23.79, 53.27], [23.89, 53.03], [23.91, 52.90], [23.90, 52.70], [23.84, 52.66], [23.41, 52.52],
  [23.20, 52.34], [23.18, 52.29], [23.20, 52.26], [23.46, 52.17], [23.60, 52.10], [23.65, 52.04],
  [23.65, 51.97], [23.61, 51.88], [23.63, 51.81], [23.54, 51.71], [23.54, 51.62],
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
// Below LABEL_ZOOM only the biggest programmes are named, for orientation.
const OVERVIEW_LABELS = 8;
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

// Multiplexes barely count, so the glow shows the arthouse programme.
const weightOf = (p: MapCinema): number => (p.isChain ? 0.15 : 1);

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
  const [hint, setHint] = useState(false);
  const hintTimer = useRef<number | null>(null);
  const [modifier, setModifier] = useState("Ctrl");

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.userAgent)) setModifier("⌘");
    return () => {
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
    };
  }, []);

  const flashHint = useCallback(() => {
    setHint(true);
    if (hintTimer.current) window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHint(false), 1400);
  }, []);
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

  const cityFilms = useMemo(
    () =>
      new Map(
        cities.map((c) => [
          c.key,
          c.cinemas.reduce((s, p) => s + p.films * weightOf(p), 0),
        ])
      ),
    [cities]
  );

  // Dot brightness depends only on the data, so it is computed once. Like
  // the studio map, the glow belongs to a city: its reach grows with the
  // films its venues show, so a city reads as one lit area instead of a few
  // scattered dots. Cities with nothing upcoming stay dark: lighting all
  // 300+ towns turned the country into noise with no visible hot spots.
  const dotAlpha = useMemo(() => {
    const glows = cities
      .map((c) => ({ x: c.x, y: c.y, films: cityFilms.get(c.key) ?? 0 }))
      .filter((g) => g.films > 0)
      .map((g) => ({ ...g, r: Math.min(8 + Math.sqrt(g.films) * 2.6, 40) }));
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
          (0.3 + 0.7 * Math.min(1, falloff * 1.5)) *
          (0.35 + 0.65 * Math.sqrt(g.films / max));
        if (value > best) best = value;
      }
      alpha[i] = best;
    });
    return alpha;
  }, [cities, cityFilms]);

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

    {
      ctx.font = "500 10px Inter, system-ui, sans-serif";
      ctx.textBaseline = "middle";
      const taken: [number, number, number, number][] = [];
      const ordered =
        view.k >= LABEL_ZOOM
          ? [...cities].sort((a, b) => b.cinemas.length - a.cinemas.length)
          : [...cities]
              .sort(
                (a, b) =>
                  (cityFilms.get(b.key) ?? 0) - (cityFilms.get(a.key) ?? 0)
              )
              .slice(0, OVERVIEW_LABELS);
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
  }, [base, cities, cityFilms, dotAlpha, hover, points, size, toScreen, view]);

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

  // A plain wheel scrolls the page: zooming on it trapped the scroll for
  // anyone passing over a map that fills most of the screen. Ctrl (or Cmd)
  // plus wheel zooms, which is also what a trackpad pinch sends; a plain
  // wheel only flashes the hint. Non-passive, so the zoom can stop the
  // browser's own page zoom.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        flashHint();
        return;
      }
      e.preventDefault();
      // Lenis skips ctrl+wheel on its own, but would scroll on cmd+wheel.
      e.stopPropagation();
      const [sx, sy] = localPoint(e);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setView(zoomAt(Math.exp(-e.deltaY * 0.0015), sx, sy));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [flashHint, zoomAt]);

  // Warm the cinema page while its tooltip is open, so the click is instant.
  const hoveredSlug = hover?.kind === "cinema" ? hover.point.slug : null;
  useEffect(() => {
    if (hoveredSlug) {
      router.prefetch(`/kina/${hoveredSlug}`, { kind: PrefetchKind.FULL });
    }
  }, [hoveredSlug, router]);

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

  // The browser took over the gesture (a page scroll on touch): forget the
  // pointer, but never treat it as a tap.
  const onPointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) dragRef.current.pinch = null;
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
      >
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full ${hover ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"}`}
          // At full view one finger scrolls the page past the map and two
          // fingers zoom it; once zoomed in, one finger pans the map.
          style={{
            width: size.w,
            height: size.h,
            touchAction: view.k > 1.01 ? "none" : "pan-y",
          }}
          role="img"
          aria-label="Mapa kin studyjnych w Polsce. Lista miast z kinami jest pod mapą."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
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

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/60 transition-opacity duration-200 ${hint ? "opacity-100" : "opacity-0"}`}
        >
          <p className="px-6 text-center text-xs uppercase tracking-[0.22em] text-white">
            {modifier} + przewijanie przybliża mapę
          </p>
        </div>

        <p className="pointer-events-none absolute left-4 bottom-3 hidden sm:block text-[10px] uppercase tracking-[0.22em] text-white/40">
          {modifier} + przewijanie przybliża. Przeciągnij, aby przesunąć.
        </p>
        <p className="pointer-events-none absolute left-4 bottom-3 sm:hidden text-[10px] uppercase tracking-[0.22em] text-white/40">
          Dwa palce przybliżają mapę
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
