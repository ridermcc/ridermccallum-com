# Blog editor

Posts are written at **/keystatic** using [Keystatic](https://keystatic.com), an open-source editor that saves posts as files in this repo. There is no database.

- **In dev** (`npm run dev`, then http://127.0.0.1:3000/keystatic): reads and writes `src/content/posts/*.mdx` on disk.
- **In production** (https://ridermccallum.com/keystatic): signs in with GitHub and commits each save to `main`. Vercel then redeploys (about a minute).

## Writing a post

1. Open /keystatic, then **Posts**, then **Add**.
2. Fill in the title. The URL slug fills itself. Don't change the slug after publishing.
3. Write in the Content box. Type `/` (or tap **+** in the toolbar) to insert a **Figure**, **Photo grid** or **Video**. Tap a block, then **Edit**, to change it.
4. **Create** / **Save** commits. New posts start as drafts.

## Drafts and publishing

- A post with **Draft** ticked is left out of the production build: it is not in /posts, tag pages, or its own URL.
- **Preview** a draft from the editor (the `…` menu on a post). It opens the real post page with a "Draft" banner. This only works while signed in to /keystatic: `/api/preview` checks your Keystatic GitHub token has push access to the repo. **Exit preview** turns it off.
- **Publish**: untick Draft and save.
- In dev, drafts always show, marked "(draft)".

## Photos and video

- Uploads land in `public/notes/<slug>/` and are referenced as `/notes/<slug>/<file>`, the same place `scripts/import-photos.sh` writes.
- Phone photos can be uploaded as-is. `Figure` and `PhotoGrid` serve `/notes/` images through Next's image optimizer, so readers get resized versions.
- Large videos (over ~50 MB) should still go through `scripts/import-photos.sh`. GitHub rejects files over 100 MB.

## Post format

Posts are MDX with YAML frontmatter:

```mdx
---
title: "Post title"
draft: false
summary: "One line."
date: 2026-11-13
tags:
  - hockey
---

Body. <Figure src="/notes/slug/photo.jpg" alt="Caption" />
```

`remark-mdx-frontmatter` turns the frontmatter into the `metadata` export the site reads. The editor cannot open posts with `import`/`export` lines or raw HTML tags (use markdown links; external links open in a new tab automatically). To convert an old `export const metadata` post: `node scripts/to-frontmatter.mjs`.

Saving a post in the editor reformats its file (props on one line, `*` bullets). The rendered page is unchanged.

## One-time setup (GitHub sign-in for production)

1. Locally, start the dev server in GitHub mode:
   ```
   NEXT_PUBLIC_KEYSTATIC_STORAGE=github npm run dev
   ```
2. Open http://127.0.0.1:3000/keystatic and click **Create GitHub App**. Name it (e.g. `ridermccallum-com-editor`) and finish the GitHub flow. Keystatic writes four values to `.env` (gitignored):
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
3. Install the GitHub App on `ridermcc/ridermccallum-com` only (GitHub, then Settings, then Applications, then the app, then Configure).
4. In the GitHub App's settings, add the production callback URL:
   `https://ridermccallum.com/api/keystatic/github/oauth/callback`
   (keep the `127.0.0.1` one for local use).
5. Add the four values to the Vercel project (Production environment), then redeploy.
6. Open https://ridermccallum.com/keystatic on your phone, sign in with GitHub, and add it to the home screen.

Until step 5 is done, `/api/keystatic/*` answers 503 in production and the site builds normally.

## Files

- `keystatic.config.tsx`: collection schema and the Figure / PhotoGrid / Video blocks.
- `src/app/keystatic/`: the editor (its own root layout, full screen).
- `src/app/api/keystatic/[...params]/route.ts`: Keystatic's GitHub auth and API.
- `src/app/api/preview/`: draft preview on and off.
- `src/components/editor/previews.tsx`: photo thumbnails inside the editor.
- `src/lib/content.ts`: `SHOW_DRAFTS` and draft filtering.
- `src/lib/img.ts`: image optimizer srcset for post photos.
