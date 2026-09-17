"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// One of the pencil sketches sits at the very bottom of the page, below the
// footer, peeking up from the bottom edge. A new random pick on every page
// load and navigation (repeats allowed). Picked after mount so server and
// client markup match. Styles in globals.css (.sketch-end).
const sketches = ["laptop", "player", "drawing"] as const;

export function SketchEnd() {
  const pathname = usePathname();
  const [pick, setPick] = useState<(typeof sketches)[number] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPick(sketches[Math.floor(Math.random() * sketches.length)]);
  }, [pathname]);

  if (!pick) return null;
  return (
    <div className={`sketch-end sketch-end-${pick}`} aria-hidden="true">
      <div className="sketch-end-art" />
    </div>
  );
}
