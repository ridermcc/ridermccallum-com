"use client";

import { useEffect, useMemo } from "react";

// Small in-editor previews for the post components, so a Figure or PhotoGrid
// shows its photos inside the Keystatic editor instead of an empty box.

type Asset = { data: Uint8Array; extension: string; filename: string } | null;

function useObjectUrl(file: Asset) {
  const url = useMemo(
    () => (file?.data ? URL.createObjectURL(new Blob([file.data as BlobPart])) : null),
    [file],
  );
  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
  }, [url]);
  return url;
}

function Thumb({ file, alt }: { file: Asset; alt: string }) {
  const url = useObjectUrl(file);
  if (!url) return <div style={empty}>No photo</div>;
  return <img src={url} alt={alt} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />;
}

const empty = { padding: 12, fontSize: 13, color: "#6b7280" } as const;
const caption = { margin: "6px 0 0", fontSize: 13, color: "#6b7280" } as const;

export function FigurePreview({ value }: { value: { src: Asset; alt: string; hideCaption: boolean } }) {
  return (
    <div>
      <div style={{ maxHeight: 240, overflow: "hidden", borderRadius: 6 }}>
        <Thumb file={value.src} alt={value.alt} />
      </div>
      {value.alt ? <p style={caption}>{value.hideCaption ? `(hidden) ${value.alt}` : value.alt}</p> : null}
    </div>
  );
}

export function PhotoGridPreview({
  value,
}: {
  value: { photos: readonly { src: Asset; alt: string }[]; cols: number | null };
}) {
  if (!value.photos.length) return <div style={empty}>No photos yet. Tap Edit to add some.</div>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(value.cols ?? 2, 3)}, 1fr)`, gap: 4 }}>
      {value.photos.map((p, i) => (
        <div key={i} style={{ aspectRatio: "1", overflow: "hidden", borderRadius: 4 }}>
          <Thumb file={p.src} alt={p.alt} />
        </div>
      ))}
    </div>
  );
}

export function VideoPreview({ value }: { value: { src: Asset; poster: Asset; alt: string } }) {
  return (
    <div>
      <div style={{ maxHeight: 200, maxWidth: 160, overflow: "hidden", borderRadius: 6 }}>
        <Thumb file={value.poster} alt={value.alt} />
      </div>
      <p style={caption}>{value.src?.filename ?? "No video file"}{value.alt ? ` · ${value.alt}` : ""}</p>
    </div>
  );
}
