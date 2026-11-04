import { continueRender, delayRender, staticFile } from "remotion";
import { FACES } from "./fonts.gen";

// Fonts are local files (see scripts/pick-fonts.mjs); rendering waits until all load.
if (typeof document !== "undefined") {
  const handle = delayRender("Loading local fonts");
  Promise.all(
    FACES.map((f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, { weight: f.weight, unicodeRange: f.range });
      document.fonts.add(face);
      return face.load();
    }),
  ).then(() => continueRender(handle), (e) => { console.error(e); continueRender(handle); });
}

export const cn = '"Noto Sans SC", "PingFang SC", sans-serif';
export const mono = '"JetBrains Mono", "Noto Sans SC", monospace';

export const C = {
  navy: "#1E3E70",
  navyDeep: "#132a4f",
  yellow: "#F2B705",
  bg: "#f3f5f9",
  ink: "#1b2433",
  muted: "#5d6879",
  term: "#0f1520",
  termText: "#dfe6f1",
  termDim: "#7f8ba0",
  ok: "#3fb27f",
  winA: "#8fb0e6",
  winB: "#b9a2e8",
};

export const FPS = 30;
