import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Updates — Drug Economics",
  description: "Automated tracking of drug price changes, new drug additions, and data corrections.",
  openGraph: {
    title: "Data Updates — Drug Economics",
    description: "Automated tracking of drug price changes, new drug additions, and data corrections.",
    url: "https://drug-economics.vytalisresearch.com/changelog",
    siteName: "Drug Economics",
    type: "website",
  },
};

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
