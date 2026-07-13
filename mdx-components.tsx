import type { MDXComponents } from "mdx/types";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Video } from "@/components/Video";
import { Figure } from "@/components/Figure";

const components: MDXComponents = {
  PhotoGrid,
  Video,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
