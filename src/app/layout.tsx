import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AdSenseScript } from "@/components/adsense-script";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SITE_NAME, getSiteUrl } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — Career-Specific Resume & Cover Letter Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Profession-specific AI resume and cover letter generators for nurses, teachers, CNAs, warehouse workers, drivers, and servers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AdSenseScript />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
