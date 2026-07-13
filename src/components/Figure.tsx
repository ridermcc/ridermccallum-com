import type { ComponentPropsWithoutRef } from "react";

// A standalone post image with its alt text shown as a subtle caption beneath.
// Use in MDX in place of a bare <img> when you want the caption to render:
//   <Figure src="/notes/<slug>/photo.jpg" alt="What's in the photo" />
// Pass hideCaption to keep the alt (for accessibility and the lightbox) but
// drop the visible caption underneath:
//   <Figure src="..." alt="..." hideCaption />
// Grid galleries keep using <PhotoGrid>, which stays uncaptioned.
export function Figure({
  alt,
  hideCaption = false,
  ...props
}: ComponentPropsWithoutRef<"img"> & { hideCaption?: boolean }) {
  return (
    <figure>
      <img alt={alt} loading="lazy" {...props} />
      {alt && !hideCaption ? <figcaption>{alt}</figcaption> : null}
    </figure>
  );
}
