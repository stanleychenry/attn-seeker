import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/layout/client-layout";

export const metadata: Metadata = {
  title: "attn:seeker",
  description:
    "An agency and media company at the intersection of organic content, social platforms, and attention. We don't just advise on attention—we earn it.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
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
      </body>
    </html>
  );
}
