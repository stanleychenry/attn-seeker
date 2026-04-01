import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { AiBrainSetupLanding } from "./client";

export const metadata: Metadata = {
  title:
    "The AI Brain Setup Session — Done-With-You AI System Build | $897 NZD",
  description:
    "We build your AI operating system with you in two calls. Questionnaire, two sessions, 30 days support. Full refund if it does not work.",
  openGraph: {
    title:
      "The AI Brain Setup Session — Done-With-You AI System Build | $897 NZD",
    description:
      "We build your AI operating system with you in two calls. Questionnaire, two sessions, 30 days support. Full refund if it does not work.",
    images: [
      {
        url: "/images/AI Webinar Landing Page/stanley-hero.jpg",
        width: 1200,
        height: 630,
        alt: "The AI Brain Setup Session — Done-With-You with Stanley Henry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "The AI Brain Setup Session — Done-With-You AI System Build | $897 NZD",
    description:
      "We build your AI operating system with you in two calls. Questionnaire, two sessions, 30 days support. Full refund if it does not work.",
    images: ["/images/AI Webinar Landing Page/stanley-hero.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function AiBrainSetupPage() {
  return (
    <>
      <AiBrainSetupLanding />
      <Footer />
    </>
  );
}
