import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SketchEnd } from "@/components/SketchEnd";
import { PencilVariety } from "@/components/PencilVariety";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.title}`,
  },
  description: site.subtitle,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-us" className="antialiased">
      <body className="column flex min-h-screen flex-col">
        <PencilVariety />
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <SketchEnd />
      </body>
    </html>
  );
}
