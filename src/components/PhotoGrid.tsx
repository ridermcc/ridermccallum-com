type Photo = { src: string; alt: string };

const COLS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function PhotoGrid({
  photos,
  cols = 3,
}: {
  photos: Photo[];
  cols?: 1 | 2 | 3 | 4;
}) {
  if (cols === 1) {
    return (
      <div className="not-prose my-6 flex flex-col items-center gap-3">
        {photos.map((p) => (
          <a
            key={p.src}
            href={p.src}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-[280px]"
          >
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              className="w-full rounded-lg border border-border transition-opacity hover:opacity-90"
            />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={`not-prose my-6 grid grid-cols-1 ${COLS[cols]} gap-3`}>
      {photos.map((p) => (
        <a
          key={p.src}
          href={p.src}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={p.src}
            alt={p.alt}
            loading="lazy"
            className="w-full rounded-lg border border-border transition-opacity hover:opacity-90"
          />
        </a>
      ))}
    </div>
  );
}
