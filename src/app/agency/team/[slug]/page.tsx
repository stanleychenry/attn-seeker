import Image from "next/image";
import { getTeamBySlug, getTeamSlugs, getTeams } from "@/lib/cms";
import { notFound } from "next/navigation";
import {
  Heading,
  Body,
  Caption,
  Section,
  Container,
} from "@/components/ui";
import { TeamMemberCard, TeamSocialLinks } from "../team-social-links";

type PageParams = { params: { slug: string } };

export async function generateStaticParams() {
  try {
    const slugs = await getTeamSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const member = await getTeamBySlug(params.slug);
    if (!member) return { title: "team member not found | attn:seeker" };
    return {
      title: `${member.name} | attn:seeker`,
      description: `${member.name}, ${member.role} at the attention seeker.`,
    };
  } catch {
    return { title: "team member not found | attn:seeker" };
  }
}

export default async function TeamMemberPage({ params }: PageParams) {
  let member: Awaited<ReturnType<typeof getTeamBySlug>> = null;
  let allTeams: Awaited<ReturnType<typeof getTeams>> = [];
  try {
    [member, allTeams] = await Promise.all([
      getTeamBySlug(params.slug),
      getTeams(),
    ]);
  } catch (error) {
    console.error("Failed to fetch team member:", error);
  }

  if (!member) notFound();

  const otherMembers = allTeams.filter((m) => m.slug !== params.slug).slice(0, 4);
  const bioIsHtml = member.bio != null && String(member.bio).includes("<");

  return (
    <>
      {/* 1. Profile section */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="content">
          <div className="flex flex-col gap-8 md:flex-row md:gap-12">
            {/* Left: headshot */}
            <div className="w-full shrink-0 md:w-[280px]">
              <div className="relative aspect-square w-full overflow-hidden bg-black/5 md:w-[280px]">
                {member.headshot ? (
                  <Image
                    src={member.headshot}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                ) : null}
              </div>
            </div>
            {/* Right: info */}
            <div className="flex flex-1 flex-col">
              <Heading level={1}>{member.name}</Heading>
              <Caption className="mt-1 block text-red">{member.role}</Caption>
              <TeamSocialLinks
                urls={member}
                iconSize={18}
                className="mt-3 flex gap-3"
              />
              <hr className="mt-6 border-black/10" />
              {member.bio && (
                <div className="mt-6">
                  {bioIsHtml ? (
                    <div
                      className="prose prose-base max-w-none font-tiempos-text text-black/70 prose-headings:font-obviously prose-headings:font-semibold prose-headings:text-black prose-headings:lowercase"
                      dangerouslySetInnerHTML={{ __html: String(member.bio) }}
                    />
                  ) : (
                    <Body className="text-black/70">{member.bio}</Body>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Other team members */}
      <Section background="bone" padding="none" className="py-16">
        <Container width="wide">
          <Heading level={2}>more of the team</Heading>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {otherMembers.map((other) => (
              <TeamMemberCard
                key={other.id}
                member={{
                  id: other.id,
                  slug: other.slug,
                  name: other.name,
                  role: other.role ?? null,
                  headshot: other.headshot ?? null,
                  linkedinUrl: other.linkedinUrl ?? null,
                  tiktokUrl: other.tiktokUrl ?? null,
                  instagramUrl: other.instagramUrl ?? null,
                  youtubeUrl: other.youtubeUrl ?? null,
                }}
                imageSizes="(max-width: 768px) 50vw, 25vw"
                compact
              />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
