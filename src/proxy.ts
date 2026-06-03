import { NextResponse } from "next/server";

// Whole-site maintenance switch.
// While this file exists, every route returns a 503 with the page below.
// To bring the site back up, delete this file (src/proxy.ts).

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Down for maintenance · Rider McCallum</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      html, body { height: 100%; margin: 0; }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: #09090b;
        color: #fafafa;
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        text-align: center;
      }
      main { max-width: 32rem; }
      h1 {
        margin: 0 0 1rem;
        font-size: clamp(1.75rem, 5vw, 2.5rem);
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      p {
        margin: 0;
        font-size: 1.05rem;
        line-height: 1.6;
        color: #a1a1aa;
      }
      .tag {
        display: inline-block;
        margin-bottom: 1.5rem;
        font-size: 0.75rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #71717a;
      }
    </style>
  </head>
  <body>
    <main>
      <span class="tag">Rider McCallum</span>
      <h1>Down for maintenance</h1>
      <p>The site is temporarily offline while I make some changes.</p>
    </main>
  </body>
</html>`;

export function proxy() {
  return new NextResponse(page, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "retry-after": "3600",
      "cache-control": "no-store",
    },
  });
}

export const config = {
  // Run on everything except Next.js internals and static assets,
  // so the page renders without dragging in the old build.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
