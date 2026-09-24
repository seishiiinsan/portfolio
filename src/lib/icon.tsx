import { ImageResponse } from "next/og";
import { getSettings } from "./data";
import { contrastOn, safeHex } from "./color";

/** Icône : initiales sur la couleur d'accent. */
export async function iconImage(px: number) {
  const s = await getSettings();
  const accent = safeHex(s.accent);
  const initials = s.name
    .split(" ")
    .map((p) => p[0])
    .join("");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: accent,
          color: contrastOn(accent),
          fontSize: px * 0.42,
          fontWeight: 700,
          letterSpacing: -px * 0.02,
        }}
      >
        {initials}
      </div>
    ),
    { width: px, height: px },
  );
}
