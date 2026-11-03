// Compares the lessons that learning-path/index.html translates with a git ref.
// Usage: node learning-path/check-sources.mjs [ref]   (default ref: upstream/main)
// Prints a Markdown report. Exit code: 0 when every lesson is unchanged,
// 1 when at least one changed or is missing, 2 on a usage or git error.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ref = process.argv[2] || "upstream/main";
const here = dirname(fileURLToPath(import.meta.url));
const sources = JSON.parse(readFileSync(join(here, "sources.json"), "utf8"));

function blob(path) {
  try {
    return execFileSync("git", ["rev-parse", "--verify", "--quiet", `${ref}:${path}`], { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

try {
  execFileSync("git", ["rev-parse", "--verify", "--quiet", ref], { stdio: "ignore" });
} catch {
  console.log(`Cannot read git ref \`${ref}\`. Fetch the upstream main branch first.`);
  process.exit(2);
}

const changed = [];
for (const [path, recorded] of Object.entries(sources.files)) {
  const now = blob(path);
  if (now !== recorded) changed.push({ path, state: now ? "changed" : "missing" });
}

if (changed.length === 0) {
  console.log(`All ${Object.keys(sources.files).length} translated lessons match \`${ref}\`. The page is up to date.`);
  process.exit(0);
}

console.log(`## 带练页需要按原课程更新\n`);
console.log(`These lessons changed upstream since the page was last updated from ${sources.upstreamCommit} (${sources.verifiedAgainst}):\n`);
for (const c of changed) {
  const url = `${sources.upstream}/commits/main/${c.path}`;
  console.log(`- \`${c.path}\`: ${c.state} ([history](${url}))`);
}
console.log(`\nTo update: ask Claude Code to bring learning-path/index.html up to date with these lessons, then update learning-path/sources.json.`);
process.exit(1);
