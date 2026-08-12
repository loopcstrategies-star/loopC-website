import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LoopC Business Strategies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #050b16 0%, #0b1224 48%, #134e4a 100%)",
          color: "#ffffff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          LoopC Business Strategies · OMR, Chennai
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.08, maxWidth: 980 }}>
            We build software around your business.
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, maxWidth: 900, opacity: 0.9, marginTop: 24 }}>
            Mobile apps. Websites. Web applications. Dashboards. Custom software.
          </div>
        </div>
        <div style={{ fontSize: 22, opacity: 0.8 }}>Software development company · Chennai</div>
      </div>
    ),
    { ...size },
  );
}
