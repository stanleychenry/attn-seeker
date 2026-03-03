import type { Metadata } from "next";
import { HomePageContent } from "./home-page-content";

export const metadata: Metadata = {
  title: "attn:seeker | organic social for challenger brands",
  description:
    "An agency and media company at the intersection of organic content, social platforms, and attention. We don't just advise on attention, we earn it. 1.4 million followers. 1.2 billion organic views. No paid ads.",
};

export default function HomePage() {
  return <HomePageContent />;
}
