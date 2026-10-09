import { ImageResponse } from "next/og";

export const alt = "Continent Aviation. Private Aviation, Arranged Around You.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px", background: "linear-gradient(160deg,#080B10 0%,#101A2A 100%)", color: "#F5F2EA", fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 10, color: "#C8A96B" }}>CONTINENT AVIATION</div>
        <div style={{ display: "flex", width: 72, height: 2, background: "#C8A96B", margin: "36px 0" }} />
        <div style={{ display: "flex", fontSize: 84, lineHeight: 1.05 }}>Private Aviation, Arranged Around You.</div>
      </div>
    ),
    size,
  );
}
