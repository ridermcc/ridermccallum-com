import { collection, config, fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { FigurePreview, PhotoGridPreview, VideoPreview } from "@/components/editor/previews";

// Post editor at /keystatic. In dev it reads and writes the files on disk.
// In production it signs in with GitHub and commits straight to main, which
// triggers a Vercel deploy. Setup steps: docs/blog-editor.md.
//
// NEXT_PUBLIC_KEYSTATIC_STORAGE=github forces GitHub mode in dev. It is only
// needed once, to run Keystatic's "Create GitHub App" setup locally.
const useGitHub =
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";

// Uploads land in public/notes/<post-slug>/ and are referenced as
// /notes/<post-slug>/<file>, matching scripts/import-photos.sh.
const media = { directory: "public/notes", publicPath: "/notes/" };

export default config({
  storage: useGitHub
    ? { kind: "github", repo: "ridermcc/ridermccallum-com" }
    : { kind: "local" },
  ui: {
    brand: { name: "ridermccallum.com" },
  },
  collections: {
    posts: collection({
      label: "Posts",
      path: "src/content/posts/*",
      slugField: "title",
      entryLayout: "content",
      format: { contentField: "content" },
      columns: ["title", "date"],
      previewUrl: "/api/preview?slug={slug}",
      parseSlugForSort: (slug) => slug,
      schema: {
        title: fields.slug({
          name: { label: "Title" },
          slug: { label: "URL slug", description: "Becomes /posts/<slug>. Don't change it after publishing." },
        }),
        draft: fields.checkbox({
          label: "Draft",
          description: "Drafts are hidden on the live site. Untick and save to publish.",
          defaultValue: true,
        }),
        summary: fields.text({ label: "Summary", multiline: true }),
        date: fields.date({ label: "Date", defaultValue: { kind: "today" } }),
        updated: fields.date({ label: "Updated", description: "Optional. Shows as \"last updated on\"." }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        content: fields.mdx({
          label: "Content",
          options: { image: media },
          components: {
            Figure: block({
              label: "Figure",
              description: "A photo with an optional caption.",
              ContentView: FigurePreview,
              schema: {
                src: fields.image({ label: "Photo", ...media, validation: { isRequired: true } }),
                alt: fields.text({ label: "Alt text / caption" }),
                hideCaption: fields.checkbox({ label: "Hide caption" }),
              },
            }),
            PhotoGrid: block({
              label: "Photo grid",
              description: "Several photos in a grid.",
              ContentView: PhotoGridPreview,
              schema: {
                photos: fields.array(
                  fields.object({
                    src: fields.image({ label: "Photo", ...media, validation: { isRequired: true } }),
                    alt: fields.text({ label: "Alt text" }),
                  }),
                  { label: "Photos", itemLabel: (props) => props.fields.alt.value || "Photo" },
                ),
                cols: fields.integer({
                  label: "Columns",
                  defaultValue: 2,
                  validation: { min: 1, max: 4 },
                }),
                aspect: fields.select({
                  label: "Crop",
                  options: [
                    { label: "Natural", value: "" },
                    { label: "Square", value: "square" },
                    { label: "4:3", value: "4/3" },
                    { label: "3:2", value: "3/2" },
                  ],
                  defaultValue: "",
                }),
              },
            }),
            Video: block({
              label: "Video",
              description: "Phone clips over ~50 MB: use scripts/import-photos.sh instead.",
              ContentView: VideoPreview,
              schema: {
                src: fields.file({ label: "Video file", ...media, validation: { isRequired: true } }),
                poster: fields.image({ label: "Poster image", ...media }),
                alt: fields.text({ label: "Caption" }),
                wide: fields.checkbox({ label: "Landscape (full width)" }),
                hideCaption: fields.checkbox({ label: "Hide caption" }),
              },
            }),
          },
        }),
      },
    }),
  },
});
