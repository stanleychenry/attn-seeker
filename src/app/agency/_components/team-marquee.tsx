"use client";

import Image from "next/image";
import Link from "next/link";
import { Caption } from "@/components/ui";
import type { Team } from "@/types/cms";

interface TeamMarqueeProps {
  team: Team[];
}

export function TeamMarquee({ team }: TeamMarqueeProps) {
  return (
    <div className="mt-8 overflow-hidden">
      <style>{`
        @keyframes team-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .team-marquee {
          animation: team-marquee 35s linear infinite;
        }
        .team-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div
        className="team-marquee flex gap-4 md:gap-6"
        style={{ width: "max-content" }}
      >
        {[...team, ...team].map((member, i) => (
          <Link
            key={`${member.id}-${i}`}
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
  );
}
