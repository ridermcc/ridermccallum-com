import type { ReactNode } from "react";

type Photo = { src: string; alt: string };

const COLS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

// Optional uniform tile shape. When set, every photo is cropped (object-cover)
// to the same aspect ratio so a grid of mixed portrait/landscape shots reads as
// an even gallery instead of a ragged one. Omit to keep natural heights.
const ASPECT = {
  square: "aspect-square",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
} as const;

export function PhotoGrid({
  photos,
  cols = 3,
  aspect,
  children,
}: {
  photos?: Photo[];
  cols?: 1 | 2 | 3 | 4;
  aspect?: keyof typeof ASPECT;
  children?: ReactNode;
}) {
  // When `children` are passed, each child becomes one cell of the grid (or one
  // item of the stack when cols={1}). This is what makes nesting work: drop a
  // <PhotoGrid cols={1} .../> in as a child and it fills that cell as a column.
  const photoClass = aspect
    ? `h-full w-full object-cover ${ASPECT[aspect]} border border-border transition-opacity hover:opacity-90`
    : "w-full border border-border transition-opacity hover:opacity-90";

  const items =
    children ??
    photos?.map((p) => (
      <img
        key={p.src}
        src={p.src}
        alt={p.alt}
        loading="lazy"
        className={photoClass}
      />
    ));

  if (cols === 1) {
    // No vertical margin here so a nested cols={1} aligns with its sibling cell.
    return <div className="not-prose flex flex-col gap-3">{items}</div>;
  }

  return (
    <div
      className={`not-prose my-6 grid grid-cols-1 ${COLS[cols]} items-stretch gap-3`}
    >
      {items}
    </div>
  );
}
