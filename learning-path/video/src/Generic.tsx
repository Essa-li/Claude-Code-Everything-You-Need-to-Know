import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import VOICE from "./voice.gen.json";
import { C, cn, FPS, mono } from "./theme";
import { Terminal } from "./parts";
import { appear, Bubble, Cam, Caption, Sfx, Slam, shake, TypingSfx } from "./fx";
import type { Card, LessonCfg, SceneCfg, Stamp } from "./lessons";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const s = (sec: number) => Math.round(sec * FPS);
const COLORS = { ok: C.ok, bad: "#c0392b", navy: C.navy, yellow: "#b8860b" } as const;

const Bar: React.FC<{ names: string[]; current: number }> = ({ names, current }) => (
  <div style={{ position: "absolute", top: 26, left: 56, right: 56, display: "flex", alignItems: "center", gap: 10, zIndex: 5 }}>
    {names.map((n, i) => (
      <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: cn, fontSize: 20, fontWeight: 700, padding: "4px 14px", borderRadius: 99, background: i === current ? C.yellow : i < current ? C.navy : "rgba(30,62,112,.10)", color: i === current ? C.ink : i < current ? "#fff" : C.muted }}>
          {i + 1} {n}
        </div>
        {i < names.length - 1 ? <div style={{ width: 22, height: 3, background: i < current ? C.navy : "rgba(30,62,112,.18)", borderRadius: 2 }} /> : null}
      </div>
    ))}
    <div style={{ marginLeft: "auto", fontFamily: cn, fontSize: 16, color: C.muted }}>演示动画 · 界面为示意</div>
  </div>
);

const Light: React.FC<{ names?: string[]; chapter?: number; children: React.ReactNode }> = ({ names, chapter, children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 20%, #ffffff 0%, ${C.bg} 55%, #e4e9f2 100%)`, fontFamily: cn, color: C.ink }}>
    {names && chapter !== undefined ? <Bar names={names} current={chapter} /> : null}
    {children}
  </AbsoluteFill>
);

const Dark: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 25%, #2a4f8a 0%, ${C.navy} 45%, #0d1f3d 100%)`, fontFamily: cn, color: "#fff" }}>
    <div style={{ position: "absolute", top: 28, right: 56, fontSize: 16, opacity: 0.7 }}>演示动画 · 界面为示意</div>
    {children}
  </AbsoluteFill>
);

const StampBox: React.FC<{ st: Stamp; D: number; style?: React.CSSProperties }> = ({ st, D, style }) => {
  const frame = useCurrentFrame();
  const at = Math.round(st.f * D);
  const color = st.color === "bad" ? COLORS.bad : COLORS.ok;
  return (
    <>
      <div style={{ position: "absolute", right: 130, bottom: 150, zIndex: 4, opacity: appear(frame, at), translate: shake(frame, at), ...style }}>
        <div style={{ border: `6px solid ${color}`, color, fontWeight: 900, fontSize: 48, padding: "6px 24px", borderRadius: 14, rotate: "-7deg", background: "rgba(255,255,255,.92)", fontFamily: cn }}>{st.text}</div>
      </div>
      <Sfx at={at} name="ding" volume={0.5} />
    </>
  );
};

const Hook: React.FC<{ L: LessonCfg; D: number }> = ({ L, D }) => {
  const frame = useCurrentFrame();
  const slamAt = Math.round(D * 0.3);
  const swap = Math.round(D * 0.55);
  return (
    <Dark>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ opacity: interpolate(frame, [swap - 12, swap], [1, 0], clamp), display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <Bubble at={8} text={L.hook.bubble} />
          <Slam at={slamAt} text={L.hook.slam} size={140} />
        </div>
        <div style={{ position: "absolute", textAlign: "center", opacity: appear(frame, swap, 12) }}>
          <div style={{ fontSize: 30, opacity: 0.85, letterSpacing: 2 }}>Claude Code 带练课 · 第 {L.n} 课</div>
          <div style={{ fontSize: 80, fontWeight: 900, marginTop: 14 }}>{L.hook.title}</div>
          <div style={{ width: 140, height: 7, background: C.yellow, margin: "26px auto 0", scale: `${interpolate(frame, [swap + 10, swap + 26], [0, 1], clamp)} 1` }} />
        </div>
      </AbsoluteFill>
      <Sfx at={8} name="page-turn" volume={0.5} />
      <Sfx at={slamAt} name="switch" volume={0.7} />
      <Sfx at={swap} name="whoosh" volume={0.6} />
    </Dark>
  );
};

const TermScene: React.FC<{ L: LessonCfg; sc: Extract<SceneCfg, { type: "term" }>; D: number }> = ({ L, sc, D }) => {
  const lines = sc.lines.map((l) => ({ ...l, at: Math.round(l.f * D) }));
  return (
    <Light names={L.chapters} chapter={sc.chapter}>
      <Cam>
        <AbsoluteFill style={{ padding: "100px 120px 130px" }}>
          <Terminal title={sc.title} tag={sc.tag} style={{ height: "100%" }} lines={lines} footer={sc.footer} footerAt={4} />
        </AbsoluteFill>
      </Cam>
      {lines.filter((l) => l.kind === "cmd" || l.kind === "you").map((l, i) => (
        <TypingSfx key={i} at={l.at} frames={Math.min(40, l.typeFrames ?? Math.max(12, l.text.length * 1.2))} />
      ))}
      {lines.filter((l) => l.kind === "ok" || l.kind === "claude").map((l, i) => (
        <Sfx key={`c${i}`} at={l.at} name="switch" volume={0.25} />
      ))}
      {sc.stamp ? <StampBox st={sc.stamp} D={D} /> : null}
      <Caption text={sc.caption} hi={sc.hi} at={6} />
    </Light>
  );
};

const CardsScene: React.FC<{ L: LessonCfg; sc: Extract<SceneCfg, { type: "cards" }>; D: number }> = ({ L, sc, D }) => {
  const frame = useCurrentFrame();
  const n = sc.cards.length;
  const at = (i: number) => Math.round(D * (0.12 + (0.62 * i) / Math.max(1, n - 1)));
  const card = (c: Card, i: number) => {
    const a = at(i);
    const color = COLORS[c.color ?? "navy"];
    const isMono = /^[/A-Za-z]/.test(c.t) && /[A-Za-z]/.test(c.t.slice(0, 4));
    return (
      <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "22px 30px", borderLeft: `10px solid ${color}`, boxShadow: "0 14px 34px rgba(19,42,79,.14)", opacity: appear(frame, a), translate: `${interpolate(frame, [a, a + 12], [70, 0], { ...clamp, easing: out })}px 0px` }}>
        <div style={{ fontSize: 36, fontWeight: 900, color, fontFamily: isMono ? `${mono}` : cn }}>{c.t}</div>
        {c.b ? <div style={{ fontSize: 26, marginTop: 6, color: C.ink, lineHeight: 1.45 }}>{c.b}</div> : null}
      </div>
    );
  };
  return (
    <Light names={L.chapters} chapter={sc.chapter}>
      <AbsoluteFill style={{ padding: "110px 150px 140px", justifyContent: "center", gap: 20 }}>
        <div style={{ fontSize: 44, fontWeight: 900, color: C.navy, opacity: appear(frame, 2), marginBottom: 6 }}>{sc.heading}</div>
        {sc.cards.map(card)}
      </AbsoluteFill>
      {sc.cards.map((_, i) => (
        <Sfx key={i} at={at(i)} name="whoosh" volume={0.4} />
      ))}
      {sc.stamp ? <StampBox st={sc.stamp} D={D} /> : null}
      <Caption text={sc.caption} hi={sc.hi} at={Math.round(D * 0.2)} />
    </Light>
  );
};

const PanelScene: React.FC<{ L: LessonCfg; sc: Extract<SceneCfg, { type: "panel" }>; D: number }> = ({ L, sc, D }) => {
  const frame = useCurrentFrame();
  const sweepAt = Math.round(D * 0.55);
  const sweep = interpolate(frame, [sweepAt, sweepAt + 24], [0, 100], clamp);
  return (
    <Light names={L.chapters} chapter={sc.chapter}>
      <Cam punchAt={sweepAt} punchTo={[50, 60]} punchScale={1.08}>
        <AbsoluteFill style={{ padding: "110px 170px 140px", justifyContent: "center" }}>
          <div style={{ fontSize: 42, fontWeight: 900, color: C.navy, marginBottom: 18, opacity: appear(frame, 2) }}>{sc.heading}</div>
          <div style={{ background: "#fff", borderRadius: 18, padding: "14px 34px", boxShadow: "0 20px 46px rgba(19,42,79,.16)" }}>
            {sc.rows.map(([l, r], i) => (
              <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", gap: 24, padding: "14px 0", borderBottom: i < sc.rows.length - 1 ? "1px solid #e3e8f0" : "none", fontSize: 30, opacity: appear(frame, 8 + i * Math.round(D * 0.08)) }}>
                {sc.hiRows.includes(i) ? <div style={{ position: "absolute", left: -14, top: 6, bottom: 6, width: `calc(${sweep}% + 28px)`, background: "rgba(242,183,5,.34)", borderRadius: 8 }} /> : null}
                <span style={{ fontFamily: sc.mono ? mono : cn, fontWeight: 700, position: "relative" }}>{l}</span>
                <span style={{ color: C.muted, position: "relative" }}>{r}</span>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Cam>
      <Sfx at={sweepAt} name="shutter-modern" volume={0.35} />
      <Caption text={sc.caption} hi={sc.hi} at={6} />
    </Light>
  );
};

const CodeScene: React.FC<{ L: LessonCfg; sc: Extract<SceneCfg, { type: "code" }>; D: number }> = ({ L, sc, D }) => {
  const frame = useCurrentFrame();
  const open = 6;
  const hiAt = Math.round(D * 0.4);
  const hi = interpolate(frame, [hiAt, hiAt + 20], [0, 1], clamp);
  const hiRgb = sc.hiColor === "bad" ? "192,57,43" : "242,183,5";
  return (
    <Light names={L.chapters} chapter={sc.chapter}>
      <Cam punchAt={hiAt} punchTo={[40, 45]} punchScale={1.06}>
        <AbsoluteFill style={{ padding: "100px 110px 140px", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 22px 50px rgba(19,42,79,.18)", opacity: appear(frame, open), scale: `${interpolate(frame, [open, open + 14], [0.92, 1], { ...clamp, easing: out })}` }}>
            <div style={{ background: "#e9eef6", padding: "12px 24px", fontFamily: mono, fontSize: 22, color: C.navy, fontWeight: 700 }}>{sc.file}</div>
            <div style={{ padding: "20px 26px", fontFamily: mono, fontSize: sc.lines.length > 7 ? 22 : 26, lineHeight: 1.8 }}>
              {sc.lines.map((l, i) => (
                <div key={i} style={{ whiteSpace: "pre", padding: "0 8px", borderRadius: 6, minHeight: "1em", background: sc.hiLines.includes(i) ? `rgba(${hiRgb},${0.3 * hi})` : "transparent", color: l.startsWith("//") || l.startsWith("#") ? "#4d5869" : C.ink }}>{l}</div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </Cam>
      <Sfx at={open} name="page-turn" volume={0.45} />
      <Sfx at={hiAt} name="shutter-modern" volume={0.3} />
      {sc.stamp ? <StampBox st={sc.stamp} D={D} /> : null}
      <Caption text={sc.caption} hi={sc.hi} at={10} />
    </Light>
  );
};

const Takeaways: React.FC<{ L: LessonCfg; D: number }> = ({ L, D }) => {
  const frame = useCurrentFrame();
  const at = (i: number) => Math.round(D * (0.2 + i * 0.22));
  return (
    <Dark>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 34 }}>
        <div style={{ fontSize: 40, fontWeight: 700, opacity: appear(frame, 2) }}>记住三件事</div>
        <div style={{ display: "flex", gap: 30 }}>
          {L.takeaways.map(([a, b], i) => (
            <div key={a} style={{ width: 330, background: "#fff", color: C.ink, borderRadius: 22, padding: "30px 26px", textAlign: "center", opacity: appear(frame, at(i)), translate: `0px ${interpolate(frame, [at(i), at(i) + 12], [50, 0], { ...clamp, easing: out })}px` }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: C.yellow, background: C.navy, width: 50, height: 50, borderRadius: 99, display: "grid", placeItems: "center", margin: "0 auto 14px" }}>{i + 1}</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: C.navy, fontFamily: /^[/A-Za-z]/.test(a) ? mono : cn }}>{a}</div>
              <div style={{ fontSize: 30, marginTop: 6 }}>{b}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      {L.takeaways.map((_, i) => (
        <Sfx key={i} at={at(i)} name="whoosh" volume={0.45} />
      ))}
    </Dark>
  );
};

const Quiz: React.FC<{ L: LessonCfg; D: number }> = ({ L, D }) => {
  const frame = useCurrentFrame();
  const c0 = Math.round(D * 0.42);
  const reveal = Math.round(D * 0.66);
  const step = Math.round((reveal - c0) / 3);
  const count = frame < c0 ? null : frame < c0 + step ? "3" : frame < c0 + 2 * step ? "2" : frame < reveal ? "1" : null;
  return (
    <Dark>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 110px" }}>
        <div style={{ fontSize: 30, background: C.yellow, color: C.ink, fontWeight: 900, padding: "6px 22px", borderRadius: 99, opacity: appear(frame, 2) }}>暂停想一想</div>
        <div style={{ fontSize: 54, fontWeight: 900, marginTop: 30, lineHeight: 1.35, opacity: appear(frame, 8) }}>{L.quiz.q}</div>
        <div style={{ height: 180, display: "grid", placeItems: "center", marginTop: 20 }}>
          {count ? <div style={{ fontSize: 140, fontWeight: 900, color: C.yellow, fontFamily: mono }}>{count}</div> : null}
          {frame >= reveal ? (
            <div style={{ background: "#fff", color: C.ink, borderRadius: 18, padding: "18px 34px", fontSize: 40, fontWeight: 900, maxWidth: 1000, scale: `${interpolate(frame, [reveal, reveal + 10], [0.7, 1], { ...clamp, easing: out })}` }}>{L.quiz.a}</div>
          ) : null}
        </div>
      </AbsoluteFill>
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={c0 + i * step} name="mouse-click" volume={0.5} />
      ))}
      <Sfx at={reveal} name="ding" volume={0.55} />
    </Dark>
  );
};

const Outro: React.FC<{ L: LessonCfg }> = ({ L }) => {
  const frame = useCurrentFrame();
  return (
    <Light>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 100px" }}>
        <div style={{ fontSize: 70, fontWeight: 900, color: C.navy, opacity: appear(frame, 0) }}>轮到你动手了</div>
        <div style={{ fontSize: 32, marginTop: 22, opacity: appear(frame, 10) }}>{L.outro}</div>
        <div style={{ width: 140, height: 7, background: C.yellow, marginTop: 30, scale: `${interpolate(frame, [10, 26], [0, 1], clamp)} 1` }} />
      </AbsoluteFill>
      <Sfx at={0} name="ding" volume={0.4} />
    </Light>
  );
};

// Scene order and minimum lengths (seconds); the voice line can make a scene longer.
const ORDER: { name: string; sec: number }[] = [
  { name: "Hook", sec: 8 },
  { name: "S1", sec: 7 },
  { name: "S2", sec: 7 },
  { name: "S3", sec: 7 },
  { name: "S4", sec: 7 },
  { name: "Takeaways", sec: 6 },
  { name: "Quiz", sec: 7 },
  { name: "Outro", sec: 4 },
];
const LEAD = 4;
const T = 10;

const durOf = (id: string) => {
  const v = (VOICE as Record<string, Record<string, number>>)[id] ?? {};
  return (name: string, sec: number) => Math.max(s(sec), v[name] ? LEAD + Math.ceil((v[name] / 1000 + 0.5) * FPS) : 0) + T;
};

export const framesFor = (id: string) => {
  const d = durOf(id);
  return ORDER.reduce((n, x) => n + d(x.name, x.sec), 0) - T * (ORDER.length - 1);
};

const renderScene = (L: LessonCfg, name: string, D: number) => {
  if (name === "Hook") return <Hook L={L} D={D} />;
  if (name === "Takeaways") return <Takeaways L={L} D={D} />;
  if (name === "Quiz") return <Quiz L={L} D={D} />;
  if (name === "Outro") return <Outro L={L} />;
  const sc = L.scenes[Number(name.slice(1)) - 1];
  if (sc.type === "term") return <TermScene L={L} sc={sc} D={D} />;
  if (sc.type === "cards") return <CardsScene L={L} sc={sc} D={D} />;
  if (sc.type === "panel") return <PanelScene L={L} sc={sc} D={D} />;
  return <CodeScene L={L} sc={sc} D={D} />;
};

export const GenericLesson: React.FC<{ L: LessonCfg }> = ({ L }) => {
  const d = durOf(L.id);
  const v = (VOICE as Record<string, Record<string, number>>)[L.id] ?? {};
  return (
    <TransitionSeries>
      {ORDER.flatMap((x, i) => {
        const D = d(x.name, x.sec);
        const seq = (
          <TransitionSeries.Sequence key={x.name} name={x.name} durationInFrames={D}>
            {renderScene(L, x.name, D - T)}
            {v[x.name] ? (
              <Sequence from={LEAD} name={`Voice ${x.name}`}>
                <Audio src={staticFile(`voice/${L.id}/${x.name}.mp3`)} />
              </Sequence>
            ) : null}
          </TransitionSeries.Sequence>
        );
        if (i === 0) return [seq];
        const dark = x.name === "Takeaways" || x.name === "Quiz";
        return [<TransitionSeries.Transition key={`t-${x.name}`} presentation={dark ? fade() : slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: T })} />, seq];
      })}
    </TransitionSeries>
  );
};
