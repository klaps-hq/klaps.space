import { ImageResponse } from "next/og";

export const alt = "Klaps - Repertuar seansów specjalnych i klasyki filmowej";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const OgImage = () => {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(to right, transparent, #dc1301, transparent)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(to right, transparent, #dc1301, transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <span
            style={{
              fontSize: "96px",
              fontWeight: 700,
              color: "#dc1301",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Klaps
          </span>

          <div
            style={{
              width: "120px",
              height: "2px",
              backgroundColor: "#dc1301",
            }}
          />

          <span
            style={{
              fontSize: "28px",
              color: "#a3a3a3",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textAlign: "center",
              maxWidth: "700px",
            }}
          >
            Klasyka kina. Lokalnie.
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
};

export default OgImage;
