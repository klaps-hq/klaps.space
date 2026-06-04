import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

interface OgImageOptions {
  title: string;
  subtitle?: string;
}

export async function buildOgImage({ title, subtitle }: OgImageOptions) {
  const [regular, bold] = await Promise.all([
    readFile(path.join(process.cwd(), "src/assets/fonts/Inter-Regular.ttf")),
    readFile(path.join(process.cwd(), "src/assets/fonts/Inter-Bold.ttf")),
  ]);

  const titleSize = title.length > 14 ? 76 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: "72px 80px",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="38" height="27" viewBox="0 0 28 20">
            <polygon points="0,8 28,0 28,20 0,12" fill="#ffffff" />
          </svg>
          <span
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            klaps
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              maxWidth: 1040,
            }}
          >
            {title}
          </span>
          {subtitle && (
            <span
              style={{
                marginTop: 26,
                fontSize: 30,
                color: "rgba(255,255,255,0.6)",
                maxWidth: 960,
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </span>
          )}
          <span
            style={{
              marginTop: 44,
              fontSize: 20,
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            klaps.space
          </span>
        </div>
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
