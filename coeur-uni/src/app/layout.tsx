import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const defaultUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://coeur-uni.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Cœur Uni | Rencontrez l’homme de votre vie",
    template: "%s | Cœur Uni"
  },
  description: "Parcourez les profils et rencontrez l'homme de votre vie. Notre agence matrimoniale de prestige vous propose des rencontres sérieuses, authentiques et durables.",
  keywords: [
    "Cœur Uni",
    "agence matrimoniale",
    "rencontres sérieuses",
    "rencontres africaines",
    "mariage chrétien",
    "amour et culture",
    "âme sœur",
    "rencontres de prestige"
  ],
  openGraph: {
    title: "Cœur Uni | Rencontrez l’homme de votre vie",
    description: "Parcourez les profils et rencontrez l'homme de votre vie. Notre agence matrimoniale de prestige vous propose des rencontres sérieuses et durables.",
    url: defaultUrl,
    siteName: "Cœur Uni",
    images: [
      {
        url: "/logo-og.jpg",
        width: 1200,
        height: 630,
        alt: "Cœur Uni - Agence Matrimoniale",
      },
      {
        url: "/logo-wa.jpg",
        width: 400,
        height: 400,
        alt: "Cœur Uni Logo",
      }
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cœur Uni | Rencontrez l’homme de votre vie",
    description: "Parcourez les profils et rencontrez l'homme de votre vie. Notre agence matrimoniale de prestige vous propose des rencontres sérieuses et durables.",
    images: ["/logo-og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f5e0d1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full overflow-x-hidden bg-[radial-gradient(circle_at_top,_#fff8f2_0%,_#f1d8bb_40%,_#e8c0a5_100%)] text-[#3f1f0f] antialiased">
        {children}
      </body>
    </html>
  );
}
