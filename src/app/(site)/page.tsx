import { getPosts, getTags } from "@/lib/content";
import { PostList } from "@/components/PostList";
import { Tags } from "@/components/Tags";
import { site } from "@/lib/site";

export default async function Home() {
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);
  const recent = posts.slice(0, 5);

  return (
    <section>
      <p className="mt-2">{site.about}</p>

      <hr className="my-8" />

      <h3 className="mb-4">Recent posts</h3>
      <PostList posts={recent} />

      <Tags tags={tags} heading="View posts by tag" className="mt-16" />
    </section>
  );
}
