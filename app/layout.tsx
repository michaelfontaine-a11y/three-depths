import type { Metadata } from "next";
import { EB_Garamond, Cormorant_Garamond, Cormorant_SC } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const cormorantSC = Cormorant_SC({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-caps",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Three Depths — Catholic apologetics for the whole family",
  description:
    "Timeless Catholic truths presented at three depths — Child, Teen, and Adult — so the whole family can engage at their own level.",
  openGraph: {
    title: "Three Depths",
    description:
      "Catholic apologetics at three depths — for children, teens, and adults.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${cormorantGaramond.variable} ${cormorantSC.variable}`}
    >
      <body className="font-body antialiased min-h-screen">{children}</body>
    </html>
  );
}
