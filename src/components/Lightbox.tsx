"use client";

import { useEffect, useState } from "react";

/**
 * Dead-simple image viewer. Any click on an <img> inside .blog-post opens it
 * full-size on a dark backdrop. Click anywhere or press Escape to close.
 */
export function Lightbox() {
  const [src, setSrc] = useState<string | null>(null);
  const [alt, setAlt] = useState("");

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" && target.closest(".blog-post")) {
        e.preventDefault();
        const img = target as HTMLImageElement;
        setSrc(img.currentSrc || img.src);
        setAlt(img.alt || "");
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!src) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSrc(null);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [src]);

  if (!src) return null;

  return (
    <div
      onClick={() => setSrc(null)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "1rem",
        cursor: "zoom-out",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: "100%", maxHeight: alt ? "85%" : "100%", objectFit: "contain" }}
      />
      {alt && (
        <p
          style={{
            margin: 0,
            maxWidth: "40rem",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "0.875rem",
            lineHeight: 1.5,
          }}
        >
          {alt}
        </p>
      )}
    </div>
  );
}
