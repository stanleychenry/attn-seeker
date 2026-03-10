import type { Metadata } from "next";
import { CohortPageClient } from "./_components/cohort-page-client";

export const metadata: Metadata = {
  title: "attn:seeker Cohort Programme — Founding Membership | Opens 20 April 2026",
  description:
    "A 12-month peer group and coaching programme for service business owners doing $500K to $5M. Built by Stanley Henry and the attn:seeker team. Founding cohort opens 20 April 2026. 6 spots.",
  robots: { index: false, follow: false },
};

export default function CohortPage() {
  return <CohortPageClient />;
}
