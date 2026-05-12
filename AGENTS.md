<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Photo workflow

Originals (HEIC straight off the phone, full-size JPGs, MOVs) live **outside** this repo:

```
~/Desktop/claude/photos/<slug>/
```

For each post, drop the originals in a folder named with the post slug (e.g. `grad-2026/`). Then from this repo:

```
scripts/import-photos.sh <slug>
```

That converts:
- HEIC/JPG/PNG → web JPEG (max 1600px wide, q65)
- MOV/MP4 → h264 mp4 (CRF 32, AAC 80k mono, faststart) + a `<name>-poster.jpg` frame

All output lands in `public/notes/<slug>/<filename>.{jpg,mp4}`.

Reference in MDX as `/notes/<slug>/<filename>.jpg` (or `.mp4`). Filenames are lowercased; keep them descriptive so they read as `alt` hints (e.g. `me-and-panther.jpg`, not `IMG_4823.jpg`).

Use a `<video>` tag with `preload="metadata"` so the page doesn't fetch the file until someone clicks play:

```jsx
<video
  src="/notes/<slug>/<name>.mp4"
  poster="/notes/<slug>/<name>-poster.jpg"
  controls
  preload="metadata"
  playsInline
  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800"
/>
```

Rules of thumb:
- Don't commit originals — they're too big and not needed at runtime.
- Don't put images directly in `src/content/`; only the MDX lives there.
- Don't autoplay video; respect the reader's data and attention.
