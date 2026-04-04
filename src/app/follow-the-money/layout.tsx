import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Follow the Money — Insurer & PBM Profit Tracker | Drug Economics",
  description:
    "Track where every dollar of your insurance premium goes. Explore insurer profits, PBM rebate flows, premium trends, and vertical integration in healthcare.",
  openGraph: {
    title: "Follow the Money — Insurer & PBM Profit Tracker",
    description:
      "Track where every dollar of your insurance premium goes. Explore insurer profits, PBM rebate flows, premium trends, and vertical integration in healthcare.",
    url: "https://drug-economics.vytalisresearch.com/follow-the-money",
    siteName: "Drug Economics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Follow the Money — Insurer & PBM Profit Tracker",
    description:
      "Track where every dollar of your insurance premium goes. Explore insurer profits, PBM rebate flows, premium trends, and vertical integration in healthcare.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
