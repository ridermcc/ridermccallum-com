import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

// Keystatic's "Preview" button lands here. Draft mode is only turned on for
// someone signed in to the editor: their Keystatic GitHub token must have push
// access to the site repo. Everyone else gets a 401.

const REPO = "ridermcc/ridermccallum-com";
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function canEdit(token: string): Promise<boolean> {
  const res = await fetch(`https://api.github.com/repos/${REPO}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (!res.ok) return false;
  const repo = (await res.json()) as { permissions?: { push?: boolean } };
  return repo.permissions?.push === true;
}

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  if (!SLUG.test(slug)) return new Response("Bad slug", { status: 400 });

  // In dev the editor uses local files and drafts already render.
  if (process.env.NODE_ENV !== "production") redirect(`/posts/${slug}`);

  const token = (await cookies()).get("keystatic-gh-access-token")?.value;
  if (!token || !(await canEdit(token))) {
    return new Response("Sign in at /keystatic first, then use Preview again.", {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    });
  }

  (await draftMode()).enable();
  redirect(`/posts/${slug}`);
}
