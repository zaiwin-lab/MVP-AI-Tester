import type { Metadata, Viewport } from "next";
import { Public_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cap-digital-clinic.example"),
  title: {
    default: "KAPT Digital Clinic — Digital Solution Diagnostic Gateway | KOBIS Berhad",
    template: "%s · KAPT Digital Clinic",
  },
  description:
    "Not sure what digital solution you need? Tell KAPT, the KOBIS AI Prodigy Team, what is slowing your organisation down. Free initial diagnosis, response within 24 hours.",
  openGraph: {
    title: "KAPT Digital Clinic — Digital Solution Diagnostic Gateway",
    description:
      "Describe your operational challenge. Our KAPT team reviews it and recommends a practical digital direction. Free initial diagnosis, no obligation.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#173139",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
