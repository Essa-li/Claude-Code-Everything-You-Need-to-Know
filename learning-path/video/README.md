# Lesson demo videos

Remotion source for the demo animations in `../index.html` (output in `../videos/`).
The animations are illustrations, labelled as such in every frame; they are not screen recordings.

```bash
npm i
node scripts/pick-fonts.mjs   # copies only the needed font subsets into public/fonts
MINIMAX_API_HOST=api.minimaxi.com MINIMAX_API_KEY=... node scripts/voiceover.mjs b-1   # voiceover
npx remotion studio            # preview
npx remotion render b-1 ../videos/b-1.mp4 --codec=h264 --crf=30
npx remotion still b-1 ../videos/b-1-poster.jpg --frame=140 --image-format=jpeg
```

In a sandbox without a downloadable browser, add `--browser-executable=<path to chrome-headless-shell>`.
