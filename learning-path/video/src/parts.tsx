import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, cn, mono } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const fadeIn = (frame: number, start: number, len = 12) =>
  interpolate(frame, [start, start + len], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

/** Scene frame: light background, step label top-left, "demo" badge top-right, caption bottom. */
export const Scene: React.FC<{ step?: string; caption: string; children: React.ReactNode }> = ({ step, caption, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: cn, color: C.ink }}>
      <div style={{ position: "absolute", top: 34, left: 64, right: 64, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.navy, opacity: fadeIn(frame, 0) }}>{step ?? ""}</div>
        <div style={{ fontSize: 18, color: C.muted, border: `1.5px solid ${C.muted}`, borderRadius: 99, padding: "2px 14px" }}>演示动画 · 界面为示意，非真实录屏</div>
      </div>
      <AbsoluteFill style={{ top: 96, bottom: 178, left: 64, right: 64, width: "auto", height: "auto" }}>{children}</AbsoluteFill>
      <div
        style={{
          position: "absolute", left: 64, right: 64, bottom: 40, minHeight: 84, display: "flex", alignItems: "center",
          background: C.navy, color: "#fff", borderRadius: 14, padding: "14px 26px", fontSize: 30, lineHeight: 1.45, fontWeight: 500,
          opacity: fadeIn(frame, 4), translate: `0px ${interpolate(frame, [4, 18], [16, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
};

export type Line = { at: number; text: string; kind?: "cmd" | "out" | "ok" | "dim" | "you" | "claude"; typeFrames?: number };

/** A terminal window. Lines appear at their frame; "cmd" and "you" lines are typed out. */
export const Terminal: React.FC<{ title: string; tag: "A" | "B"; lines: Line[]; style?: React.CSSProperties; footer?: string; footerAt?: number }> = ({ title, tag, lines, style, footer, footerAt = 0 }) => {
  const frame = useCurrentFrame();
  const tagColor = tag === "A" ? C.winA : C.winB;
  return (
    <div style={{ background: C.term, borderRadius: 14, overflow: "hidden", boxShadow: "0 18px 40px rgba(19,42,79,.18)", display: "flex", flexDirection: "column", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: "#1a2333" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c, display: "inline-block" }} />
        ))}
        <span style={{ marginLeft: 12, fontSize: 18, fontWeight: 700, color: tagColor, border: `1.5px solid ${tagColor}`, borderRadius: 99, padding: "0 12px" }}>{title}</span>
      </div>
      <div style={{ padding: "18px 22px", fontFamily: mono, fontSize: 24, lineHeight: 1.6, color: C.termText, flex: 1 }}>
        {lines.map((l, i) => {
          if (frame < l.at) return null;
          const typed = l.kind === "cmd" || l.kind === "you";
          const n = typed ? Math.floor(interpolate(frame, [l.at, l.at + (l.typeFrames ?? Math.max(12, l.text.length * 1.2))], [0, l.text.length], clamp)) : l.text.length;
          const color = l.kind === "ok" ? C.ok : l.kind === "dim" ? C.termDim : l.kind === "claude" ? "#f0c674" : C.termText;
          const prefix = l.kind === "cmd" ? "$ " : l.kind === "you" ? "> " : "";
          const typing = typed && n < l.text.length;
          return (
            <div key={i} style={{ color, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              <span style={{ color: l.kind === "cmd" ? C.ok : C.winA }}>{prefix}</span>
              {l.text.slice(0, n)}
              {typing ? <span style={{ background: C.termText, color: C.term }}> </span> : null}
            </div>
          );
        })}
      </div>
      {footer ? (
        <div style={{ padding: "8px 22px 14px", fontFamily: mono, fontSize: 20, color: C.termDim, opacity: fadeIn(frame, footerAt) }}>{footer}</div>
      ) : null}
    </div>
  );
};

export const Key: React.FC<{ k: string; at: number }> = ({ k, at }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [at, at + 6, at + 14], [0.6, 1.12, 1], clamp);
  return (
    <span
      style={{
        display: "inline-block", fontFamily: mono, fontWeight: 700, fontSize: 30, padding: "8px 22px", borderRadius: 10,
        background: "#fff", color: C.navy, border: `3px solid ${C.navy}`, boxShadow: `0 5px 0 ${C.navy}`,
        opacity: frame >= at ? 1 : 0, scale: `${pop}`,
      }}
    >
      {k}
    </span>
  );
};
