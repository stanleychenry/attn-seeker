import type { Metadata } from "next";
import { CohortWebinarOfferClient } from "./client";

export const metadata: Metadata = {
  title: "attn:seeker Cohort Programme — Webinar Attendee Special",
  description:
    "Exclusive offer for webinar attendees. Join the attn:seeker Cohort Programme for $10,000 flat for your first 12 months — saving $25,880 on the standard rate. Offer closes 8 April 2026.",
  robots: { index: false, follow: false },
};

export default function CohortWebinarOfferPage() {
  return <CohortWebinarOfferClient />;
}
