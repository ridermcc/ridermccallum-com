import { HkyBioEmbed } from "@/components/HkyBioEmbed";
import { EmailCopy } from "@/components/EmailCopy";

export const metadata = {
  title: "hky.bio",
  description: "My hky.bio player profile: stats, highlights, and career.",
};

export default function HkyBioPage() {
  return (
    <section>
      <div className="mt-2 mb-8">
        <p>
          hky.bio is a platform that gives players control over the way they are seen online. 
          We&apos;re now working with a few great athletes to collaborate on their ideas 
          (
          <a
            href="https://hky.bio/skateskalde"
            target="_blank"
            rel="noopener noreferrer"
            className="tag"
          >
            Skate Skalde
          </a>
          ,{" "}
          <a
            href="https://hky.bio/shane"
            target="_blank"
            rel="noopener noreferrer"
            className="tag"
          >
            Shane Hanna
          </a>
          ,{" "}
          <a
            href="https://hky.bio/johnnyramoundos"
            target="_blank"
            rel="noopener noreferrer"
            className="tag"
          >
            Johnny Ramoundos
          </a>
          , to name a few). If you&apos;re a
          player interested in being a part of the a platform actually built for players, email me at <EmailCopy email="rider@hky.bio" />.
        </p>
      </div>

      <hr className="my-8" />

      <HkyBioEmbed />

      <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-1">
        <a
          href="https://hky.bio"
          target="_blank"
          rel="noopener noreferrer"
          className="tag"
        >
          visit hky.bio
        </a>
      </div>
    </section>
  );
}
