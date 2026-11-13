// One-off: convert posts that still open with `export const metadata = {...}`
// to YAML frontmatter, which the /keystatic editor needs.
//   node scripts/to-frontmatter.mjs            (defaults to src/content/posts)
// Posts already on frontmatter are skipped. Raw <a> tags must also become
// markdown links; external links get target=_blank automatically.
import fs from "node:fs";
const dir = process.argv[2] ?? "src/content/posts";
for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".mdx"))) {
  const p = `${dir}/${f}`; const src = fs.readFileSync(p, "utf8");
  const m = src.match(/^export const metadata = (\{[\s\S]*?\n\});\n/);
  if (!m) { console.log("skip", f); continue; }
  const meta = new Function(`return ${m[1]}`)();
  const q = s => JSON.stringify(s);
  let y = "---\n";
  if (meta.title != null) { y += `title: ${q(meta.title)}\n`; delete meta.title; }
  y += `draft: ${meta.draft === true}\n`;
  for (const k of ["summary","date","updated"]) if (meta[k] != null) y += `${k}: ${q(meta[k])}\n`;
  if (meta.tags) y += `tags:\n${meta.tags.map(t => `  - ${t}`).join("\n")}\n`;
  const extra = Object.keys(meta).filter(k => !["title","draft","summary","date","updated","tags"].includes(k));
  if (extra.length) console.log("EXTRA KEYS", f, extra);
  y += "---\n";
  fs.writeFileSync(p, y + src.slice(m[0].length));
  console.log("ok", f);
}
