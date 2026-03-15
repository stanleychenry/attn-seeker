import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/layout/client-layout";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MetaPixel } from "@/components/meta-pixel";

export const metadata: Metadata = {
  title: "attn:seeker",
  description:
    "An agency and media company at the intersection of organic content, social platforms, and attention. We don't just advise on attention—we earn it.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    url: "https://www.attnseeker.com",
    title: "attn:seeker",
    description:
      "An agency and media company at the intersection of organic content, social platforms, and attention. We don't just advise on attention—we earn it.",
    images: [
      {
        url: "https://www.attnseeker.com/brand/logos/og%20image.jpg",
        width: 1200,
        height: 1200,
        alt: "attn:seeker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "attn:seeker",
    description:
      "An agency and media company at the intersection of organic content, social platforms, and attention. We don't just advise on attention—we earn it.",
    images: ["https://www.attnseeker.com/brand/logos/og%20image.jpg"],
  },
  other: {
    "facebook-domain-verification": "6fsvxz7kmvy7mp204fbptqixyb18ow",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-tiempos-text bg-bone text-black antialiased">
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        <SpeedInsights />
        <MetaPixel />
      </body>
    </html>
  );
}
