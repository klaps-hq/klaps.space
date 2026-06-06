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

// Sized so text stays legible when scaled down to small link embeds
// (Discord/Slack render OG images at roughly 440px wide).
const getTitleSize = (title: string, hasPoster: boolean): number => {
  const base = hasPoster ? 0.82 : 1;
  if (title.length > 24) return Math.round(72 * base);
  if (title.length > 14) return Math.round(96 * base);
  if (title.length > 9) return Math.round(112 * base);
  return Math.round(136 * base);
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

  const titleSize = getTitleSize(title, Boolean(posterUrl));
  const padX = posterUrl ? 56 : 64;

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
                  fontSize: 20,
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
              justifyContent: "flex-end",
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
                  marginTop: 28,
                  fontSize: 34,
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

        {posterUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt=""
            width={420}
            height={630}
            style={{
              width: 420,
              height: 630,
              objectFit: "cover",
              borderLeft: HAIRLINE,
            }}
          />
        )}
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
