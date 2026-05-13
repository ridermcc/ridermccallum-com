import Link from "next/link";
import { CardLink } from "@/components/CardLink";
import { Container, PageHeader } from "@/components/Container";

const sections = [
  {
    title: "Tools",
    href: "/tools",
    blurb:
      "Projects and platforms I've built, most open-source.",
    meta: "",
  },
  {
    title: "Notes",
    href: "/notes",
    blurb:
      "Things I'm learning, on the ice, off the ice, and in the code.",
    meta: "",
  },
];

export default function Home() {
  return (
    <Container>
      <PageHeader
        eyebrow="Rider McCallum"
        title="Hockey & Software"
        lede="Sharing while playing and building."
      />

      <Link
        href="/notes/welcome"
        className="-mt-8 text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        About this site &rarr;
      </Link>

      <section className="flex flex-col gap-3">
        {sections.map((s) => (
          <CardLink key={s.title} {...s} />
        ))}
      </section>
    </Container>
  );
}
