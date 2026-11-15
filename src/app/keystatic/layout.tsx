import type { Metadata, Viewport } from "next";
import KeystaticApp from "./keystatic";

// Separate root layout: the editor runs full-screen, outside the blog column.

export const metadata: Metadata = {
  title: "Editor · ridermccallum.com",
  robots: { index: false, follow: false },
};

// Stops iOS Safari from zooming in when a field gets focus.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function KeystaticLayout() {
  return (
    <html lang="en-us">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
