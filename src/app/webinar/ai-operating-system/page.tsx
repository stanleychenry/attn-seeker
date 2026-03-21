import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { AiWebinarLanding } from "./client";

export const metadata: Metadata = {
  title: "Build Your AI Brain — Live AI Workshop with Stanley Henry | March 31",
  description:
    "Learn the 5-layer AI system Stanley Henry built to run his business. 2-hour live workshop. $149 NZD. Every attendee gets the full template download.",
  openGraph: {
    title:
      "Build Your AI Brain — Live AI Workshop with Stanley Henry | March 31",
    description:
      "Learn the 5-layer AI system Stanley Henry built to run his business. 2-hour live workshop. $149 NZD. Every attendee gets the full template download.",
    images: [
      {
        url: "/images/AI Webinar Landing Page/stanley-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Build Your AI Brain — Live Workshop with Stanley Henry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Build Your AI Brain — Live AI Workshop with Stanley Henry | March 31",
    description:
      "Learn the 5-layer AI system Stanley Henry built to run his business. 2-hour live workshop. $149 NZD. Every attendee gets the full template download.",
    images: ["/images/AI Webinar Landing Page/stanley-hero.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function AiWebinarPage() {
  return (
    <>
      <AiWebinarLanding />
      <Footer />
    </>
  );
}
