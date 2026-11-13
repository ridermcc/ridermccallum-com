import { getPosts, getTags } from "@/lib/content";
import { PostList } from "@/components/PostList";
import { Tags } from "@/components/Tags";

export const metadata = {
  title: "Posts",
  description: "Everything I've written.",
};

export default async function PostsIndex() {
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);

  return (
    <section>
      <Tags tags={tags} className="mt-2" />
      <hr className="my-8" />
      <h3 className="mb-4">All posts</h3>
      {posts.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>Nothing here yet.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </section>
  );
}
