import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-2 py-8 text-center text-sm">
      <p style={{ color: "var(--muted)" }}>
        &copy; {year} {site.author}. Site inspired by <a className="inspiration-link" href={site.inspiration.url}>{site.inspiration.name}</a>.
      </p>

    </footer>
  );
}
