import { getCaseStudies } from "@/lib/cms";
import WorkPageClient from "./work-page-client";

export const metadata = {
  title: "our work | attn:seeker",
  description: "case studies and real results for challenger brands.",
};

export default async function WorkPage() {
  let caseStudies: Awaited<ReturnType<typeof getCaseStudies>> = [];
  try {
    caseStudies = await getCaseStudies();
  } catch (error) {
    console.error("Failed to fetch case studies:", error);
  }

  return <WorkPageClient caseStudies={caseStudies} />;
}
