import Image from "next/image";
import {
  Heading,
  Body,
  Button,
  Card,
  Stat,
  Label,
  Caption,
  Section,
  Container,
  Grid,
  SectionIntro,
} from "@/components/ui";
import { getServices, getFeaturedCaseStudies } from "@/lib/cms";

export const metadata = {
  title: "agency | attn:seeker",
  description:
    "full-service organic social media agency for challenger brands. strategy, content, community management, and social media management.",
};

export default async function AgencyPage() {
  let services: Awaited<ReturnType<typeof getServices>> = [];
  let caseStudies: Awaited<ReturnType<typeof getFeaturedCaseStudies>> = [];
  try {
    [services, caseStudies] = await Promise.all([
      getServices(),
      getFeaturedCaseStudies(),
    ]);
  } catch (error) {
    console.error("Failed to fetch agency CMS data:", error);
  }

  const servicesPreview = services.slice(0, 4);
  const caseStudiesPreview = caseStudies.slice(0, 3);

  return (
    <>
      {/* 1. Hero */}
      <Section background="bone" padding="none" className="py-16 md:py-32">
        <Container width="standard">
          <Label className="block text-red">attn:agency</Label>
          <Heading level={1} className="mt-4 text-black">
            we grow brands through organic social
          </Heading>
          <Body
            size="large"
            className="mt-6 max-w-[700px] text-black/70"
          >
            we&apos;re a full-service organic social media agency that builds
            audiences, creates content, and manages communities for challenger
            brands across five countries.
          </Body>
          <Button
            variant="primary"
            href="/agency/contact"
            className="mt-8"
          >
            let&apos;s talk
          </Button>
        </Container>
      </Section>

      {/* 2. Stats bar */}
      <Section background="black" padding="none" className="py-24">
        <Container width="full">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <Stat
              value="2m+"
              label="followers built"
              className="[&>span:first-child]:text-red [&>span:last-child]:text-bone/70"
            />
            <Stat
              value="1.2b+"
              label="organic views"
              className="[&>span:first-child]:text-red [&>span:last-child]:text-bone/70"
            />
            <Stat
              value="5"
              label="countries"
              className="[&>span:first-child]:text-red [&>span:last-child]:text-bone/70"
            />
            <Stat
              value="0"
              label="paid ads"
              className="[&>span:first-child]:text-red [&>span:last-child]:text-bone/70"
            />
          </div>
        </Container>
      </Section>

      {/* 3. What we do */}
      <Section background="bone" padding="none" className="py-16">
        <Container width="full">
          <SectionIntro
            eyebrow="what we do"
            heading="services"
            description="full-service organic social media. strategy, content, community, and management."
          />
          <Grid cols={2} gap="md" className="mt-8">
            {servicesPreview.length === 0 ? (
              <p className="font-tiempos-text text-black/60">No services available.</p>
            ) : (
            servicesPreview.map((service) => (
              <Card key={service.id} className="h-full rounded-lg p-6">
                <div className="flex h-full flex-col">
                  <Heading level={3}>{service.name}</Heading>
                  <Body size="small" className="mt-2 text-black/70">
                    {service.shortDescription || (service.description ?? "")}
                  </Body>
                  <Button
                    variant="ghost"
                    href={`/agency/services/${service.slug}`}
                    className="mt-auto pt-4"
                  >
                    learn more
                  </Button>
                </div>
              </Card>
            )))}
          </Grid>
          <div className="mt-8 flex justify-center">
            <Button variant="secondary" href="/agency/services">
              see all services
            </Button>
          </div>
        </Container>
      </Section>

      {/* 4. Our work */}
      <Section background="bone" padding="none" className="py-16">
        <Container width="full">
          <SectionIntro eyebrow="our work" heading="case studies" />
          <Grid cols={3} gap="md" className="mt-8">
            {caseStudiesPreview.length === 0 ? (
              <p className="font-tiempos-text text-black/60">No case studies available.</p>
            ) : (
            caseStudiesPreview.map((cs) => (
              <Card
                key={cs.id}
                padding="none"
                className="flex h-full flex-col overflow-hidden rounded-lg"
              >
                <div className="relative h-48 w-full shrink-0 overflow-hidden bg-black/5">
                  {(cs.coverImage || cs.thumbnailUrl) ? (
                    <Image
                      src={cs.coverImage || cs.thumbnailUrl || ""}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <Caption className="text-black/40">{cs.client || cs.industry || cs.name}</Caption>
                  <Heading level={3} className="mt-1">
                    {cs.headline}
                  </Heading>
                  {(cs.keyStat || (cs.stats && cs.stats[0])) && (
                    <div className="mt-3">
                      <span className="font-obviously font-black text-[28px] text-red">
                        {cs.keyStat ?? (cs.stats && cs.stats[0] ? cs.stats[0].value : "")}
                      </span>{" "}
                      <Caption className="text-black/55">
                        {cs.keyStatLabel ?? (cs.stats && cs.stats[0] ? cs.stats[0].label : "")}
                      </Caption>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    href={`/agency/work/${cs.slug}`}
                    className="mt-auto pt-4"
                  >
                    read case study
                  </Button>
                </div>
              </Card>
            )))}
          </Grid>
          <div className="mt-8 flex justify-center">
            <Button variant="secondary" href="/agency/work">
              see all work
            </Button>
          </div>
        </Container>
      </Section>

      {/* 5. Who we work with */}
      <Section background="bone" padding="none" className="py-16">
        <Container width="standard">
          <SectionIntro
            eyebrow="who we work with"
            heading="challenger brands that want to win"
          />
          <Body size="standard" className="mt-6 max-w-[700px] text-black/70">
            we work best with brands in the #2 or #3 market position, or new
            entrants who want to disrupt their category. you need a leader who
            sees the vision for organic, and you&apos;re tired of diminishing
            returns from paid ads. if that sounds like you, we should talk.
          </Body>
        </Container>
      </Section>

      {/* 6. CTA */}
      <Section background="red" padding="none" className="py-16 md:py-24">
        <Container width="standard" className="text-center">
          <Heading level={2} className="text-bone">
            ready to grow?
          </Heading>
          <Body size="large" className="mt-4 text-bone/70">
            let&apos;s build something your audience actually wants to follow.
          </Body>
          <Button
            variant="secondary"
            href="/agency/contact"
            className="mt-8 bg-black text-bone hover:bg-black/90"
          >
            get in touch
          </Button>
        </Container>
      </Section>
    </>
  );
}
