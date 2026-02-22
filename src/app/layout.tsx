import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";
import CustomCursor from "@/components/ui/CustomCursor";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/AuthProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kareshioptik.id"),
  title: {
    default: "Kareshi Optik | Premium Optical Editorial",
    template: "%s | Kareshi Optik"
  },
  description: "Dapatkan koleksi kacamata eksklusif dan layanan periksa mata profesional di Kareshi Optik. Kurasi bingkai premium untuk gaya hidup modern.",
  keywords: ["kacamata premium", "optik jakarta", "periksa mata", "kareshi optik", "frame designer"],
  authors: [{ name: "Kareshi Team" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kareshioptik.id",
    siteName: "Kareshi Optik",
    title: "Kareshi Optik | Premium Optical Editorial",
    description: "Kurasi bingkai premium dan layanan kesehatan mata terbaik.",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kareshi Optik | Premium Optical Editorial",
    description: "Kurasi bingkai premium dan layanan kesehatan mata terbaik.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${playfair.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <CustomCursor />
          <AppChrome>{children}</AppChrome>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
