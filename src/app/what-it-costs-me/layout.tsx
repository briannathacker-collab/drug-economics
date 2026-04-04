import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "What It Costs Me — Patient Out-of-Pocket Calculator | Drug Economics",
  description:
    "Calculate what you'll personally pay for your medication based on your insurance type. Compare costs across insurance plans and see international price differences.",
  openGraph: {
    title: "What It Costs Me — Patient Out-of-Pocket Calculator",
    description:
      "Calculate what you'll personally pay for your medication based on your insurance type. Compare costs across insurance plans and see international price differences.",
    url: "https://drug-economics.vytalisresearch.com/what-it-costs-me",
    siteName: "Drug Economics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What It Costs Me — Patient Out-of-Pocket Calculator",
    description:
      "Calculate what you'll personally pay for your medication based on your insurance type. Compare costs across insurance plans and see international price differences.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
