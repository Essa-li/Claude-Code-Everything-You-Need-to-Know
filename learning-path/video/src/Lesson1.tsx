import React from "react";
import { AbsoluteFill, Easing, interpolate, Series, useCurrentFrame } from "remotion";
import { C, cn, FPS, mono } from "./theme";
import { fadeIn, Key, Scene, Terminal } from "./parts";

const s = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.navy, color: "#fff", fontFamily: cn, justifyContent: "center", padding: "0 110px" }}>
      <div style={{ fontSize: 28, letterSpacing: 2, opacity: fadeIn(frame, 0) * 0.8 }}>Claude Code 带练课 · 第 1 课 / 共 8 课</div>
      <div style={{ fontSize: 76, fontWeight: 900, marginTop: 18, opacity: fadeIn(frame, 6), translate: `0px ${interpolate(frame, [6, 24], [24, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) })}px` }}>
        安装、登录、熟悉界面
      </div>
      <div style={{ width: 120, height: 6, background: C.yellow, marginTop: 30, opacity: fadeIn(frame, 14) }} />
      <div style={{ fontSize: 30, marginTop: 30, maxWidth: 900, lineHeight: 1.55, opacity: fadeIn(frame, 20) }}>
        装好 Claude Code，安全地启动它，学会中途叫停，看清模型和账号，并用代码核对它说的话。
      </div>
      <div style={{ position: "absolute", bottom: 50, left: 110, fontSize: 20, opacity: 0.75 }}>演示动画 · 界面为示意，非真实录屏 · 操作以网页上的步骤为准</div>
    </AbsoluteFill>
  );
};

const Windows: React.FC = () => {
  const frame = useCurrentFrame();
  const card = (tag: string, title: string, desc: string, color: string, at: number) => (
    <div style={{ flex: 1, background: C.term, borderRadius: 16, padding: 34, color: C.termText, opacity: fadeIn(frame, at), translate: `0px ${interpolate(frame, [at, at + 16], [20, 0], clamp)}px` }}>
      <div style={{ display: "inline-block", fontSize: 26, fontWeight: 700, color, border: `2px solid ${color}`, borderRadius: 99, padding: "2px 18px" }}>{tag}</div>
      <div style={{ fontSize: 40, fontWeight: 900, marginTop: 22, color: "#fff" }}>{title}</div>
      <div style={{ fontSize: 26, marginTop: 14, lineHeight: 1.6, color: C.termText }}>{desc}</div>
    </div>
  );
  return (
    <Scene step="开始前" caption="先开好两个终端窗口。网页上每一步都标着该在哪个窗口操作。">
      <div style={{ display: "flex", gap: 32, height: "100%", alignItems: "stretch" }}>
        {card("窗口 A", "Claude Code", "运行 claude 之后的会话：输入 /status 这类命令，以及要对 Claude 说的话", C.winA, 10)}
        {card("窗口 B", "普通终端", "打开在同一个文件夹，运行 git、npm、cat 这些命令", C.winB, 30)}
      </div>
    </Scene>
  );
};

const Install: React.FC = () => (
  <Scene step="第 1–2 步 · 窗口 B" caption="安装 Claude Code，然后新开一个终端窗口，用 claude --version 确认装好了。">
    <Terminal
      title="窗口 B · 终端"
      tag="B"
      style={{ height: "100%" }}
      lines={[
        { at: 8, kind: "cmd", text: "curl -fsSL https://claude.ai/install.sh | bash", typeFrames: 40 },
        { at: 56, kind: "dim", text: "（安装完成后，新开一个终端窗口）" },
        { at: 90, kind: "cmd", text: "claude --version" },
        { at: 116, kind: "ok", text: "X.Y.Z (Claude Code)" },
        { at: 130, kind: "dim", text: "← 看到版本号加 (Claude Code)，就装好了" },
      ]}
    />
  </Scene>
);

const Start: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene step="第 3 步 · 窗口 A" caption="进入练习仓库的 project/ 文件夹启动 claude。第一次要登录；信任对话框只对你清楚来源的文件夹点信任。">
      <div style={{ display: "flex", gap: 28, height: "100%" }}>
        <Terminal
          title="窗口 A · Claude Code"
          tag="A"
          style={{ flex: 1.25 }}
          lines={[
            { at: 6, kind: "cmd", text: "cd ~/claude-code-practice/project" },
            { at: 44, kind: "cmd", text: "claude" },
            { at: 70, kind: "dim", text: "→ 选账号类型，到浏览器里完成登录" },
            { at: 120, kind: "out", text: "Claude Code  ·  版本  ·  模型  ·  文件夹" },
          ]}
          footer="⏵⏵ auto mode on"
          footerAt={150}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 26, border: `3px solid ${C.yellow}`, opacity: fadeIn(frame, 84) }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: C.navy }}>信任对话框</div>
            <div style={{ fontSize: 23, lineHeight: 1.6, marginTop: 10 }}>信任后，仓库自带的 <span style={{ fontFamily: mono }}>.claude/settings.json</span> 就能给 Claude 授权。</div>
            <div style={{ fontSize: 23, lineHeight: 1.6, marginTop: 8 }}>自己的练习仓库：读完再选信任。<br />别人的仓库：先退出，读一遍它的 <span style={{ fontFamily: mono }}>.claude/</span>。</div>
          </div>
          <div style={{ fontSize: 23, color: C.muted, opacity: fadeIn(frame, 150), lineHeight: 1.5 }}>状态栏通常显示自动模式：日常操作不会来问你。</div>
        </div>
      </div>
    </Scene>
  );
};

const Status: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    ["Version", "版本"],
    ["Model", "模型"],
    ["Login method", "登录方式"],
    ["Email", "账号"],
  ];
  return (
    <Scene step="第 4 步 · 窗口 A" caption="输入 /status，一次看清版本、模型和账号。和同事的会话不一样时，先对比账号这几行。按 Esc 关闭。">
      <div style={{ display: "flex", gap: 28, height: "100%" }}>
        <Terminal title="窗口 A · Claude Code" tag="A" style={{ flex: 1 }} lines={[{ at: 6, kind: "you", text: "/status" }]} />
        <div style={{ flex: 1.1, background: "#fff", borderRadius: 14, padding: "26px 30px", boxShadow: "0 18px 40px rgba(19,42,79,.12)", opacity: fadeIn(frame, 30) }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: C.navy, marginBottom: 14 }}>Status（示意）</div>
          {rows.map(([en, zh], i) => (
            <div key={en} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #dde2ea", padding: "12px 0", fontSize: 25, opacity: fadeIn(frame, 40 + i * 10) }}>
              <span style={{ fontFamily: mono, fontWeight: 700 }}>{en}</span>
              <span style={{ color: C.muted }}>{zh}</span>
            </div>
          ))}
          <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 16, fontSize: 24 }}>
            <Key k="Esc" at={130} />
            <span style={{ opacity: fadeIn(frame, 130) }}>关闭</span>
          </div>
        </div>
      </div>
    </Scene>
  );
};

const Interrupt: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene step="第 5 步 · 窗口 A" caption="提一个问题，在它回答到一半时按 Esc：Claude 会停下等你，已经做完的部分会保留。之后再问一次，让它答完。">
      <div style={{ display: "flex", gap: 28, height: "100%" }}>
        <Terminal
          title="窗口 A · Claude Code"
          tag="A"
          style={{ flex: 1.4 }}
          lines={[
            { at: 6, kind: "you", text: "what does this project do?" },
            { at: 50, kind: "claude", text: "● 正在读取文件…" },
            { at: 72, kind: "claude", text: "● 这是一个检查 Markdown 链接的小工具…" },
            { at: 120, kind: "dim", text: "（按下 Esc，回答在这里停住）" },
            { at: 170, kind: "you", text: "which file parses linkcheck.json, and how do I run the tests?" },
            { at: 236, kind: "claude", text: "● src/config.js … npm test" },
          ]}
        />
        <div style={{ flex: 0.7, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 22 }}>
          <Key k="Esc" at={110} />
          <div style={{ fontSize: 26, textAlign: "center", lineHeight: 1.5, opacity: fadeIn(frame, 116) }}>跑偏了就按 Esc，<br />再告诉它你要什么</div>
        </div>
      </div>
    </Scene>
  );
};

const Verify: React.FC = () => {
  const frame = useCurrentFrame();
  const code = [
    "// Parses linkcheck.json. Every field is optional:",
    "//   files:  files or folders to scan for Markdown links (default [\".\"])",
    "//   ignore: link targets to skip, matched as prefixes (default [])",
    "export const DEFAULTS = { files: ['.'], ignore: [] };",
  ];
  const hi = interpolate(frame, [40, 70], [0, 1], clamp);
  return (
    <Scene step="第 6 步 · 编辑器" caption="把它的回答当新同事的话：打开 src/config.js 自己核对。开头几行写着它解析 linkcheck.json，读取 files 和 ignore 两个字段。">
      <div style={{ background: "#fff", borderRadius: 14, height: "100%", boxShadow: "0 18px 40px rgba(19,42,79,.12)", overflow: "hidden" }}>
        <div style={{ background: "#e9eef6", padding: "12px 22px", fontSize: 20, fontFamily: mono, color: C.navy, fontWeight: 700 }}>src/config.js（练习仓库里的真实文件）</div>
        <div style={{ padding: "22px 26px", fontFamily: mono, fontSize: 21, lineHeight: 1.9 }}>
          {code.map((l, i) => (
            <div key={i} style={{ whiteSpace: "pre", background: i > 0 && i < 3 ? `rgba(242,183,5,${0.28 * hi})` : "transparent", borderRadius: 6, padding: "0 8px", color: i < 3 ? "#5d6879" : C.ink, opacity: fadeIn(frame, 6 + i * 6) }}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

const YourTurn: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    "用 @ 把笔记带进提示，让 Claude 逐条核对并给出文件和行号",
    "亲自打开它引用的那一行，以代码为准判断哪条错了",
    "在编辑器里把错的那条改成一句话，写清代码实际怎么做",
    "/exit 后运行 git status，只剩这份笔记，然后提交",
  ];
  return (
    <Scene step="自己练一遍" caption="同事的入职笔记 practice/b-1/onboarding.md 里有一条说法和代码对不上。你要找出来、改正、提交。">
      <div style={{ display: "flex", flexDirection: "column", gap: 18, height: "100%", justifyContent: "center" }}>
        <div style={{ background: C.term, color: C.termText, borderRadius: 12, padding: "16px 22px", fontFamily: mono, fontSize: 21, opacity: fadeIn(frame, 4) }}>
          <span style={{ color: C.winA }}>&gt; </span>check each claim in @practice/b-1/onboarding.md against the code…
        </div>
        {steps.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 18, alignItems: "center", fontSize: 27, opacity: fadeIn(frame, 30 + i * 28) }}>
            <span style={{ width: 46, height: 46, borderRadius: 99, background: C.navy, color: "#fff", display: "grid", placeItems: "center", fontWeight: 900, flex: "none" }}>{i + 1}</span>
            <span>{t}</span>
          </div>
        ))}
      </div>
    </Scene>
  );
};

const Check: React.FC = () => (
  <Scene step="检查过关 · 窗口 B" caption="在练习仓库的 project/ 里运行检查。两项都显示 PASS，再去做网页上的过关小测。">
    <Terminal
      title="窗口 B · 终端"
      tag="B"
      style={{ height: "100%" }}
      lines={[
        { at: 6, kind: "cmd", text: "npm run check -- b-1" },
        { at: 40, kind: "out", text: "b-1  Install, sign in and look around" },
        { at: 52, kind: "ok", text: "  PASS  `claude --version` prints a Claude Code version" },
        { at: 66, kind: "ok", text: "  PASS  the claim in `practice/b-1/onboarding.md` that the code contradicts is corrected" },
        { at: 84, kind: "out", text: "" },
        { at: 86, kind: "out", text: "2 of 2 passed" },
      ]}
    />
  </Scene>
);

const End: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.navy, color: "#fff", fontFamily: cn, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div style={{ fontSize: 60, fontWeight: 900, opacity: fadeIn(frame, 0) }}>现在回到网页，跟着步骤做一遍</div>
      <div style={{ fontSize: 30, marginTop: 26, opacity: fadeIn(frame, 12) * 0.9 }}>每步做完打勾 · 检查全部 PASS · 小测全对就过关</div>
      <div style={{ width: 120, height: 6, background: C.yellow, marginTop: 34, opacity: fadeIn(frame, 18) }} />
    </AbsoluteFill>
  );
};

export const LESSON1_SCENES: { name: string; sec: number; C: React.FC }[] = [
  { name: "Title", sec: 5, C: Title },
  { name: "Windows", sec: 7, C: Windows },
  { name: "Install", sec: 8, C: Install },
  { name: "Start", sec: 10, C: Start },
  { name: "Status", sec: 9, C: Status },
  { name: "Interrupt", sec: 11, C: Interrupt },
  { name: "Verify", sec: 9, C: Verify },
  { name: "YourTurn", sec: 10, C: YourTurn },
  { name: "Check", sec: 7, C: Check },
  { name: "End", sec: 4, C: End },
];

export const LESSON1_FRAMES = LESSON1_SCENES.reduce((n, x) => n + s(x.sec), 0);

export const Lesson1: React.FC = () => (
  <Series>
    {LESSON1_SCENES.map((x) => (
      <Series.Sequence key={x.name} name={x.name} durationInFrames={s(x.sec)}>
        <x.C />
      </Series.Sequence>
    ))}
  </Series>
);
