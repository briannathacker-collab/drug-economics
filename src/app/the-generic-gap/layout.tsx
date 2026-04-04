import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Generic Gap — Delay Tactic Tracker | Drug Economics",
  description:
    "Why isn't there a cheaper version of your drug yet? Track the documented tactics manufacturers use to delay generic competition and what it costs patients.",
  openGraph: {
    title: "The Generic Gap — Delay Tactic Tracker",
    description:
      "Why isn't there a cheaper version of your drug yet? Track the documented tactics manufacturers use to delay generic competition and what it costs patients.",
    url: "https://drug-economics.vytalisresearch.com/the-generic-gap",
    siteName: "Drug Economics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Generic Gap — Delay Tactic Tracker",
    description:
      "Why isn't there a cheaper version of your drug yet? Track the documented tactics manufacturers use to delay generic competition and what it costs patients.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
