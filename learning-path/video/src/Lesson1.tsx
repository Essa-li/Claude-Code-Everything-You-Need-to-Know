import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import VOICE from "./voice.gen.json";
import { C, cn, FPS, mono } from "./theme";
import { Terminal, Key } from "./parts";
import { appear, Bubble, Cam, Caption, ChapterBar, Sfx, Slam, shake, TypingSfx } from "./fx";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const s = (sec: number) => Math.round(sec * FPS);

const Light: React.FC<{ chapter?: number; children: React.ReactNode }> = ({ chapter, children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 20%, #ffffff 0%, ${C.bg} 55%, #e4e9f2 100%)`, fontFamily: cn, color: C.ink }}>
    {chapter !== undefined ? <ChapterBar current={chapter} /> : null}
    {children}
  </AbsoluteFill>
);

const Dark: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 25%, #2a4f8a 0%, ${C.navy} 45%, #0d1f3d 100%)`, fontFamily: cn, color: "#fff" }}>
    <div style={{ position: "absolute", top: 28, right: 56, fontSize: 16, opacity: 0.7 }}>演示动画 · 界面为示意</div>
    {children}
  </AbsoluteFill>
);

// 1 · Hook: a confident AI answer, then "真的吗？"
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const t = (sec: number) => s(sec);
  return (
    <Dark>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 34 }}>
        <div style={{ opacity: interpolate(frame, [t(5.8), t(6.3)], [1, 0], clamp), display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <Bubble at={t(0.3)} text="这份客户资料我核对过了，没有问题。" />
          <Slam at={t(3.8)} text="真的吗？" color={C.yellow} size={150} />
        </div>
        <div style={{ position: "absolute", textAlign: "center", opacity: appear(frame, t(6.3), 12) }}>
          <div style={{ fontSize: 30, opacity: 0.85, letterSpacing: 2 }}>Claude Code 带练课 · 第 1 课</div>
          <div style={{ fontSize: 84, fontWeight: 900, marginTop: 14 }}>装好它，再学会核对它</div>
          <div style={{ width: 140, height: 7, background: C.yellow, margin: "26px auto 0", scale: `${interpolate(frame, [t(6.7), t(7.3)], [0, 1], clamp)} 1` }} />
        </div>
      </AbsoluteFill>
      <Sfx at={t(0.3)} name="page-turn" volume={0.5} />
      <Sfx at={t(3.8)} name="switch" volume={0.7} />
      <Sfx at={t(6.3)} name="whoosh" volume={0.6} />
    </Dark>
  );
};

// 2 · Install
const Install: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Light chapter={0}>
      <Cam punchAt={s(3.6)} punchTo={[30, 45]} punchScale={1.18}>
        <AbsoluteFill style={{ padding: "100px 120px 130px" }}>
          <Terminal
            title="窗口 B · 终端"
            tag="B"
            style={{ height: "100%" }}
            lines={[
              { at: 6, kind: "cmd", text: "curl -fsSL https://claude.ai/install.sh | bash", typeFrames: 30 },
              { at: 42, kind: "dim", text: "（装好后，新开一个终端窗口）" },
              { at: s(2.6), kind: "cmd", text: "claude --version", typeFrames: 16 },
              { at: s(3.6), kind: "ok", text: "X.Y.Z (Claude Code)" },
            ]}
          />
        </AbsoluteFill>
      </Cam>
      <div style={{ position: "absolute", right: 150, top: 330, opacity: appear(frame, s(3.8)), translate: shake(frame, s(3.8)) }}>
        <div style={{ background: C.ok, color: "#fff", fontWeight: 900, fontSize: 44, padding: "10px 26px", borderRadius: 14, rotate: "-6deg" }}>装好了</div>
      </div>
      <TypingSfx at={6} frames={30} />
      <TypingSfx at={s(2.6)} frames={16} />
      <Sfx at={s(3.8)} name="ding" volume={0.5} />
      <Caption text="一行命令装好，看到版本号就成功" hi="版本号" />
    </Light>
  );
};

// 3 · Start and the trust dialog
const Start: React.FC = () => {
  const frame = useCurrentFrame();
  const card = (title: string, body: string, color: string, at: number) => (
    <div style={{ background: "#fff", borderRadius: 16, padding: "22px 26px", borderLeft: `10px solid ${color}`, boxShadow: "0 14px 34px rgba(19,42,79,.14)", opacity: appear(frame, at), translate: `${interpolate(frame, [at, at + 12], [60, 0], { ...clamp, easing: out })}px 0px` }}>
      <div style={{ fontSize: 32, fontWeight: 900, color }}>{title}</div>
      <div style={{ fontSize: 26, marginTop: 6, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
  return (
    <Light chapter={1}>
      <AbsoluteFill style={{ padding: "100px 70px 130px", flexDirection: "row", gap: 30 }}>
        <Terminal
          title="窗口 A · Claude Code"
          tag="A"
          style={{ flex: 1 }}
          lines={[
            { at: 6, kind: "cmd", text: "cd ~/claude-code-practice/project", typeFrames: 24 },
            { at: 36, kind: "cmd", text: "claude", typeFrames: 8 },
            { at: 52, kind: "dim", text: "→ 浏览器里完成登录" },
            { at: 70, kind: "out", text: "┌ 信任这个文件夹吗？" },
          ]}
          footer="⏵⏵ auto mode on"
          footerAt={s(12)}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22, justifyContent: "center" }}>
          <div style={{ fontSize: 34, fontWeight: 900, color: C.navy, opacity: appear(frame, 74) }}>信任对话框：先别急着回车</div>
          {card("自己的仓库", "读完对话框，再选信任", C.ok, s(7.0))}
          {card("别人的仓库", "先退出，读一遍它的 .claude/ 设置", "#c0392b", s(9.6))}
        </div>
      </AbsoluteFill>
      <TypingSfx at={6} frames={24} />
      <Sfx at={74} name="switch" volume={0.4} />
      <Sfx at={s(7.0)} name="whoosh" volume={0.4} />
      <Sfx at={s(9.6)} name="whoosh" volume={0.4} />
      <Caption text="信任后，仓库的设置就能给 Claude 授权" hi="授权" at={s(1.2)} />
    </Light>
  );
};

// 4 · /status
const Status: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = ["Version", "Model", "Login method", "Email"];
  const sweep = interpolate(frame, [s(3.2), s(4.2)], [0, 100], clamp);
  return (
    <Light chapter={2}>
      <Cam punchAt={s(3.0)} punchTo={[50, 70]} punchScale={1.12}>
        <AbsoluteFill style={{ padding: "100px 180px 130px", justifyContent: "center" }}>
          <div style={{ fontFamily: mono, fontSize: 40, color: C.navy, fontWeight: 700, marginBottom: 18, opacity: appear(frame, 4) }}>&gt; /status</div>
          <div style={{ background: "#fff", borderRadius: 18, padding: "18px 34px", boxShadow: "0 20px 46px rgba(19,42,79,.16)" }}>
            {rows.map((r, i) => (
              <div key={r} style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 3 ? "1px solid #e3e8f0" : "none", fontSize: 32, opacity: appear(frame, 14 + i * 6) }}>
                {i >= 2 ? <div style={{ position: "absolute", left: -12, top: 6, bottom: 6, width: `calc(${sweep}% + 24px)`, background: "rgba(242,183,5,.32)", borderRadius: 8 }} /> : null}
                <span style={{ fontFamily: mono, fontWeight: 700, position: "relative" }}>{r}</span>
                <span style={{ color: C.muted, position: "relative" }}>{["版本", "模型", "登录方式", "账号"][i]}</span>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Cam>
      <TypingSfx at={4} frames={10} />
      <Sfx at={s(3.2)} name="shutter-modern" volume={0.35} />
      <Caption text="和同事不一样时，先对比账号这几行" hi="账号" />
    </Light>
  );
};

// 5 · Esc
const Esc: React.FC = () => {
  const frame = useCurrentFrame();
  const stop = s(2.0);
  const text = "这个项目是一个检查 Markdown 链接的工具，它会扫描文件夹里的每个链接，然后……";
  const n = Math.floor(interpolate(frame, [6, stop], [0, 34], clamp));
  return (
    <Light chapter={2}>
      <AbsoluteFill style={{ padding: "100px 120px 130px", translate: shake(frame, stop) }}>
        <Terminal title="窗口 A · Claude Code" tag="A" style={{ height: "100%" }} lines={[{ at: 0, kind: "you", text: "what does this project do?", typeFrames: 1 }]} />
        <div style={{ position: "absolute", left: 160, right: 160, top: 220, fontSize: 30, color: "#f0c674", fontFamily: cn, lineHeight: 1.6 }}>● {text.slice(0, n)}</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: appear(frame, stop, 4) }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, background: "rgba(15,21,32,.88)", padding: "40px 70px", borderRadius: 26 }}>
          <div style={{ scale: `${interpolate(frame, [stop, stop + 6, stop + 12], [2.4, 0.9, 1.6], clamp)}` }}>
            <Key k="Esc" at={stop} />
          </div>
          <div style={{ fontSize: 64, fontWeight: 900, color: "#fff", marginTop: 26 }}>立刻停下</div>
        </div>
      </AbsoluteFill>
      <Sfx at={stop} name="switch" volume={0.8} />
      <Caption text="跑偏了就按 Esc，做好的部分还在" hi="Esc" at={s(2.6)} />
    </Light>
  );
};

// 6 · Verify with evidence
const Verify: React.FC = () => {
  const frame = useCurrentFrame();
  const code = [
    "// Parses linkcheck.json. Every field is optional:",
    "//   files:  files or folders to scan for Markdown links (default [\".\"])",
    "//   ignore: link targets to skip, matched as prefixes (default [])",
    "export const DEFAULTS = { files: ['.'], ignore: [] };",
  ];
  const open = s(2.6);
  const hi = interpolate(frame, [s(4.4), s(5.2)], [0, 1], clamp);
  return (
    <Light chapter={3}>
      <AbsoluteFill style={{ padding: "100px 90px 130px", justifyContent: "center" }}>
        <div style={{ opacity: interpolate(frame, [open - 6, open], [1, 0], clamp), alignSelf: "center" }}>
          <Bubble at={4} text="解析 linkcheck.json 的是 src/config.js" style={{ background: C.navy, color: "#fff" }} />
        </div>
        <div style={{ position: "absolute", left: 90, right: 90, top: 120, background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 22px 50px rgba(19,42,79,.18)", opacity: appear(frame, open), scale: `${interpolate(frame, [open, open + 14], [0.9, 1], { ...clamp, easing: out })}` }}>
          <div style={{ background: "#e9eef6", padding: "12px 24px", fontFamily: mono, fontSize: 22, color: C.navy, fontWeight: 700 }}>src/config.js · 练习仓库里的真实文件</div>
          <div style={{ padding: "22px 26px", fontFamily: mono, fontSize: 23, lineHeight: 1.9 }}>
            {code.map((l, i) => (
              <div key={i} style={{ whiteSpace: "pre", padding: "0 8px", borderRadius: 6, background: i < 3 ? `rgba(242,183,5,${0.3 * hi})` : "transparent", color: i < 3 ? "#4d5869" : C.ink }}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", right: 120, bottom: 150, opacity: appear(frame, s(5.6)), translate: shake(frame, s(5.6)) }}>
          <div style={{ border: `6px solid ${C.ok}`, color: C.ok, fontWeight: 900, fontSize: 52, padding: "6px 24px", borderRadius: 14, rotate: "-8deg", background: "rgba(255,255,255,.9)" }}>有证据 ✓</div>
        </div>
      </AbsoluteFill>
      <Sfx at={open} name="page-turn" volume={0.5} />
      <Sfx at={s(5.6)} name="ding" volume={0.5} />
      <Caption text="它说什么，就打开对应的文件看一眼" hi="打开对应的文件" at={s(0.6)} />
    </Light>
  );
};

// 7 · Three takeaways
const Takeaways: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    ["只信任", "认识的仓库"],
    ["/status", "看清账号"],
    ["Esc 叫停", "拿证据核对"],
  ];
  return (
    <Dark>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 34 }}>
        <div style={{ fontSize: 40, fontWeight: 700, opacity: appear(frame, 2) }}>记住三件事</div>
        <div style={{ display: "flex", gap: 30 }}>
          {items.map(([a, b], i) => {
            const at = s(1.0 + i * 1.5);
            return (
              <div key={a} style={{ width: 320, background: "#fff", color: C.ink, borderRadius: 22, padding: "30px 26px", textAlign: "center", opacity: appear(frame, at), translate: `0px ${interpolate(frame, [at, at + 12], [50, 0], { ...clamp, easing: out })}px` }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: C.yellow, background: C.navy, width: 50, height: 50, borderRadius: 99, display: "grid", placeItems: "center", margin: "0 auto 14px" }}>{i + 1}</div>
                <div style={{ fontSize: 44, fontWeight: 900, color: C.navy, fontFamily: a.startsWith("/") ? mono : cn }}>{a}</div>
                <div style={{ fontSize: 32, marginTop: 6 }}>{b}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={s(1.0 + i * 1.5)} name="whoosh" volume={0.45} />
      ))}
    </Dark>
  );
};

// 8 · Pause-and-think quiz with a countdown
const Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const c0 = s(4.0);
  const reveal = s(6.1);
  const count = frame < c0 ? null : frame < c0 + 20 ? "3" : frame < c0 + 40 ? "2" : frame < reveal ? "1" : null;
  return (
    <Dark>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 120px" }}>
        <div style={{ fontSize: 30, background: C.yellow, color: C.ink, fontWeight: 900, padding: "6px 22px", borderRadius: 99, opacity: appear(frame, 2) }}>暂停想一想</div>
        <div style={{ fontSize: 58, fontWeight: 900, marginTop: 30, lineHeight: 1.35, opacity: appear(frame, 8) }}>别人的仓库，信任对话框该怎么选？</div>
        <div style={{ height: 170, display: "grid", placeItems: "center", marginTop: 20 }}>
          {count ? <div key={count} style={{ fontSize: 140, fontWeight: 900, color: C.yellow, fontFamily: mono }}>{count}</div> : null}
          {frame >= reveal ? (
            <div style={{ background: "#fff", color: C.ink, borderRadius: 18, padding: "18px 34px", fontSize: 44, fontWeight: 900, scale: `${interpolate(frame, [reveal, reveal + 10], [0.7, 1], { ...clamp, easing: out })}` }}>
              先退出，读完它的 <span style={{ fontFamily: mono, color: C.navy }}>.claude/</span> 再决定
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
      {[0, 20, 40].map((d) => (
        <Sfx key={d} at={c0 + d} name="mouse-click" volume={0.5} />
      ))}
      <Sfx at={reveal} name="ding" volume={0.55} />
    </Dark>
  );
};

// 9 · Outro
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Light>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontSize: 70, fontWeight: 900, color: C.navy, opacity: appear(frame, 0) }}>轮到你动手了</div>
        <div style={{ fontSize: 34, marginTop: 22, opacity: appear(frame, 10) }}>网页上跟着步骤做 · 完成入职笔记纠错题 · 检查全部 PASS</div>
        <div style={{ width: 140, height: 7, background: C.yellow, marginTop: 30, scale: `${interpolate(frame, [10, 26], [0, 1], clamp)} 1` }} />
      </AbsoluteFill>
      <Sfx at={0} name="ding" volume={0.4} />
    </Light>
  );
};

export const LESSON1_SCENES: { name: string; sec: number; C: React.FC }[] = [
  { name: "Hook", sec: 9, C: Hook },
  { name: "Install", sec: 6, C: Install },
  { name: "Start", sec: 10, C: Start },
  { name: "Status", sec: 6, C: Status },
  { name: "Esc", sec: 5, C: Esc },
  { name: "Verify", sec: 8, C: Verify },
  { name: "Takeaways", sec: 6.5, C: Takeaways },
  { name: "Quiz", sec: 8, C: Quiz },
  { name: "Outro", sec: 4, C: Outro },
];

// With a voiceover, a scene lasts at least as long as its voice line plus a short pause.
const voice = (VOICE as Record<string, Record<string, number>>)["b-1"] ?? {};
const LEAD = 4;
const T = 10; // transition frames
const dur = (x: { name: string; sec: number }) => Math.max(s(x.sec), voice[x.name] ? LEAD + Math.ceil((voice[x.name] / 1000 + 0.5) * FPS) : 0) + T;

export const LESSON1_FRAMES = LESSON1_SCENES.reduce((n, x) => n + dur(x), 0) - T * (LESSON1_SCENES.length - 1);

export const Lesson1: React.FC = () => (
  <TransitionSeries>
    {LESSON1_SCENES.flatMap((x, i) => {
      const seq = (
        <TransitionSeries.Sequence key={x.name} name={x.name} durationInFrames={dur(x)}>
          <x.C />
          {voice[x.name] ? (
            <Sequence from={LEAD} name={`Voice ${x.name}`}>
              <Audio src={staticFile(`voice/b-1/${x.name}.mp3`)} />
            </Sequence>
          ) : null}
        </TransitionSeries.Sequence>
      );
      if (i === 0) return [seq];
      const dark = x.name === "Takeaways" || x.name === "Quiz";
      return [
        <TransitionSeries.Transition key={`t-${x.name}`} presentation={dark ? fade() : slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: T })} />,
        seq,
      ];
    })}
  </TransitionSeries>
);
