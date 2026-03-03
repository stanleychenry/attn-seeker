import Link from "next/link";
import Image from "next/image";
import { getServiceBySlug, getServices } from "@/lib/cms";
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

export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const service = await getServiceBySlug(params.slug);
    if (!service) return { title: "service not found | attn:seeker" };
    const description = service.description ?? service.shortDescription;
    return {
      title: `${service.name} | attn:seeker`,
      description:
        description || `${service.name} services from the attention seeker.`,
    };
  } catch {
    return { title: "service not found | attn:seeker" };
  }
}

export default async function ServiceDetailPage({ params }: PageParams) {
  let service: Awaited<ReturnType<typeof getServiceBySlug>> = null;
  let otherServices: Awaited<ReturnType<typeof getServices>> = [];
  try {
    [service, otherServices] = await Promise.all([
      getServiceBySlug(params.slug),
      getServices(),
    ]);
  } catch (error) {
    console.error("Failed to fetch service:", error);
  }

  if (!service) notFound();

  const otherServicesFiltered = otherServices.filter((s) => s.slug !== service!.slug);
  const headline = service.headline ?? service.name;
  const description = service.description ?? service.shortDescription;
  const coverImage = service.coverImage;

  return (
    <>
      {/* 1. Hero */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <Link
            href="/agency/services"
            className="inline-block transition-colors hover:opacity-80"
          >
            <Caption className="block text-red">services</Caption>
          </Link>
          <Heading level={1} className="mt-4">
            {headline}
          </Heading>
          <Body
            size="large"
            className="mt-6 max-w-[700px] text-black/70"
          >
            {description}
          </Body>
          {coverImage && (
            <div className="relative mt-8 aspect-video w-full overflow-hidden bg-black/5">
              <Image
                src={coverImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          )}
        </Container>
      </Section>

      {/* 2. Body content */}
      {service.body && (
        <Section background="bone" padding="none" className="py-8 md:py-16">
          <Container width="content">
            <div
              className="prose prose-lg max-w-none font-tiempos-text text-black/80 prose-headings:font-obviously prose-headings:font-semibold prose-headings:text-black prose-headings:lowercase"
              dangerouslySetInnerHTML={{ __html: service.body }}
            />
          </Container>
        </Section>
      )}

      {/* 3. Key benefits */}
      {service.keyBenefits && (Array.isArray(service.keyBenefits) ? service.keyBenefits.length > 0 : service.keyBenefits) && (
        <Section background="bone" padding="none" className="py-8 md:py-16">
          <Container width="standard">
            <SectionIntro
              eyebrow="what you get"
              heading="key benefits"
            />
            <ul className="mt-8 max-w-[700px] space-y-3">
              {(Array.isArray(service.keyBenefits)
                ? service.keyBenefits
                : [service.keyBenefits]
              ).map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red"
                    aria-hidden
                  />
                  <div
                    className="font-tiempos-text text-lg text-black/70 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_p:first-child]:mt-0"
                    dangerouslySetInnerHTML={{
                      __html: typeof benefit === "string" ? benefit : String(benefit),
                    }}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* 4. Process */}
      {service.process && (Array.isArray(service.process) ? service.process.length > 0 : typeof service.process === "string") && (
        <Section background="bone" padding="none" className="py-8 md:py-16">
          <Container width="standard">
            <SectionIntro
              eyebrow="how it works"
              heading="our process"
            />
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {(Array.isArray(service.process) ? service.process : []).map((item, i) => (
                <div
                  key={typeof item === "object" && item && "step" in item ? item.step : i}
                  className={
                    i < (Array.isArray(service.process) ? service.process : []).length - 1
                      ? "md:border-r md:border-black/10 md:pr-8"
                      : ""
                  }
                >
                  <span className="font-obviously font-black text-[40px] text-red">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-obviously-wide font-semibold text-lg lowercase text-black">
                    {typeof item === "object" && item && "step" in item ? item.step : String(i + 1)}
                  </h3>
                  <p className="mt-2 font-tiempos-text text-base text-black/70">
                    {typeof item === "object" && item && "description" in item ? item.description : String(item)}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 5. Other services */}
      {otherServicesFiltered.length > 0 && (
        <Section background="bone" padding="none" className="py-8 md:py-16">
          <Container width="standard">
            <Heading level={2} className="mb-6">
              other services
            </Heading>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {otherServicesFiltered.slice(0, 6).map((s) => (
                <Link
                  key={s.id}
                  href={`/agency/services/${s.slug}`}
                  className="block rounded-lg border border-black/10 bg-white p-4 transition-colors hover:border-red/30"
                >
                  <h3 className="font-obviously-wide font-semibold text-base text-black">
                    {s.name}
                  </h3>
                  {(s.shortDescription ?? s.description) && (
                    <p className="mt-1 line-clamp-2 font-tiempos-text text-sm text-black/60">
                      {s.shortDescription ?? s.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 6. CTA */}
      <Section background="red" padding="none" className="py-16 md:py-24">
        <Container width="standard" className="text-center">
          <Heading level={2} className="text-bone">
            interested in {service.name}?
          </Heading>
          <Body size="large" className="mt-4 text-bone/70">
            let&apos;s chat about how we can help your brand grow.
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
