type Photo = { src: string; alt: string };

const COLS = {
  2: "sm:columns-2",
  3: "sm:columns-2 lg:columns-3",
  4: "sm:columns-2 lg:columns-4",
} as const;

export function PhotoGrid({
  photos,
  cols = 3,
}: {
  photos: Photo[];
  cols?: 2 | 3 | 4;
}) {
  return (
    <div className={`not-prose my-6 columns-1 ${COLS[cols]} gap-3`}>
      {photos.map((p) => (
        <a
          key={p.src}
          href={p.src}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 block break-inside-avoid"
        >
          <img
            src={p.src}
            alt={p.alt}
            loading="lazy"
            className="w-full rounded-lg border border-zinc-200 transition-opacity hover:opacity-90 dark:border-zinc-800"
          />
        </a>
      ))}
    </div>
  );
}
