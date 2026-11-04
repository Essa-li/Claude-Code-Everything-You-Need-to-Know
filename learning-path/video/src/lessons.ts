// Visual content for lessons 2–8, rendered by Generic.tsx. Event times are
// fractions of each scene's length, so they follow the voice lines.
// Everything shown restates the lesson pages; interfaces are illustrations.
import type { Line } from "./parts";

export type Card = { t: string; b?: string; color?: "ok" | "bad" | "navy" | "yellow" };
export type Stamp = { text: string; color?: "ok" | "bad"; f: number };

export type SceneCfg =
  | { type: "term"; chapter: number; caption: string; hi?: string; title: string; tag: "A" | "B"; lines: (Omit<Line, "at"> & { f: number })[]; stamp?: Stamp; footer?: string }
  | { type: "cards"; chapter: number; caption: string; hi?: string; heading: string; cards: Card[]; stamp?: Stamp }
  | { type: "panel"; chapter: number; caption: string; hi?: string; heading: string; rows: [string, string][]; hiRows: number[]; mono?: boolean }
  | { type: "code"; chapter: number; caption: string; hi?: string; file: string; lines: string[]; hiLines: number[]; hiColor?: "yellow" | "bad"; bubble?: string; stamp?: Stamp };

export type LessonCfg = {
  id: string;
  n: number;
  title: string;
  chapters: [string, string, string, string];
  hook: { bubble: string; slam: string; title: string };
  scenes: [SceneCfg, SceneCfg, SceneCfg, SceneCfg];
  takeaways: [string, string][];
  quiz: { q: string; a: string };
  outro: string;
};

export const LESSONS: LessonCfg[] = [
  {
    id: "b-2", n: 2, title: "权限模式与计划模式",
    chapters: ["模式", "计划", "审查", "批准"],
    hook: { bubble: "改好了，我顺便还改了另外三个文件。", slam: "等等！", title: "先看方案，再让它动手" },
    scenes: [
      { type: "panel", chapter: 0, caption: "Shift+Tab 切换，状态栏显示当前模式", hi: "Shift+Tab", heading: "按 Shift+Tab 切换模式", mono: true,
        rows: [["⏵⏵ auto mode on", "自动"], ["⏸ plan mode on", "计划"], ["⏸ manual mode on", "手动"], ["⏵⏵ accept edits on", "自动接受修改"]], hiRows: [1] },
      { type: "term", chapter: 1, caption: "计划模式：只读、写方案，批准前不改文件", hi: "批准前不改文件", title: "窗口 A · Claude Code", tag: "A", footer: "⏸ plan mode on",
        lines: [
          { f: 0.05, kind: "you", text: "Make parseConfig in src/config.js reject an empty file with a clear error message, and add a test for it." },
          { f: 0.35, kind: "claude", text: "● 正在读取 src/config.js …" },
          { f: 0.5, kind: "claude", text: "● 方案：改 src/config.js 和 test/config.test.js" },
        ],
        stamp: { text: "0 个文件被改动", color: "ok", f: 0.72 } },
      { type: "cards", chapter: 2, caption: "在这个菜单上，Shift+Tab 会直接批准", hi: "直接批准", heading: "像审同事的方案一样审它",
        cards: [{ t: "改哪些文件？", color: "navy" }, { t: "每处改了什么？", color: "navy" }, { t: "不满意：写意见，按 Enter", b: "别按 Shift+Tab", color: "bad" }] },
      { type: "cards", chapter: 3, caption: "做得比方案多的命令：No，按 Tab 说明", hi: "No", heading: "批准时怎么选",
        cards: [{ t: "Yes, manually approve edits", b: "逐步把关", color: "navy" }, { t: "Yes, and use auto mode", b: "方案放心时的日常选择", color: "ok" }, { t: "No + Tab", b: "例如 npm test && git add -A", color: "bad" }] },
    ],
    takeaways: [["拿不准", "先出计划"], ["只批准", "愿意合并的方案"], ["菜单上发意见", "用 Enter"]],
    quiz: { q: "在方案菜单上按 Shift+Tab，会发生什么？", a: "直接批准方案" },
    outro: "网页上跟着步骤做 · 处理同事的工单 · 检查全部 PASS",
  },
  {
    id: "b-3", n: 3, title: "第一次改动：从需求到提交",
    chapters: ["探索", "执行", "测试", "审查"],
    hook: { bubble: "测试全部通过，这个补丁没问题。", slam: "未必！", title: "从需求到提交，每步都把关" },
    scenes: [
      { type: "cards", chapter: 0, caption: "先在计划模式里探索，再写清楚要求", hi: "写清楚要求", heading: "好的要求写明四件事",
        cards: [{ t: "改哪个文件", color: "navy" }, { t: "处理什么情况", color: "navy" }, { t: "什么必须不变", color: "navy" }, { t: "用什么检查，并给我看输出", color: "yellow" }] },
      { type: "cards", chapter: 1, caption: "跑偏了马上按 Esc，越早纠正越省事", hi: "Esc", heading: "方案对了，交给自动模式",
        cards: [{ t: "Yes, and use auto mode", b: "方案只改预期的文件时", color: "ok" }, { t: "Esc", b: "动了方案外的文件，立刻叫停", color: "bad" }, { t: "/btw 问题", b: "顺便问一句，不打断它", color: "navy" }] },
      { type: "term", chapter: 2, caption: "看真实的测试输出，不看它的总结", hi: "真实的测试输出", title: "窗口 A · Claude Code", tag: "A",
        lines: [
          { f: 0.05, kind: "you", text: "run the tests" },
          { f: 0.3, kind: "dim", text: "（输出被折叠，按 Ctrl+O 展开）" },
          { f: 0.55, kind: "ok", text: "fail 0" },
        ],
        stamp: { text: "fail 0", color: "ok", f: 0.6 } },
      { type: "cards", chapter: 3, caption: "/diff 逐行看，测试代码也要看", hi: "/diff", heading: "提交之前",
        cards: [{ t: "/diff 逐行审查", b: "测试也要看", color: "navy" }, { t: "大白话纠正", b: "发现问题就让它改", color: "yellow" }, { t: "最后才提交", color: "ok" }] },
    ],
    takeaways: [["要求写清", "文件·情况·检查"], ["看真实的", "测试输出"], ["测试通过", "≠ 补丁正确"]],
    quiz: { q: "同事补丁的测试都通过了，能直接合并吗？", a: "不能：先读补丁，再补一个能抓住问题的测试" },
    outro: "网页上修好带标题的链接 · 审查同事的补丁 · 检查全部 PASS",
  },
  {
    id: "b-5", n: 4, title: "用 CLAUDE.md 写项目记忆",
    chapters: ["生成", "精简", "验证", "归类"],
    hook: { bubble: "上次你交代的规矩？我这次没看到。", slam: "又要重说？", title: "让它每次都记得你的规矩" },
    scenes: [
      { type: "term", chapter: 0, caption: "每次新会话开始，都会读 CLAUDE.md", hi: "CLAUDE.md", title: "窗口 A · Claude Code", tag: "A",
        lines: [
          { f: 0.05, kind: "you", text: "/init" },
          { f: 0.3, kind: "claude", text: "● 正在读取代码 …" },
          { f: 0.5, kind: "claude", text: "● 已写出 CLAUDE.md：命令、约定、项目结构" },
        ] },
      { type: "cards", chapter: 1, caption: "加一条从文件上看得出有没有遵守的规则", hi: "看得出", heading: "像给团队看那样删减",
        cards: [{ t: "删：读代码就知道的", color: "bad" }, { t: "删：只跟课程有关的", color: "bad" }, { t: "加：新文件第一行写许可证头", color: "ok" }] },
      { type: "code", chapter: 2, caption: "新会话里新建文件，自动带上许可证头", hi: "自动", file: "src/stats.js · 新会话创建", lines: ["// SPDX-License-Identifier: MIT", "", "export function countLinks(markdown) {", "  …"], hiLines: [0],
        stamp: { text: "规则生效 ✓", color: "ok", f: 0.62 } },
      { type: "panel", chapter: 3, caption: "只属于你、只在这个项目用的，写 CLAUDE.local.md", hi: "CLAUDE.local.md", heading: "每条说明写在哪", mono: true,
        rows: [["./CLAUDE.md", "团队 · 提交进仓库"], ["~/.claude/CLAUDE.md", "只有你 · 所有项目"], ["./CLAUDE.local.md", "只有你 · 这个项目"], ["自动记忆", "Claude 自己记"]], hiRows: [2] },
    ],
    takeaways: [["/init", "先出初稿"], ["改完要", "开新会话"], ["硬性规则", "交给钩子"]],
    quiz: { q: "只给自己看的项目笔记，该写在哪？", a: "CLAUDE.local.md，并加进 .gitignore" },
    outro: "网页上写好 CLAUDE.md · 把四条笔记放对地方 · 检查全部 PASS",
  },
  {
    id: "i-1", n: 5, title: "把重复工作做成技能",
    chapters: ["认识", "调用", "补完", "试探"],
    hook: { bubble: "好的，请再把那份分析步骤发我一遍。", slam: "第三次了！", title: "把重复的流程做成技能" },
    scenes: [
      { type: "code", chapter: 0, caption: "Claude 看简介决定要不要加载，不看正文", hi: "简介", file: ".claude/skills/five-whys/SKILL.md",
        lines: ["---", "name: five-whys", "description: Finds the root cause of a bug, failure or", "  recurring problem … Use when the user asks why", "  something keeps happening …", "---", "Find the root cause of this problem: $ARGUMENTS"], hiLines: [2, 3, 4] },
      { type: "term", chapter: 1, caption: "输入名字运行，或者让它按简介自己加载", hi: "自己加载", title: "窗口 A · Claude Code", tag: "A",
        lines: [
          { f: 0.04, kind: "you", text: "/five-whys npm run linkcheck -- samples exits with code 1" },
          { f: 0.28, kind: "claude", text: "● 因果链 → 根本原因 → 两个修复建议" },
          { f: 0.45, kind: "you", text: "/clear" },
          { f: 0.55, kind: "you", text: "Why does the test suite pass even though samples/guide.md has a broken link?" },
          { f: 0.78, kind: "ok", text: "● Skill(five-whys)" },
        ] },
      { type: "cards", chapter: 2, caption: "简介写成：做什么 + Use when 适用的需求", hi: "Use when", heading: "补完 tdd 技能",
        cards: [{ t: "写好 description", b: "做什么 + Use when 功能需求", color: "navy" }, { t: "补完 Green、Refactor", color: "navy" }, { t: "删掉 disable-model-invocation", b: "让它能自动加载", color: "yellow" }] },
      { type: "cards", chapter: 3, caption: "触发条件，两个方向都要试", hi: "两个方向", heading: "试一试它什么时候加载",
        cards: [{ t: "提功能需求", b: "应该加载 tdd", color: "ok" }, { t: "只是提问", b: "不该加载 tdd", color: "bad" }] },
    ],
    takeaways: [["第三次粘贴", "就做成技能"], ["简介决定", "何时加载"], ["两个方向", "都要试"]],
    quiz: { q: "Claude 根据什么决定自动加载一个技能？", a: "技能的 description 简介" },
    outro: "网页上补完 tdd 技能 · 想想你的询盘分级流程",
  },
  {
    id: "i-2", n: 6, title: "整理项目记忆，查看加载了什么",
    chapters: ["导入", "规则", "日志", "排查"],
    hook: { bubble: "你写的那条规则？我没收到。", slam: "没加载！", title: "不照做？先查有没有加载" },
    scenes: [
      { type: "code", chapter: 0, caption: "导入让文件更有条理，但不节省上下文", hi: "不节省上下文", file: "CLAUDE.md", lines: ["## Commands", "- npm scripts: @package.json"], hiLines: [1] },
      { type: "code", chapter: 1, caption: "写了 paths 的规则，碰到匹配的文件才加载", hi: "paths", file: ".claude/rules/testing.md",
        lines: ["---", "paths:", "  - \"test/**/*.js\"", "---", "# Testing", "- Use `node:test` and `node:assert/strict`."], hiLines: [1, 2] },
      { type: "term", chapter: 2, caption: "日志写明每份说明为什么加载", hi: "为什么加载", title: "窗口 B · 终端", tag: "B",
        lines: [
          { f: 0.04, kind: "cmd", text: "claude --settings .practice/i-2-hook.json" },
          { f: 0.3, kind: "cmd", text: "cat .practice/i-2-loaded.txt" },
          { f: 0.45, kind: "out", text: "session_start    …/CLAUDE.md" },
          { f: 0.55, kind: "out", text: "include          …/package.json" },
          { f: 0.65, kind: "ok", text: "path_glob_match  …/.claude/rules/testing.md" },
        ] },
      { type: "cards", chapter: 3, caption: "路径从项目根目录算起", hi: "项目根目录", heading: "那条规则为什么不生效",
        cards: [{ t: "规则写的是 source/**", color: "bad" }, { t: "代码实际在 src/", color: "navy" }, { t: "→ 永远匹配不上", color: "bad" }] },
    ],
    takeaways: [["不遵守？", "先查加载"], ["导入", "不省上下文"], ["paths", "从根目录算"]],
    quiz: { q: "一套多步骤的发布流程，该放在哪？", a: "做成技能" },
    outro: "网页上拆分说明 · 修好不生效的规则 · 检查全部 PASS",
  },
  {
    id: "i-4", n: 7, title: "权限、设置范围与沙箱",
    chapters: ["范围", "规则", "验证", "沙箱"],
    hook: { bubble: "我顺手读了一下 .env，里面有几个密码。", slam: "不行！", title: "先锁好：能读什么，能写哪里" },
    scenes: [
      { type: "panel", chapter: 0, caption: "规则写在哪个文件，决定对谁生效", hi: "对谁生效", heading: "四个设置文件", mono: true,
        rows: [["~/.claude/settings.json", "你 · 所有项目"], [".claude/settings.json", "团队 · 提交进仓库"], [".claude/settings.local.json", "你 · 这个项目"], ["Managed settings", "组织政策"]], hiRows: [1] },
      { type: "code", chapter: 1, caption: "判断顺序：先 deny，再 ask，最后 allow", hi: "先 deny", file: ".claude/settings.json",
        lines: ["{", "  \"permissions\": {", "    \"allow\": [\"Bash(npm test)\"],", "    \"ask\": [\"Bash(git push *)\"],", "    \"deny\": [\"Read(./.env)\", \"Read(./.env.*)\"]", "  }", "}"], hiLines: [2, 3, 4] },
      { type: "term", chapter: 2, caption: "手动模式下验证：读 .env 被拦，跑测试直接放行", hi: "手动模式", title: "窗口 A · Claude Code", tag: "A", footer: "⏸ manual mode on",
        lines: [
          { f: 0.04, kind: "cmd", text: "claude --permission-mode default" },
          { f: 0.25, kind: "you", text: "Read .env and tell me what it holds." },
          { f: 0.45, kind: "dim", text: "✗ 被 deny 规则拦下" },
          { f: 0.6, kind: "you", text: "Run npm test" },
          { f: 0.8, kind: "ok", text: "✓ 直接运行，没有权限提示" },
        ] },
      { type: "term", chapter: 3, caption: "要到沙箱外重试？拒绝", hi: "拒绝", title: "窗口 A · Claude Code", tag: "A",
        lines: [
          { f: 0.04, kind: "you", text: "/sandbox  → Mode: auto-allow" },
          { f: 0.25, kind: "you", text: "Run this exact command and show me its output: touch ~/sandbox-probe" },
          { f: 0.5, kind: "dim", text: "Operation not permitted" },
        ],
        stamp: { text: "沙箱挡住了", color: "ok", f: 0.55 } },
    ],
    takeaways: [["规则要窄", "不用 npm *"], ["推送前", "ask 规则"], ["沙箱", "挡住越界写入"]],
    quiz: { q: "想让它推送前一定先问你，最可靠的办法？", a: "在设置里写 ask 规则 Bash(git push *)" },
    outro: "网页上给练习仓库上锁 · 接客户资料前也这样做",
  },
  {
    id: "i-7", n: 8, title: "用 MCP 连接外部工具",
    chapters: ["接入", "查看", "共享", "修复"],
    hook: { bubble: "这个网页我看不了，我只能读文件。", slam: "接个浏览器！", title: "用 MCP 连接外部工具" },
    scenes: [
      { type: "term", chapter: 0, caption: "版本锁定，三项数据外流全部关掉", hi: "版本锁定", title: "窗口 B · 终端", tag: "B",
        lines: [
          { f: 0.04, kind: "cmd", text: "claude mcp add --env CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS=1 --transport stdio chrome-devtools -- npx -y chrome-devtools-mcp@1.10.1 --isolated --no-usage-statistics --no-performance-crux", typeFrames: 50 },
          { f: 0.6, kind: "cmd", text: "claude mcp get chrome-devtools" },
          { f: 0.78, kind: "dim", text: "→ 显示范围（local）和状态" },
        ] },
      { type: "term", chapter: 1, caption: "第一次调用：看清楚，只批准这一次", hi: "只批准这一次", title: "窗口 A · Claude Code", tag: "A", footer: "⏸ manual mode on",
        lines: [
          { f: 0.04, kind: "you", text: "Use the chrome-devtools tools to open .practice/demo.html as a file: URL. Read the title, visible count and console error." },
          { f: 0.5, kind: "claude", text: "● 页面一直显示 Counting links..." },
          { f: 0.65, kind: "claude", text: "● 控制台：脚本更新一个找不到的元素时出错" },
        ] },
      { type: "code", chapter: 2, caption: "令牌永远不进 .mcp.json，用 ${VAR}", hi: "${VAR}", file: ".mcp.json（示意）",
        lines: ["{", "  \"mcpServers\": {", "    \"chrome-devtools\": {", "      \"command\": \"npx\",", "      \"args\": [\"-y\", \"chrome-devtools-mcp@1.10.1\", \"--isolated\",", "               \"--no-usage-statistics\", \"--no-performance-crux\"]", "    }", "  }", "}"], hiLines: [4, 5] },
      { type: "cards", chapter: 3, caption: "只修对不上的地方，别把异常吞掉", hi: "别把异常吞掉", heading: "修网页的顺序",
        cards: [{ t: "先读控制台", color: "navy" }, { t: "对比报错行和页面元素", color: "navy" }, { t: "只修对不上的查找", b: "修好后显示 2 links ready", color: "ok" }] },
    ],
    takeaways: [["共享用", "project 范围"], ["版本", "一定锁定"], ["令牌", "不进仓库"]],
    quiz: { q: "批准一个服务器，等于批准它所有的工具调用吗？", a: "不是，这是两件分开的事" },
    outro: "网页上接好浏览器 · 修好演示网页 · 检查全部 PASS",
  },
];
