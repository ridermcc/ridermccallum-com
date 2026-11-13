import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostsByTag, getTags } from "@/lib/content";
import { PostList } from "@/components/PostList";
import { Tags } from "@/components/Tags";

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({ tag }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag}`, description: `Posts tagged #${tag}.` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const [posts, allTags] = await Promise.all([getPostsByTag(tag), getTags()]);
  if (!posts.length) notFound();

  return (
    <section>
      <Tags tags={allTags} active={tag} className="mt-2" />
      <hr className="my-8" />
      <h3 className="mb-4">Posts tagged #{tag}</h3>
      <PostList posts={posts} />
    </section>
  );
}
