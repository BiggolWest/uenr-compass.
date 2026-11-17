import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: { default: "UENR Compass | UENR Campus Map & Directions", template: "%s | UENR Compass" },
  description: "Find mapped places and walking directions at the University of Energy and Natural Resources in Fiapre, Sunyani, Ghana.",
  keywords: ["UENR", "UENR campus map", "UENR directions", "Sunyani campus", "Fiapre", "Ghana university map"],
  openGraph: { title: "UENR Compass", description: "Public campus map and walking directions for UENR students.", type: "website", locale: "en_GH" },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/uenr-crest.png` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
