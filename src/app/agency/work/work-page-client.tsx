"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/types/cms";
import {
  Heading,
  Body,
  Button,
  Card,
  Caption,
  Section,
  Container,
} from "@/components/ui";

function getFilters(caseStudies: CaseStudy[]) {
  const regions = Array.from(
    new Set(
      caseStudies.map((cs) => cs.region).filter(Boolean) as string[]
    )
  );
  const industries = Array.from(new Set(caseStudies.map((cs) => cs.industry)));
  return ["all", ...regions, ...industries];
}

export default function WorkPageClient({
  caseStudies,
}: {
  caseStudies: CaseStudy[];
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const filters = getFilters(caseStudies);
  const filtered =
    activeFilter === "all"
      ? caseStudies
      : caseStudies.filter(
          (cs) => cs.region === activeFilter || cs.industry === activeFilter
        );

  return (
    <>
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <Caption className="block text-red">our work</Caption>
          <Heading level={1} className="mt-4">
            case studies
          </Heading>
          <Body size="large" className="mt-6 text-black/70">
            real results for real brands.
          </Body>
        </Container>
      </Section>

      <Section background="bone" padding="none" className="pb-8 pt-0">
        <Container width="wide">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-1.5 font-obviously text-sm font-medium lowercase transition-colors ${
                  activeFilter === filter
                    ? "bg-red text-bone"
                    : "bg-black/5 text-black/60 hover:bg-black/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="bone" padding="none" className="py-8">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cs) => {
              const coverImage = cs.coverImage ?? cs.thumbnailUrl;
              const clientLogo = cs.clientLogo;
              const keyStat = cs.keyStat ?? cs.stats?.[0]?.value;
              const keyStatLabel = cs.keyStatLabel ?? cs.stats?.[0]?.label;

              return (
                <Link
                  key={cs.id}
                  href={`/agency/work/${cs.slug}`}
                  className="block h-full"
                >
                  <Card
                    padding="none"
                    className="flex h-full flex-col overflow-hidden rounded-lg transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-video w-full bg-black/5">
                      {coverImage ? (
                        <Image
                          src={coverImage}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {clientLogo ? (
                        <Image
                          src={clientLogo}
                          alt={cs.client || cs.name}
                          width={120}
                          height={32}
                          className="h-8 w-auto object-left object-contain"
                        />
                      ) : (
                        <Caption className="text-black/40">
                          {cs.client || cs.industry || cs.name}
                        </Caption>
                      )}
                      <Heading level={3} className="mt-2 text-base md:text-lg">
                        {cs.headline}
                      </Heading>
                      {keyStat != null && (
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="font-obviously font-black leading-none text-red text-[28px]">
                            {keyStat}
                          </span>
                          {keyStatLabel && (
                            <span className="font-obviously text-sm text-black/50">
                              {keyStatLabel}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {cs.region && (
                          <span className="rounded-full bg-black/5 px-2 py-0.5 font-obviously text-xs text-black/50">
                            {cs.region}
                          </span>
                        )}
                        <span className="rounded-full bg-black/5 px-2 py-0.5 font-obviously text-xs text-black/50">
                          {cs.industry}
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

      <Section background="red" padding="none" className="py-16 md:py-24">
        <Container width="standard" className="text-center">
          <Heading level={2} className="text-bone">
            want results like these?
          </Heading>
          <Body size="large" className="mt-4 text-bone/70">
            we&apos;d love to show you what organic can do for your brand.
          </Body>
          <Button
            variant="secondary"
            href="/agency/contact"
            className="mt-8 bg-black text-bone hover:bg-black/90"
          >
            let&apos;s talk
          </Button>
        </Container>
      </Section>
    </>
  );
}
