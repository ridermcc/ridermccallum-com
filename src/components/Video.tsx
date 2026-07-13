/**
 * Friendly inline video. Phone clips are portrait, and shown full-bleed they
 * swallow the page. So by default we center them in a constrained, phone-ish
 * column with the same border treatment as the photos. Pass `wide` for footage
 * that is actually landscape and should fill the content width.
 *
 * `alt` describes the clip: it becomes the video's aria-label (video has no
 * alt attribute) and, like <Figure>, renders as a subtle caption underneath.
 * Pass `hideCaption` to keep the aria-label but drop the visible caption.
 */
export function Video({
  src,
  poster,
  wide = false,
  alt,
  hideCaption = false,
}: {
  src: string;
  poster?: string;
  wide?: boolean;
  alt?: string;
  hideCaption?: boolean;
}) {
  return (
    <figure>
      <video
        src={src}
        poster={poster}
        aria-label={alt || undefined}
        controls
        preload="metadata"
        playsInline
        className={
          wide
            ? "w-full border border-border"
            : "mx-auto w-full max-w-sm border border-border"
        }
      />
      {alt && !hideCaption ? <figcaption>{alt}</figcaption> : null}
    </figure>
  );
}
