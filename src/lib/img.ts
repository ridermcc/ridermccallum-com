import { getImageProps } from "next/image";

// Photos uploaded from the editor arrive at full phone resolution. Route post
// images through Next's image optimizer so readers get a resized srcset
// instead of the original file. Anything outside /notes/ passes through as is.
export function optimizedImg(src: unknown, sizes: string) {
  if (typeof src !== "string" || !src.startsWith("/notes/")) return { src: src as string | undefined };
  const { props } = getImageProps({ src, alt: "", fill: true, sizes });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
}
