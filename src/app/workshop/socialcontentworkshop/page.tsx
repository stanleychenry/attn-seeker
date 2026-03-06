import type { Metadata } from "next";
import { WorkshopContent } from "../workshop-content";

export const metadata: Metadata = {
  title: "attn:seeker social content workshop",
  description:
    "A one-day workshop that gives your internal marketing team an easily repeatable content system they can implement the moment they walk out the door. $9,000 + GST.",
};

export default function WorkshopPage() {
  return <WorkshopContent />;
}
