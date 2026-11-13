import type { Metadata } from "next";
import { MoneyGate } from "@/components/money/MoneyGate";

export const metadata: Metadata = {
  title: "Money",
  // Unlisted: no nav link, no sitemap entry, and explicitly out of the index.
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function MoneyPage() {
  return <MoneyGate />;
}
