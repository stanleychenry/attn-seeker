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
import Link from "next/link";
import { getServices, getFeaturedCaseStudies, getTeams } from "@/lib/cms";

export const metadata = {
  title: "agency | attn:seeker",
  description:
    "full-service organic social media agency for challenger brands. strategy, content, community management, and social media management.",
};

/** Cache the page and revalidate from Webflow every 5 minutes. */
export const revalidate = 300;

export default async function AgencyPage() {
  let services: Awaited<ReturnType<typeof getServices>> = [];
  let caseStudies: Awaited<ReturnType<typeof getFeaturedCaseStudies>> = [];
  let team: Awaited<ReturnType<typeof getTeams>> = [];
  try {
    [services, caseStudies, team] = await Promise.all([
      getServices(),
      getFeaturedCaseStudies(),
      getTeams(),
    ]);
  } catch (error) {
    console.error("Failed to fetch agency CMS data:", error);
  }

  const servicesPreview = services.slice(0, 4);
  const caseStudiesPreview = caseStudies.slice(0, 3);
  const sortedTeam = [...team].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.sortOrder - b.sortOrder;
  });

  return (
    <>
      {/* 1. Hero */}
      <Section background="black" padding="none" className="py-16 md:py-32">
        <Container width="standard">
          <Label className="block text-red">attn:agency</Label>
          <Heading level={1} className="mt-4">
            we grow brands through organic social
          </Heading>
          <Body
            size="large"
            className="mt-6 max-w-[700px] text-bone/70"
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
      <Section background="black" padding="none" className="py-16">
        <Container width="full">
          <SectionIntro
            eyebrow="what we do"
            heading="services"
            description="full-service organic social media. strategy, content, community, and management."
          />
          <Grid cols={2} gap="md" className="mt-8">
            {servicesPreview.length === 0 ? (
              <p className="font-tiempos-text text-bone/60">No services available.</p>
            ) : (
            servicesPreview.map((service) => (
              <Card key={service.id} className="h-full rounded-lg p-6 bg-white/[0.06]">
                <div className="flex h-full flex-col">
                  <Heading level={3}>{service.name}</Heading>
                  <Body size="small" className="mt-2 text-bone/70">
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
      <Section background="black" padding="none" className="py-16">
        <Container width="full">
          <SectionIntro eyebrow="our work" heading="case studies" />
          <Grid cols={3} gap="md" className="mt-8">
            {caseStudiesPreview.length === 0 ? (
              <p className="font-tiempos-text text-bone/60">No case studies available.</p>
            ) : (
            caseStudiesPreview.map((cs) => (
              <Card
                key={cs.id}
                padding="none"
                className="flex h-full flex-col overflow-hidden rounded-lg bg-white/[0.06]"
              >
                <div className="relative h-48 w-full shrink-0 overflow-hidden bg-bone/5">
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
                  <Caption className="text-bone/40">{cs.client || cs.industry || cs.name}</Caption>
                  <Heading level={3} className="mt-1">
                    {cs.headline}
                  </Heading>
                  {(cs.keyStat || (cs.stats && cs.stats[0])) && (
                    <div className="mt-3">
                      <span className="font-obviously font-black text-[28px] text-red">
                        {cs.keyStat ?? (cs.stats && cs.stats[0] ? cs.stats[0].value : "")}
                      </span>{" "}
                      <Caption className="text-bone/55">
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

      {/* 5. Team */}
      <Section background="black" padding="none" className="py-16">
        <Container width="full">
          <SectionIntro eyebrow="who we are" heading="team" />
          {sortedTeam.length === 0 ? (
            <p className="mt-6 font-tiempos-text text-bone/60">No team members available.</p>
          ) : (
            <div className="mt-8 overflow-x-auto overflow-y-hidden pb-4 md:pb-6">
              <div className="flex gap-4 md:gap-6" style={{ width: "max-content" }}>
                {sortedTeam.map((member) => (
                  <Link
                    key={member.id}
                    href={`/agency/team/${member.slug}`}
                    className="group flex shrink-0 flex-col items-center text-center"
                  >
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-bone/10 bg-bone/5 md:h-40 md:w-40">
                      {member.headshot ? (
                        <Image
                          src={member.headshot}
                          alt=""
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="160px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-obviously text-2xl text-bone/30">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="mt-3 block font-obviously text-sm font-medium text-bone group-hover:text-red">
                      {member.name}
                    </span>
                    {member.role ? (
                      <Caption className="mt-0.5 text-bone/60">{member.role}</Caption>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="mt-8 flex justify-center">
            <Button variant="ghost" href="/agency/team">
              meet the team
            </Button>
          </div>
        </Container>
      </Section>

      {/* 6. Who we work with */}
      <Section background="black" padding="none" className="py-16">
        <Container width="standard">
          <SectionIntro
            eyebrow="who we work with"
            heading="challenger brands that want to win"
          />
          <Body size="standard" className="mt-6 max-w-[700px] text-bone/70">
            we work best with brands in the #2 or #3 market position, or new
            entrants who want to disrupt their category. you need a leader who
            sees the vision for organic, and you&apos;re tired of diminishing
            returns from paid ads. if that sounds like you, we should talk.
          </Body>
        </Container>
      </Section>

      {/* 7. CTA */}
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
