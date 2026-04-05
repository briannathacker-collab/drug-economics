import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Drug Economics — Exposing the Cost of American Drug Pricing",
  description:
    "Six investigative apps that expose how pharmaceutical manufacturers, insurance companies, and PBMs profit from the American drug pricing system — at the direct expense of patients.",
  metadataBase: new URL("https://drug-economics.vytalisresearch.com"),
  openGraph: {
    title: "Drug Economics — Exposing the Cost of American Drug Pricing",
    description:
      "Six investigative apps that expose how pharmaceutical manufacturers, insurance companies, and PBMs profit from the American drug pricing system.",
    url: "https://drug-economics.vytalisresearch.com",
    siteName: "Drug Economics",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drug Economics — Exposing the Cost of American Drug Pricing",
    description:
      "Six investigative apps exposing pharmaceutical pricing.",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Drug Economics",
  url: "https://drug-economics.vytalisresearch.com",
  description:
    "Six investigative apps that expose how pharmaceutical manufacturers, insurance companies, and PBMs profit from the American drug pricing system.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  creator: {
    "@type": "Organization",
    name: "Vytalis Research",
    url: "https://vytalisresearch.com",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} antialiased bg-[#F7F9F8] font-[var(--font-inter)]`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S27CNT2K5H"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S27CNT2K5H');
          `}
        </Script>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
