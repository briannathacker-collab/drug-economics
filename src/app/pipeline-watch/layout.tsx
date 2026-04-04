import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pipeline Watch — Patent Cliffs & Biosimilar Tracker | Drug Economics",
  description:
    "Track when cheaper versions of expensive drugs will become available. Monitor patent expirations, biosimilar approvals, and clinical trial progress.",
  openGraph: {
    title: "Pipeline Watch — Patent Cliffs & Biosimilar Tracker",
    description:
      "Track when cheaper versions of expensive drugs will become available. Monitor patent expirations, biosimilar approvals, and clinical trial progress.",
    url: "https://drug-economics.vytalisresearch.com/pipeline-watch",
    siteName: "Drug Economics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pipeline Watch — Patent Cliffs & Biosimilar Tracker",
    description:
      "Track when cheaper versions of expensive drugs will become available. Monitor patent expirations, biosimilar approvals, and clinical trial progress.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
