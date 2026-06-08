import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

const HAIRLINE = "1px solid rgba(255,255,255,0.12)";

interface OgImageOptions {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  posterUrl?: string | null;
}

// Width the poster claims in the poster-dominant movie layout, leaving
// ~530px for the text column on the right.
const POSTER_WIDTH = 540;

// Sized so text stays legible when scaled down to small link embeds
// (Discord/Slack/Messenger render OG images at roughly 440px wide).
// With a poster the text column is narrower, so cap sizes to keep the
// longest word from clipping; full width otherwise.
const getTitleSize = (title: string, hasPoster: boolean): number => {
  if (hasPoster) {
    if (title.length > 24) return 56;
    if (title.length > 16) return 68;
    if (title.length > 10) return 80;
    return 92;
  }
  if (title.length > 24) return 72;
  if (title.length > 14) return 96;
  if (title.length > 9) return 112;
  return 136;
};

export async function buildOgImage({
  title,
  subtitle,
  eyebrow,
  posterUrl,
}: OgImageOptions) {
  const [regular, bold] = await Promise.all([
    readFile(path.join(process.cwd(), "src/assets/fonts/Inter-Regular.ttf")),
    readFile(path.join(process.cwd(), "src/assets/fonts/Inter-Bold.ttf")),
  ]);

  const hasPoster = Boolean(posterUrl);
  const titleSize = getTitleSize(title, hasPoster);
  const padX = hasPoster ? 52 : 64;
  // With a poster the body is centered in the right column; otherwise the
  // text sits at the bottom of the full-width canvas.
  const bodyJustify = hasPoster ? "center" : "flex-end";

  const infoColumn = (
    <div
      style={{
        display: "flex",
        flex: 1,
        minWidth: 0,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 92,
          padding: `0 ${padX}px`,
          borderBottom: HAIRLINE,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="34" height="24" viewBox="0 0 28 20">
            <polygon points="0,8 28,0 28,20 0,12" fill="#ffffff" />
          </svg>
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            klaps
          </span>
        </div>
        {eyebrow && (
          <span
            style={{
              fontSize: hasPoster ? 18 : 20,
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            {eyebrow}
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          flexDirection: "column",
          justifyContent: bodyJustify,
          padding: `48px ${padX}px`,
        }}
      >
        <span
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
          }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            style={{
              marginTop: 24,
              fontSize: hasPoster ? 30 : 34,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.35,
              maxWidth: 980,
            }}
          >
            {subtitle}
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
          padding: `0 ${padX}px`,
          borderTop: HAIRLINE,
        }}
      >
        <span
          style={{
            fontSize: 19,
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          klaps.space
        </span>
        <span style={{ fontSize: 28, color: "rgba(255,255,255,0.45)" }}>
          →
        </span>
      </div>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontFamily: "Inter",
        }}
      >
        {posterUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt=""
            width={POSTER_WIDTH}
            height={630}
            style={{
              width: POSTER_WIDTH,
              height: 630,
              objectFit: "cover",
              borderRight: HAIRLINE,
            }}
          />
        )}
        {infoColumn}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
