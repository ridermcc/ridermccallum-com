import { CardLink } from "@/components/CardLink";
import { Container, PageHeader } from "@/components/Container";

const sections = [
  {
    title: "Tools",
    href: "/tools",
    blurb:
      "Dashboards, skills, and Claude Code projects you can clone and use. Built with other players in mind.",
    meta: "Live",
  },
  {
    title: "Notes",
    href: "/notes",
    blurb:
      "Things I'm learning, on the ice, off the ice, and in the code.",
    meta: "Live",
  },
];

export default function Home() {
  return (
    <Container>
      <PageHeader
        eyebrow="Rider McCallum"
        title="Hockey Player / Software Developer"
        lede="Tools, notes, and projects from the overlap of hockey and software, built for other players figuring it out alongside me."
      />

      <section className="flex flex-col gap-3">
        {sections.map((s) => (
          <CardLink key={s.title} {...s} />
        ))}
      </section>
    </Container>
  );
}
