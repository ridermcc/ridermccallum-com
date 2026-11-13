import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

// In production Keystatic needs its GitHub App credentials (docs/blog-editor.md).
// Until they are set, answer 503 instead of failing the whole build.
const configured =
  process.env.NODE_ENV !== "production" ||
  Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
      process.env.KEYSTATIC_SECRET,
  );

function notConfigured() {
  return new Response("Editor not configured: set the KEYSTATIC_* env vars.", { status: 503 });
}

export const { GET, POST } = configured
  ? makeRouteHandler({ config })
  : { GET: notConfigured, POST: notConfigured };
