"use client";

import { useEffect, useRef, useState } from "react";

// The hky.bio embed view. Override locally with NEXT_PUBLIC_HKYBIO_EMBED_URL
// (e.g. http://localhost:3000/rider/embed) when running hky.bio alongside.
const EMBED_URL =
  process.env.NEXT_PUBLIC_HKYBIO_EMBED_URL ?? "https://hky.bio/rider/embed";

const CARD_WIDTH = 460;

// Outline placeholder shown until the embed posts its first height (i.e. the
// real card has rendered inside the iframe). Mirrors the card's rounded shape.
function CardSkeleton() {
  const bar = (w: string, h = 12) => (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 6,
        background: "var(--moretransblack)",
      }}
    />
  );
  return (
    <div
      aria-hidden
      className="animate-pulse"
      style={{
        width: "100%",
        maxWidth: CARD_WIDTH,
        margin: "0 auto",
        borderRadius: "2rem",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* hero block */}
      <div style={{ height: 240, background: "var(--moretransblack)" }} />
      {/* body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          padding: "24px 28px 36px",
        }}
      >
        {bar("55%", 20)}
        {bar("40%")}
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 34,
                height: 34,
                borderRadius: "9999px",
                background: "var(--moretransblack)",
              }}
            />
          ))}
        </div>
        <div
          style={{
            width: "100%",
            height: 52,
            borderRadius: "9999px",
            background: "var(--moretransblack)",
            marginTop: 8,
          }}
        />
        {bar("90%", 64)}
        {bar("90%", 64)}
      </div>
    </div>
  );
}

export function HkyBioEmbed() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  // Generous first paint so the card shows before the height handshake lands.
  const [height, setHeight] = useState(1100);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let allowedOrigin: string | null = null;
    try {
      allowedOrigin = new URL(EMBED_URL).origin;
    } catch {
      allowedOrigin = null;
    }

    function onMessage(event: MessageEvent) {
      // Only trust height messages from the embed's own origin.
      if (allowedOrigin && event.origin !== allowedOrigin) return;
      const data = event.data;
      if (
        data &&
        data.type === "hkybio-embed-height" &&
        typeof data.height === "number"
      ) {
        setHeight(Math.max(400, Math.ceil(data.height)));
        // First height message means the card has rendered: reveal it.
        setLoaded(true);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: loaded ? 0 : 640 }}>
      {!loaded && (
        <div style={{ position: "absolute", inset: 0 }}>
          <CardSkeleton />
        </div>
      )}
      <iframe
        ref={frameRef}
        src={EMBED_URL}
        title="Rider McCallum on hky.bio"
        loading="lazy"
        style={{
          display: "block",
          // Match the card width so the iframe IS the card — no surrounding space.
          width: "100%",
          maxWidth: CARD_WIDTH,
          margin: "0 auto",
          height,
          border: 0,
          borderRadius: "2rem",
          overflow: "hidden",
          background: "transparent",
          colorScheme: "normal",
          opacity: loaded ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      />
    </div>
  );
}
