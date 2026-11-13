<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Blog editor

Posts can be written and published from /keystatic (Keystatic, git-based). See `docs/blog-editor.md`. Posts use YAML frontmatter with a `draft` flag, and must stay editor-compatible: no `import`/`export` lines and no raw HTML tags in post MDX. Use markdown links and the registered components (`Figure`, `PhotoGrid`, `Video`).

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

Use the `<Video>` component (it sets `preload="metadata"` so nothing downloads until play):

```jsx
<Video src="/notes/<slug>/<name>.mp4" poster="/notes/<slug>/<name>-poster.jpg" alt="Caption" />
```

Rules of thumb:
- Don't commit originals — they're too big and not needed at runtime.
- Don't put images directly in `src/content/`; only the MDX lives there.
- Don't autoplay video; respect the reader's data and attention.
- Photos uploaded from the editor also land in `public/notes/<slug>/`. They are served resized via the image optimizer, so phone originals are acceptable there.
