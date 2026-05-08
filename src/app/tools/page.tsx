import { CardLink } from "@/components/CardLink";
import { Container, PageHeader } from "@/components/Container";
import { getTools } from "@/lib/content";

export const metadata = {
  title: "Tools",
  description:
    "Clone-able dashboards, skills, and Claude Code projects for hockey players, coaches, and agents.",
};

export default async function ToolsIndex() {
  const tools = await getTools();

  return (
    <Container>
      <PageHeader
        eyebrow="Tools"
        title="Things you can clone."
        lede="Dashboards, skills, and Claude Code projects built for hockey players, coaches, and agents. Each one comes with a quick setup flow — clone, run, customize."
      />

      {tools.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          Nothing here yet. Check back soon.
        </p>
      ) : (
        <section className="flex flex-col gap-3">
          {tools.map((t) => (
            <CardLink
              key={t.slug}
              href={`/tools/${t.slug}`}
              title={t.title}
              blurb={t.summary}
              meta={t.status ?? "Live"}
            />
          ))}
        </section>
      )}
    </Container>
  );
}
