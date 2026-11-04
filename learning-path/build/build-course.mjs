// Builds one course page from learning-path/courses/<id>/ using index.html as the template,
// so the look and the learning features (steps, quiz, mistake book, flashcards) stay identical.
// Usage: node learning-path/build/build-course.mjs <course-id>   -> learning-path/<course-id>.html
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const id = process.argv[2];
if (!id) { console.error("usage: build-course.mjs <course-id>"); process.exit(2); }
const dir = join(root, "courses", id);
const course = JSON.parse(readFileSync(join(dir, "course.json"), "utf8"));
const lessons = readdirSync(join(dir, "lessons")).filter((f) => f.endsWith(".json")).sort()
  .map((f) => ({ file: f, ...JSON.parse(readFileSync(join(dir, "lessons", f), "utf8")) }));
if (!lessons.length) { console.error("no lessons"); process.exit(2); }

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = (s) => esc(s).replace(/"/g, "&quot;");
const tpl = readFileSync(join(root, "index.html"), "utf8");
const problems = [];

// ---------- validation ----------
const W = new Set(["term", "claude", "edit", "look", "web"]);
for (const L of lessons) {
  for (const k of ["id", "n", "part", "title", "short", "min", "srcUrl", "goal", "idea", "main", "turn", "check", "quiz"]) if (L[k] === undefined) problems.push(`${L.file}: missing ${k}`);
  for (const part of ["main", "turn", "check"]) for (const [i, st] of (L[part] || []).entries()) {
    if (!W.has(st.w)) problems.push(`${L.file}: ${part}[${i}] bad w ${st.w}`);
    if (!st.html) problems.push(`${L.file}: ${part}[${i}] missing html`);
  }
  for (const [i, q] of (L.quiz || []).entries()) if (!Array.isArray(q.o) || q.a < 0 || q.a >= q.o.length || !q.e) problems.push(`${L.file}: quiz[${i}] invalid`);
}
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }

// ---------- HTML pieces ----------
const code = (c) => `<pre data-lang="${attr(c.lang || "终端")}">${esc(c.text)}</pre>`;
const stuck = (s) => `<details class="stuck"><summary>${esc(s.q)}</summary>${s.a}</details>`;
const step = (st) => `    <li data-w="${st.w}">
      ${st.html}
      ${(st.code || []).map(code).join("\n      ")}
      ${st.after || ""}
      ${st.expect ? `<p class="expect">${st.expect}</p>` : ""}
      ${(st.stuck || []).map(stuck).join("\n      ")}
    </li>`;
const steps = (part, list) => `<ol class="steps" data-part="${part}">\n${list.map(step).join("\n")}\n  </ol>`;
const total = lessons.length;

const lessonSection = (L) => {
  const vid = existsSync(join(root, "videos", `${L.id}.mp4`));
  return `
<!-- ============ ${esc(L.id)} ============ -->
<section class="view lesson" id="v-${L.id}" data-view="${L.id}" hidden>
  <div class="lhead">
    <span class="eyebrow">第 ${L.n} 课 / 共 ${total} 课 · ${esc(L.part)} · 约 ${L.min} 分钟</span>
    <h2>${esc(L.title)}</h2>
    <p class="goal">${L.goal}</p>
  </div>
  ${vid ? `<div class="demo">
    <video controls playsinline preload="metadata" poster="videos/${L.id}-poster.jpg" src="videos/${L.id}.mp4" aria-label="本课演示动画"></video>
    <span class="cap">先看这段一分多钟的配音演示动画，再往下学。画面是示意动画，内容以本页为准。</span>
  </div>` : ""}
  <div class="panel idea">
    <h3>先搞懂</h3>
    ${L.idea.join("\n    ")}
  </div>
  ${L.main.length ? `<div class="section-title"><h3>${esc(L.mainTitle || "跟着看")}</h3><span class="count" data-count="main"></span></div>\n  ${steps("main", L.main)}` : ""}
  ${L.turn.length ? `<div class="section-title"><h3>${esc(L.turnTitle || "自己练一遍")}</h3><span class="count" data-count="turn"></span></div>\n  ${steps("turn", L.turn)}` : ""}
  ${L.check.length ? `<div class="section-title"><h3>检查过关</h3><span class="count" data-count="check"></span></div>\n  ${steps("check", L.check)}` : ""}
  ${L.warn && L.warn.length ? `<div class="warnbox">\n    <h3>容易踩的坑</h3>\n    ${L.warn.join("\n    ")}\n  </div>` : ""}
  <div class="panel"><div class="section-title"><h3>过关小测</h3><span class="count">全部答对才算过关</span></div><div class="quiz" data-quiz="${L.id}"></div></div>
  <nav class="pager" aria-label="课程翻页"></nav>
</section>`;
};

const header = `<header class="topbar">
  <div class="wrap">
    <a class="brand" href="#home">${esc(course.title)}</a>
    <nav class="nav" aria-label="主导航">
      <a href="index.html#courses">全部课程</a>
      <a href="#home" data-nav="home">路线</a>
      <a href="#${lessons[0].id}" data-nav="lesson" id="nav-lesson">继续学习</a>
      <a href="#review" data-nav="review">复习<span class="due-pill" id="due-pill" hidden></span></a>
      <a href="#ref" data-nav="ref">速查</a>
    </nav>
  </div>
  <div class="wrap">
    <nav class="lessonbar" id="lessonbar" aria-label="课程目录"></nav>
  </div>
</header>`;

const mins = lessons.reduce((a, l) => a + l.min, 0);
const home = `
<section class="view" id="v-home" data-view="home">
  <div class="hero">
    <span class="eyebrow">${total} 课 · 约 ${Math.round(mins / 60 * 10) / 10} 小时 · 改编自 ${esc(course.source.name)}</span>
    <h1>${esc(course.headline)}</h1>
    <p>${course.lead}</p>
    <div class="stats" id="home-stats"></div>
    <a class="btn" id="start-btn" href="#${lessons[0].id}">开始第 1 课</a>
  </div>
  <div class="panel">
    <div class="section-title"><h3>掌握路径</h3><span class="count" id="map-count"></span></div>
    <div id="map"></div>
  </div>
  <div class="panel">
    <h3>这门课怎么学</h3>
    ${course.howto.join("\n    ")}
    <div class="windows">
      <div class="win"><span class="w web">浏览器</span><span class="small muted">在 claude.ai 或原课程页面上操作，不用装任何东西。</span></div>
      <div class="win"><span class="w claude">窗口 A · Claude Code</span><span class="small muted">运行 <code>claude</code> 后的会话，让 Claude 帮你读代码、跑示例。</span></div>
      <div class="win"><span class="w term">窗口 B · 普通终端</span><span class="small muted">运行 <code>git</code>、<code>cat</code> 等命令。</span></div>
      <div class="win"><span class="w look">只看</span><span class="small muted">不用输入，看懂、想清楚再往下。</span></div>
    </div>
    <div class="field">
      <label for="dir-input" class="small"><b>练习文件夹路径</b>（存放原课程代码的地方，命令会自动换成这个路径）</label>
      <input id="dir-input" type="text" spellcheck="false" autocomplete="off" value="${attr(course.dirDefault)}">
    </div>
  </div>
  <p class="small muted">${course.sourceNote}</p>
</section>`;

const glossary = (course.glossary || []).map(([t, d]) => `<dt>${esc(t)}</dt><dd>${d}</dd>`).join("\n      ");
const ref = `
<section class="view" id="v-review" data-view="review" hidden>
  <div class="lhead">
    <span class="eyebrow">复习</span>
    <h2>记忆卡与错题本</h2>
    <p class="muted">记忆卡按间隔复习：选“记得”，下次复习的间隔会依次拉长到 1、3、7、14 天；选“忘了”，这张卡今天会再出现一次。只有你开始学过的课，里面的卡才会出现在复习里。</p>
  </div>
  <div class="stats" id="review-stats"></div>
  <div id="flash-area"></div>
  <div class="panel">
    <div class="section-title"><h3>错题本</h3><span class="count" id="wrong-count"></span></div>
    <div id="wrong-list" style="display:flex;flex-direction:column;gap:14px"></div>
  </div>
</section>

<section class="view" id="v-ref" data-view="ref" hidden>
  <div class="lhead"><span class="eyebrow">速查</span><h2>关键概念速查</h2></div>
  <div class="table-wrap"><table>
    <thead><tr><th>概念 / 命令</th><th>意思</th><th>课</th></tr></thead>
    <tbody id="cmd-rows"></tbody>
  </table></div>
  <div class="panel">
    <h3>术语</h3>
    <dl class="glossary">
      ${glossary}
    </dl>
  </div>
</section>

<footer>
  <span>${course.footer}</span>
</footer>
</main>
`;

// ---------- script with this course's data ----------
let script = tpl.slice(tpl.indexOf("<script>\n(function"));
const dataStart = script.indexOf("  var REPO = ");
const dataEnd = script.indexOf("  // ---------- 状态 ----------");
const LESSONS = lessons.map((l) => ({ id: l.id, n: l.n, part: l.part, short: l.short, title: l.title, min: l.min, path: l.srcUrl }));
const QUIZ = Object.fromEntries(lessons.map((l) => [l.id, l.quiz]));
const CARDS = lessons.flatMap((l) => (l.cards || []).map(([a, b]) => [a, b, l.id]));
const data = `  var COURSE_ID = ${JSON.stringify(id)};
  var REPO = "";
  var LESSONS = ${JSON.stringify(LESSONS, null, 1)};
  var QUIZ = ${JSON.stringify(QUIZ, null, 1)};
  var CARDS = ${JSON.stringify(CARDS, null, 1)};

`;
script = script.slice(0, dataStart) + data + script.slice(dataEnd);
const rep = (a, b) => { if (!script.includes(a)) problems.push(`template changed: ${a.slice(0, 60)}`); script = script.split(a).join(b); };
rep('var KEY = "cc-tutor-v2";', 'var KEY = "cc-tutor-" + COURSE_ID;');
rep('if (l.night !== lastNight) { html += \'<li style="display:block"><div class="night">\' + (l.night === 1 ? "第一晚 · 初级 4 课 · 约 85 分钟" : "第二晚 · 中级 4 课 · 约 85 分钟") + "</div></li>"; lastNight = l.night; }',
  'if (l.part !== lastNight) { var pl = LESSONS.filter(function (x) { return x.part === l.part; }); html += \'<li style="display:block"><div class="night">\' + esc(l.part) + " · " + pl.length + " 课 · 约 " + pl.reduce(function (a, x) { return a + x.min; }, 0) + " 分钟</div></li>"; lastNight = l.part; }');
rep('"已过关 " + nPassed + " / 8"', '"已过关 " + nPassed + " / " + LESSONS.length');
rep("'<div class=\"stat\"><b>' + nPassed + ' / 8</b>", "'<div class=\"stat\"><b>' + nPassed + ' / ' + LESSONS.length + '</b>");
rep('"8 课都已过关，去复习"', 'LESSONS.length + " 课都已过关，去复习"');
rep('var SHORT = { "b-1": "安装登录", "b-2": "权限与计划", "b-3": "第一次改动", "b-5": "项目记忆", "i-1": "技能", "i-2": "整理记忆", "i-4": "权限与沙箱", "i-7": "MCP" };',
  "var SHORT = {}; LESSONS.forEach(function (l) { SHORT[l.id] = l.short; });");
rep(`      if (i === 4) html += '<span class="sep">中级</span>';\n      if (i === 0) html += '<span class="sep">初级</span>';`,
  `      if (i === 0 || LESSONS[i - 1].part !== l.part) html += '<span class="sep">' + esc(l.part) + '</span>';`);
rep('var WHERE = { term: ["term", "窗口 B · 终端"], claude: ["claude", "窗口 A · Claude Code"], edit: ["edit", "编辑器"], look: ["look", "只看"] };',
  'var WHERE = { term: ["term", "窗口 B · 终端"], claude: ["claude", "窗口 A · Claude Code"], edit: ["edit", "编辑器"], look: ["look", "只看"], web: ["web", "浏览器"] };');
rep('"~/claude-code-practice"', JSON.stringify(course.dirDefault));
rep(">英文原课</a>", ">原课程</a>");
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }

// ---------- head: template CSS, this course's title, one extra tag colour ----------
let head = tpl.slice(0, tpl.indexOf('<header class="topbar">'));
head = head.replace(/<title>[^<]*<\/title>/, `<title>${esc(course.title)}</title>`);
head = head.replace(".w.look { color: var(--w-look); }", ".w.look { color: var(--w-look); } .w.web { color: var(--ok); }");

const out = head + header + '\n\n<main class="wrap" id="main">\n' + home + lessons.map(lessonSection).join("\n") + ref + "\n" + script;
writeFileSync(join(root, `${id}.html`), out);
console.log(`${id}.html: ${lessons.length} lessons, ${QUIZ ? Object.values(QUIZ).flat().length : 0} quiz questions, ${CARDS.length} cards, ${Math.round(out.length / 1024)} KB`);
