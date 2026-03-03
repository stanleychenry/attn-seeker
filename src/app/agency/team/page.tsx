import { getTeams } from "@/lib/cms";
import {
  Heading,
  Button,
  Caption,
  Section,
  Container,
} from "@/components/ui";
import { TeamMemberCard } from "./team-social-links";

export const metadata = {
  title: "team | attn:seeker",
  description:
    "meet the team behind the attention seeker. organic social media specialists across five countries.",
};

export default async function TeamPage() {
  let team: Awaited<ReturnType<typeof getTeams>> = [];
  try {
    team = await getTeams();
  } catch (error) {
    console.error("Failed to fetch team:", error);
  }

  const sortedTeam = [...team].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.sortOrder - b.sortOrder;
  });

  if (sortedTeam.length === 0) {
    return (
      <>
        <Section background="bone" padding="none" className="py-16 md:py-24">
          <Container width="standard">
            <Caption className="block text-red">team</Caption>
            <Heading level={1} className="mt-4">
              the people behind the attention
            </Heading>
            <p className="mt-6 font-tiempos-text text-black/70">No team members available.</p>
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <Caption className="block text-red">team</Caption>
          <Heading level={1} className="mt-4">
            the people behind the attention
          </Heading>
        </Container>
      </Section>

      <Section background="bone" padding="none" className="py-8 pb-16">
        <Container width="wide">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {sortedTeam.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={{
                  id: member.id,
                  slug: member.slug,
                  name: member.name,
                  role: member.role ?? null,
                  headshot: member.headshot ?? null,
                  linkedinUrl: member.linkedinUrl ?? null,
                  tiktokUrl: member.tiktokUrl ?? null,
                  instagramUrl: member.instagramUrl ?? null,
                  youtubeUrl: member.youtubeUrl ?? null,
                }}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. CTA */}
      <Section background="bone" padding="none" className="py-16">
        <Container width="standard" className="text-center">
          <Heading level={2}>want to join us?</Heading>
          <Button
            variant="ghost"
            href="/agency/careers"
            className="mt-6"
          >
            see open roles
          </Button>
        </Container>
      </Section>
    </>
  );
}
