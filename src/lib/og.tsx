import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = { width: 1200, height: 630 };

const fontsDir = join(process.cwd(), "assets/fonts");

async function loadFonts() {
  const [geist, serif] = await Promise.all([
    readFile(join(fontsDir, "Geist-SemiBold.ttf")),
    readFile(join(fontsDir, "InstrumentSerif-Italic.ttf")),
  ]);
  return [
    { name: "Geist", data: geist, weight: 600 as const, style: "normal" as const },
    { name: "Instrument Serif", data: serif, weight: 400 as const, style: "italic" as const },
  ];
}

type OgOptions = {
  eyebrow: string;
  title: string;
  accent: string;
  facts: string[];
};

/** Shared social card: dark editorial layout with the site's accent. */
export async function renderOgImage({ eyebrow, title, accent, facts }: OgOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0a0a0c",
          backgroundImage:
            "radial-gradient(circle at 88% 8%, rgba(120,104,255,0.42), transparent 42%), radial-gradient(circle at 0% 100%, rgba(170,110,255,0.18), transparent 40%)",
          color: "#ececf1",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 999,
              background: "#ececf1",
              color: "#0a0a0c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            AS
          </div>
          <div style={{ fontSize: 24, color: "#a6a6b2", letterSpacing: 4, textTransform: "uppercase" }}>
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 108, letterSpacing: -5, lineHeight: 1 }}>{title}</div>
          <div
            style={{
              marginTop: 22,
              fontSize: 54,
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              color: "#b3abff",
              lineHeight: 1.1,
            }}
          >
            {accent}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {facts.map((fact) => (
            <div
              key={fact}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.04)",
                fontSize: 24,
                color: "#d4d4dc",
              }}
            >
              {fact}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...ogSize, fonts: await loadFonts() },
  );
}

/** Square monogram used for favicons and the Apple touch icon. */
export async function renderMonogram(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0c0f",
          borderRadius: size >= 128 ? 0 : size / 2,
          color: "#f6f6f2",
          fontFamily: "Geist",
          fontSize: size * 0.4,
          letterSpacing: -size * 0.02,
        }}
      >
        AS
      </div>
    ),
    { width: size, height: size, fonts: [(await loadFonts())[0]] },
  );
}
