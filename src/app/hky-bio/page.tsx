import { HkyBioEmbed } from "@/components/HkyBioEmbed";

export const metadata = {
  title: "hky.bio",
  description: "My hky.bio player profile: stats, highlights, and career.",
};

export default function HkyBioPage() {
  return (
    <section>
      <div className="mt-2 mb-8 flex flex-wrap justify-center gap-x-5 gap-y-1">
        <a
          href="https://hky.bio/rider"
          target="_blank"
          rel="noopener noreferrer"
          className="tag"
        >
          full profile
        </a>
        <a
          href="https://hky.bio"
          target="_blank"
          rel="noopener noreferrer"
          className="tag"
        >
          about hky.bio
        </a>
      </div>

      <HkyBioEmbed />
    </section>
  );
}
