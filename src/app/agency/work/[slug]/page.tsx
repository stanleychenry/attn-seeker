import Link from "next/link";
import Image from "next/image";
import { getCaseStudyBySlug, getCaseStudySlugs, getCaseStudies } from "@/lib/cms";
import { notFound } from "next/navigation";
import {
  Heading,
  Body,
  Button,
  Card,
  Caption,
  Section,
  Container,
  SectionIntro,
} from "@/components/ui";

type PageParams = { params: { slug: string } };

export async function generateStaticParams() {
  try {
    const slugs = await getCaseStudySlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const cs = await getCaseStudyBySlug(params.slug);
    if (!cs) return { title: "case study not found | attn:seeker" };
    return {
      title: `${cs.client || cs.name} case study | attn:seeker`,
      description: cs.headline,
    };
  } catch {
    return { title: "case study not found | attn:seeker" };
  }
}

function ProseBlock({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const isHtml = content.includes("<");
  const baseClass =
    "prose prose-lg max-w-none font-tiempos-text text-black/80 prose-headings:font-obviously prose-headings:font-semibold prose-headings:text-black prose-headings:lowercase";
  if (isHtml) {
    return (
      <div
        className={baseClass + (className ? ` ${className}` : "")}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  return (
    <div className={baseClass + (className ? ` ${className}` : "")}>
      <p>{content}</p>
    </div>
  );
}

export default async function CaseStudyDetailPage({ params }: PageParams) {
  let cs: Awaited<ReturnType<typeof getCaseStudyBySlug>> = null;
  let otherStudies: Awaited<ReturnType<typeof getCaseStudies>> = [];
  try {
    [cs, otherStudies] = await Promise.all([
      getCaseStudyBySlug(params.slug),
      getCaseStudies(),
    ]);
  } catch (error) {
    console.error("Failed to fetch case study:", error);
  }

  if (!cs) notFound();

  otherStudies = otherStudies.filter((c) => c.slug !== params.slug);
  const keyStat = cs.keyStat ?? cs.stats?.[0]?.value;
  const keyStatLabel = cs.keyStatLabel ?? cs.stats?.[0]?.label;
  const clientLogo = cs.clientLogo;
  const coverImage = cs.coverImage ?? cs.thumbnailUrl;
  const challengeImage = cs.challengeImage;
  const solutionImage = cs.solutionImage;
  const resultsImage = cs.resultsImage;

  return (
    <>
      {/* 1. Hero */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          {clientLogo ? (
            <Image
              src={clientLogo}
              alt={cs.client || cs.name}
              width={200}
              height={80}
              className="h-16 w-auto object-left object-contain md:h-20"
            />
          ) : (
            <Caption className="text-lg text-black/40">{cs.client || cs.industry || cs.name}</Caption>
          )}
          <Heading level={1} className="mt-4">
            {cs.headline}
          </Heading>
          {(keyStat != null || keyStatLabel) && (
            <div className="mt-6 flex items-baseline gap-3">
              {keyStat != null && (
                <span className="font-obviously font-black leading-none text-red text-[56px] md:text-[72px]">
                  {keyStat}
                </span>
              )}
              {keyStatLabel && (
                <span className="font-obviously text-lg text-black/50">
                  {keyStatLabel}
                </span>
              )}
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {cs.region && (
              <span className="rounded-full bg-black/5 px-3 py-1 font-obviously text-sm text-black/50">
                {cs.region}
              </span>
            )}
            <span className="rounded-full bg-black/5 px-3 py-1 font-obviously text-sm text-black/50">
              {cs.industry}
            </span>
          </div>
          {coverImage ? (
            <div className="relative mt-8 aspect-video w-full overflow-hidden">
              <Image
                src={coverImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          ) : (
            <div className="mt-8 aspect-video w-full bg-black/5" />
          )}
        </Container>
      </Section>

      {/* 2. Challenge */}
      {cs.challenge && (
        <Section background="bone" padding="none" className="py-8 md:py-16">
          <Container width="content">
            <Caption className="block text-red">the challenge</Caption>
            <ProseBlock content={cs.challenge} className="mt-6" />
            {challengeImage && (
              <div className="relative mt-8 aspect-video w-full overflow-hidden">
                <Image
                  src={challengeImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            )}
          </Container>
        </Section>
      )}

      {/* 3. Solution */}
      {cs.solution && (
        <Section background="bone" padding="none" className="py-8 md:py-16">
          <Container width="content">
            <Caption className="block text-red">the solution</Caption>
            <ProseBlock content={cs.solution} className="mt-6" />
            {solutionImage && (
              <div className="relative mt-8 aspect-video w-full overflow-hidden">
                <Image
                  src={solutionImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            )}
          </Container>
        </Section>
      )}

      {/* 4. Results */}
      {cs.results && (
        <Section background="bone" padding="none" className="py-8 md:py-16">
          <Container width="content">
            <Caption className="block text-red">the results</Caption>
            <ProseBlock content={cs.results} className="mt-6" />
            {resultsImage && (
              <div className="relative mt-8 aspect-video w-full overflow-hidden">
                <Image
                  src={resultsImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            )}
            {cs.stats && Array.isArray(cs.stats) && cs.stats.length > 1 && (
              <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3">
                {cs.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <span className="font-obviously font-black leading-none text-red text-[36px]">
                      {stat.value}
                    </span>
                    <p className="mt-1 font-obviously text-sm text-black/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </Section>
      )}

      {/* 5. Testimonial */}
      {(cs.testimonial || cs.testimonialAuthor) && (
        <Section background="bone" padding="none" className="py-8 md:py-16">
          <Container width="content">
            <blockquote className="border-l-4 border-red pl-6 md:pl-8">
              <p className="font-tiempos-text text-xl leading-relaxed italic text-black/80 md:text-2xl">
                {typeof cs.testimonial === "object" && cs.testimonial?.quote
                  ? `"${cs.testimonial.quote}"`
                  : typeof cs.testimonial === "string"
                    ? `"${cs.testimonial}"`
                    : ""}
              </p>
              <footer className="mt-4 font-obviously text-sm text-black/50">
                {typeof cs.testimonial === "object" && cs.testimonial?.author
                  ? cs.testimonial.author
                  : cs.testimonialAuthor}
                {typeof cs.testimonial === "object" && cs.testimonial?.role && `, ${cs.testimonial.role}`}
              </footer>
            </blockquote>
          </Container>
        </Section>
      )}

      {/* 6. More work */}
      <Section background="bone" padding="none" className="py-16">
        <Container width="wide">
          <SectionIntro heading="more work" />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherStudies.slice(0, 3).map((other) => {
              const otherCover = other.coverImage ?? other.thumbnailUrl;
              const otherLogo = other.clientLogo;
              const otherKeyStat = other.keyStat ?? other.stats?.[0]?.value;
              const otherKeyStatLabel = other.keyStatLabel ?? other.stats?.[0]?.label;

              return (
                <Link
                  key={other.id}
                  href={`/agency/work/${other.slug}`}
                  className="block h-full"
                >
                  <Card
                    padding="none"
                    className="flex h-full flex-col overflow-hidden rounded-lg transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-video w-full bg-black/5">
                      {otherCover ? (
                        <Image
                          src={otherCover}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {otherLogo ? (
                        <Image
                          src={otherLogo}
                          alt={other.client || other.name}
                          width={120}
                          height={32}
                          className="h-8 w-auto object-left object-contain"
                        />
                      ) : (
                        <Caption className="text-black/40">
                          {other.client || other.industry || other.name}
                        </Caption>
                      )}
                      <Heading level={3} className="mt-2 text-base md:text-lg">
                        {other.headline}
                      </Heading>
                      {otherKeyStat != null && (
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="font-obviously font-black leading-none text-red text-[28px]">
                            {otherKeyStat}
                          </span>
                          {otherKeyStatLabel && (
                            <span className="font-obviously text-sm text-black/50">
                              {otherKeyStatLabel}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {other.region && (
                          <span className="rounded-full bg-black/5 px-2 py-0.5 font-obviously text-xs text-black/50">
                            {other.region}
                          </span>
                        )}
                        <span className="rounded-full bg-black/5 px-2 py-0.5 font-obviously text-xs text-black/50">
                          {other.industry}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 7. CTA */}
      <Section background="red" padding="none" className="py-16 md:py-24">
        <Container width="standard" className="text-center">
          <Heading level={2} className="text-bone">
            ready to grow?
          </Heading>
          <Body size="large" className="mt-4 text-bone/70">
            let&apos;s talk about what organic social can do for your brand.
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
