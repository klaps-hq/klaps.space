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
  photoUrl?: string | null;
}

// The poster sits as a framed card inside a left panel rather than bleeding
// full-height: the panel sets the column width, the card keeps a true 2:3
// movie-poster ratio so it never looks cropped or oversized.
const POSTER_PANEL_WIDTH = 400;
const POSTER_CARD_WIDTH = 288;
const POSTER_CARD_HEIGHT = 432; // 2:3 ratio

// Landscape photos (blog covers) bleed full-height in a right panel instead:
// a portrait card would crop them too aggressively.
const PHOTO_PANEL_WIDTH = 470;
const HEADER_HEIGHT = 92;
const FOOTER_HEIGHT = 72;
const BODY_HEIGHT = OG_SIZE.height - HEADER_HEIGHT - FOOTER_HEIGHT;

// Sized so text stays legible when scaled down to small link embeds
// (Discord/Slack/Messenger render OG images at roughly 440px wide).
// With a poster the text column is narrower, so cap sizes to keep the
// longest word from clipping; full width otherwise.
const getTitleSize = (title: string, hasPoster: boolean): number => {
  if (hasPoster) {
    if (title.length > 44) return 48;
    if (title.length > 24) return 60;
    if (title.length > 16) return 72;
    if (title.length > 10) return 84;
    return 96;
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
  photoUrl,
}: OgImageOptions) {
  const [regular, bold] = await Promise.all([
    readFile(path.join(process.cwd(), "src/assets/fonts/Inter-Regular.ttf")),
    readFile(path.join(process.cwd(), "src/assets/fonts/Inter-Bold.ttf")),
  ]);

  // Either side panel narrows the text column the same way.
  const hasImage = Boolean(posterUrl || photoUrl);
  const titleSize = getTitleSize(title, hasImage);
  const padX = hasImage ? 52 : 64;
  // With a side image the body is centered in its column; otherwise the
  // text sits at the bottom of the full-width canvas.
  const bodyJustify = hasImage ? "center" : "flex-end";

  // Top and bottom bars span the full width so the logo and the footer line
  // always sit flush to the left edge, regardless of the poster.
  const headerBar = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: HEADER_HEIGHT,
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
            fontSize: hasImage ? 18 : 20,
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {eyebrow}
        </span>
      )}
    </div>
  );

  const footerBar = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: FOOTER_HEIGHT,
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
      {/* Inline lucide "arrow-right" path: Satori rasterizes inline SVG but
          does not reliably render the lucide-react component, so the icon is
          hand-inlined with an explicit stroke color (no currentColor). */}
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </div>
  );

  const textBody = (
    <div
      style={{
        display: "flex",
        flex: 1,
        minWidth: 0,
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
            fontSize: hasImage ? 30 : 34,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.35,
            maxWidth: 980,
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontFamily: "Inter",
        }}
      >
        {headerBar}
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          {posterUrl && (
            <div
              style={{
                display: "flex",
                width: POSTER_PANEL_WIDTH,
                alignItems: "center",
                justifyContent: "center",
                borderRight: HAIRLINE,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={posterUrl}
                alt=""
                width={POSTER_CARD_WIDTH}
                height={POSTER_CARD_HEIGHT}
                style={{
                  width: POSTER_CARD_WIDTH,
                  height: POSTER_CARD_HEIGHT,
                  objectFit: "cover",
                  border: HAIRLINE,
                }}
              />
            </div>
          )}
          {textBody}
          {photoUrl && (
            <div
              style={{
                display: "flex",
                width: PHOTO_PANEL_WIDTH,
                borderLeft: HAIRLINE,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt=""
                width={PHOTO_PANEL_WIDTH}
                height={BODY_HEIGHT}
                style={{
                  width: PHOTO_PANEL_WIDTH,
                  height: BODY_HEIGHT,
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>
        {footerBar}
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
