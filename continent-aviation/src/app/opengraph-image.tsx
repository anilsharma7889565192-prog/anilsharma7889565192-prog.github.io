import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const alt = "Continent Aviation. Private Aviation, Arranged Around You.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default function Image() {
  let bg = "";
  try {
    bg = `data:image/jpeg;base64,${fs.readFileSync(path.join(process.cwd(), "public/images/hero-jet-dusk.jpg")).toString("base64")}`;
  } catch {}
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#080B10", color: "#F5F2EA", fontFamily: "Georgia, serif" }}>
        {bg && <img src={bg} width={1200} height={675} style={{ position: "absolute", top: -20, left: 0, width: 1200, height: 675, objectFit: "cover" }} alt="" />}
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(90deg, rgba(8,11,16,0.92) 0%, rgba(8,11,16,0.55) 55%, rgba(8,11,16,0.1) 100%)" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", width: 760 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 9, color: "#C8A96B" }}>CONTINENT AVIATION</div>
          <div style={{ display: "flex", width: 64, height: 2, background: "#C8A96B", margin: "30px 0" }} />
          <div style={{ display: "flex", fontSize: 70, lineHeight: 1.05 }}>Private Aviation, Arranged Around You.</div>
          <div style={{ display: "flex", fontSize: 24, marginTop: 28, color: "rgba(245,242,234,0.75)", fontFamily: "Arial, sans-serif" }}>Private jet and helicopter charter arrangements in India</div>
        </div>
      </div>
    ),
    size,
  );
}
