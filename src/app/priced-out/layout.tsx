import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Priced Out — Drug Pricing Explorer | Drug Economics",
  description:
    "Explore what drugs really cost to make vs. what manufacturers charge. Compare WAC prices, manufacturing costs, and profit margins across 15 major drugs and 6 manufacturers.",
  openGraph: {
    title: "Priced Out — Drug Pricing Explorer",
    description:
      "Explore what drugs really cost to make vs. what manufacturers charge.",
    url: "https://drug-economics.vytalisresearch.com/priced-out",
    siteName: "Drug Economics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Priced Out — Drug Pricing Explorer",
    description:
      "Explore what drugs really cost to make vs. what manufacturers charge.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
