// Generates the Chinese voiceover with MiniMax T2A v2 (non-streaming HTTP).
// Usage: MINIMAX_API_KEY=... node scripts/voiceover.mjs [lesson]   (default b-1)
// Optional: MINIMAX_API_HOST (default api.minimax.io; mainland accounts use api.minimaxi.com),
//           MINIMAX_SPEED (default 1.12), MINIMAX_EMOTION (default happy; empty for none),
//           MINIMAX_VOICE_ID (default male-qn-jingying), MINIMAX_MODEL (default speech-2.6-hd).
// Writes public/voice/<lesson>/<scene>.mp3 and src/voice.gen.json (lengths in ms).
// It never prints the key.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lesson = process.argv[2] || "b-1";
const key = process.env.MINIMAX_API_KEY;
if (!key) {
  console.error("MINIMAX_API_KEY is not set.");
  process.exit(2);
}
const host = process.env.MINIMAX_API_HOST || "api.minimax.io";
const voice = process.env.MINIMAX_VOICE_ID || "male-qn-jingying";
const model = process.env.MINIMAX_MODEL || "speech-2.6-hd";
const speed = Number(process.env.MINIMAX_SPEED || 1.12);
const emotion = process.env.MINIMAX_EMOTION || "happy";

// Read the narration table from the TypeScript source without a TS toolchain.
const src = readFileSync(join(root, "src", "narration.ts"), "utf8");
const block = src.slice(src.indexOf(`"${lesson}": {`));
const lines = {};
for (const m of block.slice(0, block.indexOf("\n  },")).matchAll(/^\s+(\w+):\s*"((?:[^"\\]|\\.)*)",?$/gm)) lines[m[1]] = m[2];
if (!Object.keys(lines).length) {
  console.error(`No narration for ${lesson} in src/narration.ts`);
  process.exit(2);
}

const outDir = join(root, "public", "voice", lesson);
mkdirSync(outDir, { recursive: true });
const genPath = join(root, "src", "voice.gen.json");
const gen = existsSync(genPath) ? JSON.parse(readFileSync(genPath, "utf8")) : {};
gen[lesson] = {};

for (const [scene, text] of Object.entries(lines)) {
  const res = await fetch(`https://${host}/v1/t2a_v2`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      text,
      stream: false,
      language_boost: "Chinese",
      output_format: "hex",
      voice_setting: { voice_id: voice, speed, vol: 1.0, pitch: 0, ...(emotion ? { emotion } : {}) },
      audio_setting: { sample_rate: 32000, bitrate: 128000, format: "mp3", channel: 1 },
    }),
  });
  const body = await res.json().catch(() => ({}));
  const code = body?.base_resp?.status_code;
  if (!res.ok || code !== 0 || !body?.data?.audio) {
    console.error(`${scene}: failed (HTTP ${res.status}, status_code ${code}, ${body?.base_resp?.status_msg ?? "no message"}, trace ${body?.trace_id ?? "-"})`);
    process.exit(1);
  }
  writeFileSync(join(outDir, `${scene}.mp3`), Buffer.from(body.data.audio, "hex"));
  gen[lesson][scene] = body.extra_info?.audio_length ?? 0;
  console.log(`${scene}: ${gen[lesson][scene]} ms`);
}
writeFileSync(genPath, JSON.stringify(gen, null, 2) + "\n");
console.log(`Voice: ${voice}, model: ${model}, speed: ${speed}, emotion: ${emotion || "-"}, host: ${host}`);
