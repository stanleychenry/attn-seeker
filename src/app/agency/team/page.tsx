import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram, Youtube } from "lucide-react";
import { getTeams } from "@/lib/cms";
import { TikTokIcon } from "@/components/icons/tiktok-icon";
import {
  Heading,
  Button,
  Caption,
  Section,
  Container,
} from "@/components/ui";

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
              <Link
                key={member.id}
                href={`/agency/team/${member.slug}`}
                className="group block"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-black/5">
                  {member.headshot ? (
                    <Image
                      src={member.headshot}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : null}
                </div>
                <h3 className="mt-3 font-obviously font-semibold text-base lowercase text-black">
                  {member.name}
                </h3>
                <Caption className="mt-0.5 block text-black/50">
                  {member.role}
                </Caption>
                <div
                  className="mt-2 flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black/40 transition-colors hover:text-red"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                  {member.tiktokUrl && (
                    <a
                      href={member.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black/40 transition-colors hover:text-red"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="TikTok"
                      >
                        <TikTokIcon size={16} />
                      </a>
                    )}
                  {member.instagramUrl && (
                    <a
                      href={member.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black/40 transition-colors hover:text-red"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Instagram"
                      >
                        <Instagram size={16} />
                      </a>
                    )}
                  {member.youtubeUrl && (
                    <a
                      href={member.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black/40 transition-colors hover:text-red"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="YouTube"
                      >
                        <Youtube size={16} />
                      </a>
                    )}
                </div>
              </Link>
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
