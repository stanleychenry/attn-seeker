import { getOpenJobs } from "@/lib/cms";
import {
  Heading,
  Body,
  Button,
  Caption,
  Section,
  Container,
} from "@/components/ui";

export const metadata = {
  title: "careers | attn:seeker",
  description:
    "join the attention seeker. open roles in organic social media strategy, content creation, and community management.",
};

export default async function CareersPage() {
  let openJobs: Awaited<ReturnType<typeof getOpenJobs>> = [];
  try {
    openJobs = await getOpenJobs();
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
  }

  return (
    <>
      {/* 1. Hero */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <Caption className="block text-red">careers</Caption>
          <Heading level={1} className="mt-4">
            join the team
          </Heading>
          <Body
            size="large"
            className="mt-6 max-w-[700px] text-black/70"
          >
            we&apos;re always looking for people who want to do cool shit.
          </Body>
        </Container>
      </Section>

      {/* 2. Why work here */}
      <Section background="bone" padding="none" className="py-8 md:py-16">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <Heading level={3}>own it</Heading>
              <Body size="small" className="mt-2 text-black/70">
                we trust our people to take ownership. no micromanaging, no
                hand-holding. you run your work.
              </Body>
            </div>
            <div>
              <Heading level={3}>back each other</Heading>
              <Body size="small" className="mt-2 text-black/70">
                we&apos;re a team first. we celebrate wins together and pick
                each other up when things get hard.
              </Body>
            </div>
            <div>
              <Heading level={3}>never settle</Heading>
              <Body size="small" className="mt-2 text-black/70">
                good enough isn&apos;t good enough. we push for better work,
                better ideas, and better results.
              </Body>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Open roles */}
      <Section background="bone" padding="none" className="py-8 md:py-16">
        <Container width="standard">
          <Heading level={2}>open roles</Heading>
          {openJobs.length > 0 ? (
            <div className="mt-8 divide-y divide-black/10">
              {openJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="font-obviously font-semibold text-lg lowercase text-black">
                      {job.name}
                    </h3>
                    <p className="mt-1 font-obviously text-sm text-black/50">
                      {job.department} · {job.location} · {job.type || job.employmentType || ""}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    href={`/agency/careers/${job.slug}`}
                  >
                    apply
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <Body className="text-black/70">
                no open roles right now. but we&apos;re always interested in
                great people.
              </Body>
              <Button
                variant="ghost"
                href="/agency/contact"
                className="mt-4"
              >
                send us your details
              </Button>
            </div>
          )}
        </Container>
      </Section>

      {/* 4. CTA */}
      <Section background="bone" padding="none" className="py-16">
        <Container width="standard" className="text-center">
          <Heading level={2}>don&apos;t see your role?</Heading>
          <Body className="mt-4 text-black/70">
            we&apos;re always open to hearing from talented people.
          </Body>
          <Button
            variant="ghost"
            href="/agency/contact"
            className="mt-6"
          >
            get in touch
          </Button>
        </Container>
      </Section>
    </>
  );
}
