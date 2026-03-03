import { getJobBySlug, getJobSlugs, getOpenJobs } from "@/lib/cms";
import { notFound } from "next/navigation";
import {
  Heading,
  Body,
  Button,
  Caption,
  Section,
  Container,
  SectionIntro,
} from "@/components/ui";

type PageParams = { params: { slug: string } };

export async function generateStaticParams() {
  try {
    const slugs = await getJobSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const job = await getJobBySlug(params.slug);
    if (!job) return { title: "role not found | attn:seeker" };
    return {
      title: `${job.name} | attn:seeker`,
      description: `${job.name} at the attention seeker. ${job.department}, ${job.location}.`,
    };
  } catch {
    return { title: "role not found | attn:seeker" };
  }
}

export default async function JobDetailPage({ params }: PageParams) {
  let job: Awaited<ReturnType<typeof getJobBySlug>> = null;
  let openJobs: Awaited<ReturnType<typeof getOpenJobs>> = [];
  try {
    [job, openJobs] = await Promise.all([
      getJobBySlug(params.slug),
      getOpenJobs(),
    ]);
  } catch (error) {
    console.error("Failed to fetch job:", error);
  }

  if (!job) notFound();

  const otherJobs = openJobs.filter((j) => j.slug !== params.slug);
  const employmentType = job.employmentType ?? job.type;
  const closingDate = job.closingDate;
  const applyLink = job.applyLink;
  const descriptionIsHtml = job.description != null && String(job.description).includes("<");

  return (
    <>
      {/* 1. Header */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <Caption className="block text-red">{job.department}</Caption>
          <Heading level={1} className="mt-4">
            {job.name}
          </Heading>
          <p className="mt-3 font-obviously text-sm text-black/50">
            {job.location} · {employmentType}
            {closingDate ? ` · closes ${closingDate}` : ""}
          </p>
        </Container>
      </Section>

      {/* 2. Description */}
      {job.description && (
        <Section background="bone" padding="none" className="py-8 md:py-16">
          <Container width="content">
            {descriptionIsHtml ? (
              <div
                className="prose prose-lg max-w-none font-tiempos-text text-black/80 prose-headings:font-obviously prose-headings:font-semibold prose-headings:text-black prose-headings:lowercase"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            ) : (
              <Body className="text-black/80">{job.description}</Body>
            )}
          </Container>
        </Section>
      )}

      {/* 3. Requirements */}
      {job.requirements && (Array.isArray(job.requirements) ? job.requirements.length > 0 : job.requirements) && (
        <Section background="bone" padding="none" className="py-4 md:py-8">
          <Container width="content">
            <SectionIntro heading="requirements" />
            {typeof job.requirements === "string" && job.requirements.includes("<") ? (
              <div
                className="prose prose-lg mt-6 max-w-none font-tiempos-text text-black/80 prose-headings:font-obviously prose-headings:font-semibold prose-headings:text-black prose-headings:lowercase"
                dangerouslySetInnerHTML={{ __html: job.requirements }}
              />
            ) : (
              <ul className="mt-6 list-disc space-y-2 pl-6 font-tiempos-text text-black/80">
                {Array.isArray(job.requirements)
                  ? job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))
                  : null}
              </ul>
            )}
          </Container>
        </Section>
      )}

      {/* 4. Apply CTA */}
      <Section background="bone" padding="none" className="py-16">
        <Container width="content" className="text-center">
          {applyLink ? (
            <a
              href={applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-button bg-red px-6 py-3 font-obviously font-medium lowercase text-bone transition-colors hover:bg-dark-red"
            >
              apply for this role
            </a>
          ) : (
            <div>
              <Body className="text-black/70">
                send your application to{" "}
                <a
                  href="mailto:hello@attnseeker.com"
                  className="font-obviously font-medium text-red hover:underline"
                >
                  hello@attnseeker.com
                </a>
              </Body>
            </div>
          )}
        </Container>
      </Section>

      {/* 5. Other roles */}
      {otherJobs.length > 0 && (
        <Section background="bone" padding="none" className="py-8 md:py-16">
          <Container width="standard">
            <Heading level={2}>other open roles</Heading>
            <div className="mt-8 divide-y divide-black/10">
              {otherJobs.map((other) => (
                <div
                  key={other.id}
                  className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="font-obviously font-semibold text-lg lowercase text-black">
                      {other.name}
                    </h3>
                    <p className="mt-1 font-obviously text-sm text-black/50">
                      {other.department} · {other.location} · {other.type || other.employmentType || ""}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    href={`/agency/careers/${other.slug}`}
                  >
                    apply
                  </Button>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
