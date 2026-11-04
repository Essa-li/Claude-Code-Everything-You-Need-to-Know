# Lesson data spec for the learning-path courses

Each lesson is one JSON file at `learning-path/courses/<course>/lessons/<id>.json`.
`node learning-path/build/build-course.mjs <course>` turns them into `learning-path/<course>.html`,
using `learning-path/index.html` as the template. `agents/lessons/a-01.json` is the reference example:
match its depth, tone and structure.

## Audience and goal

The learner is Essa, a Chinese-speaking general manager of an industrial-equipment sales branch
(cranes, concrete and crushing equipment; inquiries, customer due diligence, distributors). Essa has
finished a Claude Code course (permission modes, plan mode, CLAUDE.md, skills, permissions/sandbox,
MCP) but does not program. Lessons must be hands-on and plain, never a wall of theory.

## Faithfulness rules (most important)

- Concepts come from the original lesson only. Read the official Simplified Chinese translation and the
  English original (the English is authoritative; the Chinese is machine-translated). Do not add facts,
  numbers, product claims, prices or dates that the lesson does not state. If the lesson names a vendor
  product (Azure, Microsoft Foundry, Semantic Kernel …), say what the lesson says about it, no more.
- Keep the lesson's own examples (e.g. the travel agent) when explaining concepts; business examples
  for Essa go in the exercises ("自己练一遍"), clearly as exercises, never as claims.
- Commands and file paths must exist: check them in the cloned repo (paths relative to the repo root,
  e.g. `01-intro-to-ai-agents/code_samples/01-python-agent-framework.ipynb`). Use `{{DIR}}` for the repo
  folder on Essa's computer (the page fills it in).
- Claude Code usage must only rely on what Essa learned: starting `claude`, plan mode, asking it to read
  files with @paths, `/clear`, Esc. Reading code needs no API key. Never tell Essa to paste keys into a
  chat. Running the original samples needs the services the lesson names: say so in a `stuck` or `warn`
  item instead of pretending it is free.

## Writing style

Simplified Chinese, plain and concrete, short sentences, conclusion first. No em dashes (use ，：（）).
No emoji. Prompts to Claude Code may be English or Chinese; when English, add a `<p class="tr">意思：…</p>`.
Inline code in `<code>`. HTML allowed in strings: `<p> <b> <code> <ul><li> <ol><li> <table class>` and
`<div class="table-wrap"><table>…</table></div>` for tables (max 3 short columns).

## Schema

```json
{
  "id": "a-01",                 // course prefix + two-digit lesson number
  "n": 2,                       // position in the course, 1-based (lesson 00 is n=1)
  "part": "打基础",             // part label, see the course's part list
  "title": "什么是 AI 智能体",   // Chinese lesson title
  "short": "认识智能体",         // 2–6 characters for the lesson bar
  "min": 25,                    // estimated minutes
  "srcUrl": "https://github.com/microsoft/ai-agents-for-beginners/blob/main/translations/zh-CN/01-intro-to-ai-agents/README.md",
  "goal": "学完这课，你能……",   // one sentence, from the lesson's learning goals
  "idea": ["<p>…</p>", "…"],     // 先搞懂: 3–8 HTML blocks covering ALL key concepts of the lesson
  "mainTitle": "跟着看",         // optional section title
  "main": [STEP, …],            // 3–7 steps: read the lesson / open the sample with Claude Code
  "turn": [STEP, …],            // 3–5 steps: a design exercise on Essa's business
  "check": [STEP, …],           // 2–4 self-check steps (w: "look")
  "warn": ["<p>…</p>"],          // 1–3 pitfalls or limits the lesson states (optional)
  "quiz": [{ "q": "…", "o": ["…","…","…"], "a": 1, "e": "explanation" }],   // exactly 4, answer index a
  "cards": [["term", "meaning"]],  // 3–5 flashcards: key terms of this lesson
  "video": VIDEO                // the demo video script, see below
}
```

STEP:

```json
{ "w": "web|claude|term|edit|look",   // where: browser / Claude Code / terminal / editor / just read
  "html": "<p>…</p>",                 // what to do
  "code": [{ "lang": "Claude|终端|Python|JSON|Markdown", "text": "exact text to type or show" }],
  "after": "<p class=\"tr\">意思：…</p>",   // optional HTML after the code
  "expect": "what Essa should see",       // optional, plain text or inline HTML
  "stuck": [{ "q": "问题？", "a": "<p>answer</p>" }]  // optional collapsible fixes / hints
}
```

VIDEO (rendered by `learning-path/video/src/Generic.tsx`; event times are automatic):

```json
{
  "hook": { "bubble": "a line Claude says, 14–22 chars", "slam": "2–6 chars + ！ or ？", "title": "8–14 chars" },
  "chapters": ["2–3 chars", "x4"],
  "scenes": [SCENE, SCENE, SCENE, SCENE],      // one per chapter, in order, chapter 0..3
  "takeaways": [["4–6 chars", "4–8 chars"], ["…","…"], ["…","…"]],
  "quiz": { "q": "≤ 22 chars", "a": "≤ 22 chars" },
  "outro": "three short items joined by ' · '",
  "narration": { "Hook": "…", "S1": "…", "S2": "…", "S3": "…", "S4": "…", "Takeaways": "记住三件事：…", "Quiz": "考你一题：…？三，二，一。答案：…。", "Outro": "现在回到网页，…" }
}
```

SCENE is one of (all text Chinese unless code):
- `{ "type": "cards", "chapter": 0, "caption": "≤ 22 chars", "hi": "word in caption", "heading": "≤ 14 chars", "cards": [{ "t": "≤ 16 chars", "b": "≤ 20 chars, optional", "color": "navy|ok|bad|yellow" }] }` (2–4 cards)
- `{ "type": "panel", "chapter": 1, "caption": "…", "hi": "…", "heading": "…", "rows": [["left ≤ 16", "right ≤ 12"]], "hiRows": [1], "mono": false }` (3–5 rows)
- `{ "type": "code", "chapter": 2, "caption": "…", "hi": "…", "file": "path · 说明", "lines": ["≤ 64 chars each"], "hiLines": [0], "stamp": { "text": "≤ 6 chars", "color": "ok", "f": 0.6 } }` (≤ 9 lines; real code from the sample, trimmed with …)
- `{ "type": "term", "chapter": 3, "caption": "…", "hi": "…", "title": "窗口 A · Claude Code", "tag": "A", "lines": [{ "f": 0.05, "kind": "you|claude|cmd|ok|dim|out", "text": "…" }] }` (f = 0..0.85 position in scene)

Narration: spoken Chinese, 1.12x speed; Hook 45–65 characters, each S 40–70, Takeaways 30–45, Quiz 35–55,
Outro 20–35. Write English names the way they should be read (e.g. "R A G", "M C P" may stay; avoid
symbols like `/`, `@`, `.json` in narration: say 斜杠, at, 点 json). Every narrated claim must be in the
lesson.

## Validation

Run `node learning-path/build/build-course.mjs <course>` after writing; it fails on schema errors.
Run `node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>` for each file.
