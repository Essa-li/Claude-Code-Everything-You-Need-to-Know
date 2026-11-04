import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, cn, mono } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);

export const appear = (frame: number, at: number, len = 10) => interpolate(frame, [at, at + len], [0, 1], { ...clamp, easing: out });

/** Plays a local sound effect at a frame. */
export const Sfx: React.FC<{ at: number; name: "whoosh" | "mouse-click" | "ding" | "switch" | "shutter-modern" | "page-turn"; volume?: number }> = ({ at, name, volume = 0.5 }) => (
  <Sequence from={at} durationInFrames={60} name={`sfx ${name}`}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

/** Typing clicks: one soft click every few frames while a line is being typed. */
export const TypingSfx: React.FC<{ at: number; frames: number; every?: number }> = ({ at, frames, every = 4 }) => (
  <>
    {Array.from({ length: Math.max(1, Math.floor(frames / every)) }, (_, i) => (
      <Sfx key={i} at={at + i * every} name="mouse-click" volume={0.12} />
    ))}
  </>
);

/** Slow push-in, with an optional punch toward a point at a given frame. */
export const Cam: React.FC<{ children: React.ReactNode; punchAt?: number; punchTo?: [number, number]; punchScale?: number }> = ({ children, punchAt, punchTo = [50, 50], punchScale = 1.35 }) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 300], [1, 1.04], clamp);
  const punch = punchAt === undefined ? 1 : interpolate(frame, [punchAt, punchAt + 14], [1, punchScale], { ...clamp, easing: out });
  return (
    <AbsoluteFill style={{ transformOrigin: `${punchTo[0]}% ${punchTo[1]}%`, scale: `${drift * punch}` }}>{children}</AbsoluteFill>
  );
};

/** A small shake for impact moments. */
export const shake = (frame: number, at: number) => {
  const t = frame - at;
  if (t < 0 || t > 10) return "0px 0px";
  const a = (10 - t) * 1.6;
  return `${Math.sin(t * 2.7) * a}px ${Math.cos(t * 3.1) * a}px`;
};

/** Top bar: four chapters, the current one lit, plus the "demo" label. */
export const ChapterBar: React.FC<{ current: number }> = ({ current }) => {
  const names = ["安装", "启动", "看清", "核对"];
  return (
    <div style={{ position: "absolute", top: 26, left: 56, right: 56, display: "flex", alignItems: "center", gap: 10, zIndex: 5 }}>
      {names.map((n, i) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              fontFamily: cn, fontSize: 20, fontWeight: 700, padding: "4px 14px", borderRadius: 99,
              background: i === current ? C.yellow : i < current ? C.navy : "rgba(30,62,112,.10)",
              color: i === current ? C.ink : i < current ? "#fff" : C.muted,
            }}
          >
            {i + 1} {n}
          </div>
          {i < names.length - 1 ? <div style={{ width: 22, height: 3, background: i < current ? C.navy : "rgba(30,62,112,.18)", borderRadius: 2 }} /> : null}
        </div>
      ))}
      <div style={{ marginLeft: "auto", fontFamily: cn, fontSize: 16, color: C.muted }}>演示动画 · 界面为示意</div>
    </div>
  );
};

/** Bottom caption with a highlighted keyword. */
export const Caption: React.FC<{ text: string; hi?: string; at?: number }> = ({ text, hi, at = 4 }) => {
  const frame = useCurrentFrame();
  const parts = hi && text.includes(hi) ? text.split(hi) : [text];
  return (
    <div
      style={{
        position: "absolute", left: 120, right: 120, bottom: 34, textAlign: "center", zIndex: 5,
        fontFamily: cn, fontSize: 30, fontWeight: 700, color: "#fff", lineHeight: 1.4,
        background: "rgba(15,21,32,.82)", borderRadius: 12, padding: "10px 22px",
        opacity: appear(frame, at), translate: `0px ${interpolate(frame, [at, at + 12], [14, 0], { ...clamp, easing: out })}px`,
      }}
    >
      {parts.length === 2 ? (
        <>
          {parts[0]}
          <span style={{ color: C.yellow }}>{hi}</span>
          {parts[1]}
        </>
      ) : (
        text
      )}
    </div>
  );
};

/** Big kinetic word that slams in. */
export const Slam: React.FC<{ text: string; at: number; color?: string; size?: number; style?: React.CSSProperties }> = ({ text, at, color = C.yellow, size = 120, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: cn, fontWeight: 900, fontSize: size, color, lineHeight: 1.1, opacity: frame >= at ? 1 : 0,
        scale: `${interpolate(frame, [at, at + 8, at + 14], [2.2, 0.94, 1], clamp)}`, translate: shake(frame, at + 6), ...style,
      }}
    >
      {text}
    </div>
  );
};

/** A chat bubble from Claude. */
export const Bubble: React.FC<{ text: string; at: number; style?: React.CSSProperties }> = ({ text, at, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        background: "#fff", color: C.ink, borderRadius: 22, borderBottomLeftRadius: 6, padding: "20px 28px", fontFamily: cn, fontSize: 36, fontWeight: 700,
        boxShadow: "0 20px 50px rgba(0,0,0,.25)", opacity: appear(frame, at), scale: `${interpolate(frame, [at, at + 12], [0.85, 1], { ...clamp, easing: out })}`, ...style,
      }}
    >
      <span style={{ fontFamily: mono, fontSize: 22, color: C.muted, display: "block", marginBottom: 6 }}>Claude</span>
      {text}
    </div>
  );
};
