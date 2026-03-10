import {
  Heading,
  Body,
  Button,
  Card,
  Section,
  Container,
  SectionIntro,
  Caption,
} from "@/components/ui";
import { getServices } from "@/lib/cms";

export const metadata = {
  title: "services | attn:seeker",
  description:
    "organic social media services: strategy, content creation, community management, and social media management for challenger brands.",
};

const PROCESS_STEPS = [
  {
    num: "01",
    title: "discover",
    description:
      "we audit your brand, audience, and competitors to find the gaps and opportunities.",
  },
  {
    num: "02",
    title: "strategise",
    description:
      "we build a content strategy tailored to your goals, platforms, and audience.",
  },
  {
    num: "03",
    title: "create",
    description:
      "our team produces scroll-stopping content designed for organic reach.",
  },
  {
    num: "04",
    title: "optimise",
    description:
      "we analyse performance and iterate fast. quantity leads to quality.",
  },
] as const;

export default async function ServicesPage() {
  let services: Awaited<ReturnType<typeof getServices>> = [];
  try {
    services = await getServices();
  } catch (error) {
    console.error("Failed to fetch services:", error);
  }

  if (services.length === 0) {
    return (
      <Section background="black" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <p className="font-tiempos-text text-bone/70">No services available.</p>
        </Container>
      </Section>
    );
  }

  return (
    <>
      {/* 1. Hero */}
      <Section background="black" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <Caption className="block text-red">services</Caption>
          <Heading level={1} className="mt-4">
            what we do
          </Heading>
          <Body
            size="large"
            className="mt-6 max-w-[700px] text-bone/70"
          >
            full-service organic social media for challenger brands. strategy,
            content, community, and management, all under one roof.
          </Body>
        </Container>
      </Section>

      {/* 2. Services list */}
      <Section background="black" padding="none" className="py-8">
        <Container width="wide">
          <div className="flex flex-col gap-8">
            {services.map((service, index) => (
              <Card
                key={service.id}
                padding="none"
                className="overflow-hidden rounded-lg bg-white/[0.06]"
              >
                <div
                  className={`flex flex-col md:flex-row ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content side (60%) */}
                  <div className="flex w-full flex-col justify-center p-8 md:w-[60%] md:p-10">
                    <Heading level={2}>{service.name}</Heading>
                    <Body size="standard" className="mt-3 text-bone/70">
                      {service.shortDescription || (service.description ?? "")}
                    </Body>
                    {service.keyBenefits && (Array.isArray(service.keyBenefits) ? service.keyBenefits.length > 0 : service.keyBenefits) && (
                      <ul className="mt-4 space-y-2">
                        {(Array.isArray(service.keyBenefits) ? service.keyBenefits : [service.keyBenefits]).map((benefit, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 font-tiempos-text text-base text-bone/70"
                          >
                            <span
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red"
                              aria-hidden
                            />
                            <div
                              className="[&_p]:mb-2 [&_p:last-child]:mb-0 [&_p:first-child]:mt-0"
                              dangerouslySetInnerHTML={{
                                __html: typeof benefit === "string" ? benefit : String(benefit),
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button
                      variant="primary"
                      href="/agency/contact"
                      className="mt-6"
                    >
                      enquire
                    </Button>
                  </div>
                  {/* Image side (40%) */}
                  <div
                    className="h-48 w-full bg-bone/5 md:min-h-[280px] md:w-[40%]"
                    aria-hidden
                  />
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Process section */}
      <Section background="black" padding="none" className="py-16 md:py-24">
        <Container width="wide">
          <SectionIntro
            eyebrow="how we work"
            heading="our process"
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`text-center md:text-left ${
                  i < PROCESS_STEPS.length - 1
                    ? "md:border-r md:border-bone/15 md:pr-8"
                    : ""
                }`}
              >
                <span className="font-obviously font-black text-[40px] text-red">
                  {step.num}
                </span>
                <h3 className="mt-2 font-obviously-wide font-semibold text-lg lowercase text-bone">
                  {step.title}
                </h3>
                <p className="mt-2 font-tiempos-text text-base text-bone/60">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. CTA section */}
      <Section background="red" padding="none" className="py-16 md:py-24">
        <Container width="standard" className="text-center">
          <Heading level={2} className="text-bone">
            let&apos;s build something
          </Heading>
          <Body size="large" className="mt-4 text-bone/70">
            ready to grow your brand through organic social? let&apos;s talk.
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
