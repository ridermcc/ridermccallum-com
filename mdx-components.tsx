import type { MDXComponents } from "mdx/types";
import { PhotoGrid } from "@/components/PhotoGrid";

const components: MDXComponents = {
  PhotoGrid,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
