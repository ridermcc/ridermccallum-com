import { Container, PageHeader } from "@/components/Container";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <Container>
      <PageHeader eyebrow="About" title="Hi, I'm Rider." />
      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <p>
          I'm a pro hockey player at the start of my career. This site is where
          I share what I'm building, what I'm learning, and tools that might be
          useful to other players, coaches, and people in the hockey world.
        </p>
        <p>
          I think every player, coach, and agent will be using AI tools like{" "}
          <a href="https://claude.com/claude-code">Claude Code</a> in a few
          years to make their lives better. I want to be useful in that shift —
          building things in public, sharing what works, and making it as easy
          as possible for the next person to clone what I&apos;ve made and
          adapt it.
        </p>
        <p>
          Most of what I post will fall into one of two buckets:
        </p>
        <ul>
          <li>
            <strong>Tools</strong> — dashboards, skills, and small projects you
            can fork. Each one comes with a one-shot Claude Code setup flow so
            you can be up and running in a few minutes.
          </li>
          <li>
            <strong>Notes</strong> — things I&apos;m figuring out, on the ice
            and off it.
          </li>
        </ul>
        <p>
          If you want to get in touch, the source for everything here lives on{" "}
          <a href="https://github.com/ridermcc">GitHub</a>.
        </p>
      </div>
    </Container>
  );
}
