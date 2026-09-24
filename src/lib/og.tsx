import { ImageResponse } from "next/og";
import { getSettings } from "./data";
import { safeHex, contrastOn } from "./color";

export const ogSize = { width: 1200, height: 630 };

/** Carte Open Graph au style du site : fond sombre, grille, titre XXL, accent. */
export async function ogImage({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  const s = await getSettings();
  const accent = safeHex(s.accent);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#0d0d0d",
          color: "#ecebe6",
          backgroundImage: "linear-gradient(90deg, rgba(236,235,230,0.06) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, textTransform: "uppercase", letterSpacing: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                background: "#ecebe6",
                color: "#0d0d0d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {s.name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </div>
            {s.name}
          </div>
          <div style={{ display: "flex", color: "#8d8c87" }}>{kicker}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: title.length > 24 ? 88 : 128, fontWeight: 600, letterSpacing: -4, lineHeight: 0.95 }}>
            {title}
            <span style={{ color: accent }}>.</span>
          </div>
          {subtitle && (
            <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#8d8c87", maxWidth: 900, lineHeight: 1.3 }}>
              {subtitle.length > 140 ? `${subtitle.slice(0, 137)}…` : subtitle}
            </div>
          )}
        </div>
        <div style={{ display: "flex", height: 10, width: 220, background: accent, color: contrastOn(accent) }} />
      </div>
    ),
    ogSize,
  );
}
