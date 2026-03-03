"use client";

import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram, Youtube } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok-icon";

type SocialUrls = {
  linkedinUrl?: string | null;
  tiktokUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
};

/** Client-only: social icon links with stopPropagation so parent Link doesn’t fire. */
export function TeamSocialLinks({
  urls,
  iconSize = 16,
  className = "mt-2 flex gap-2",
}: {
  urls: SocialUrls;
  iconSize?: number;
  className?: string;
}) {
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div className={className} onClick={stop}>
      {urls.linkedinUrl && (
        <a
          href={urls.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/40 transition-colors hover:text-red"
          onClick={stop}
          aria-label="LinkedIn"
        >
          <Linkedin size={iconSize} />
        </a>
      )}
      {urls.tiktokUrl && (
        <a
          href={urls.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/40 transition-colors hover:text-red"
          onClick={stop}
          aria-label="TikTok"
        >
          <TikTokIcon size={iconSize} />
        </a>
      )}
      {urls.instagramUrl && (
        <a
          href={urls.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/40 transition-colors hover:text-red"
          onClick={stop}
          aria-label="Instagram"
        >
          <Instagram size={iconSize} />
        </a>
      )}
      {urls.youtubeUrl && (
        <a
          href={urls.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/40 transition-colors hover:text-red"
          onClick={stop}
          aria-label="YouTube"
        >
          <Youtube size={iconSize} />
        </a>
      )}
    </div>
  );
}

type TeamMember = {
  id: string;
  slug: string;
  name: string;
  role?: string | null;
  headshot?: string | null;
  linkedinUrl?: string | null;
  tiktokUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
};

/** Client-only: team card with link and social links (onClick inside client). */
export function TeamMemberCard({
  member,
  imageSizes = "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
  compact = false,
}: {
  member: TeamMember;
  imageSizes?: string;
  compact?: boolean;
}) {
  return (
    <Link
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
            sizes={imageSizes}
          />
        ) : null}
      </div>
      <h3
        className={
          compact
            ? "mt-2 font-obviously font-semibold text-sm lowercase text-black"
            : "mt-3 font-obviously font-semibold text-base lowercase text-black"
        }
      >
        {member.name}
      </h3>
      <p
        className={
          compact
            ? "mt-0.5 block text-xs text-black/50"
            : "mt-0.5 block text-black/50"
        }
      >
        {member.role ?? ""}
      </p>
      <TeamSocialLinks
        urls={member}
        iconSize={compact ? 16 : 16}
        className={compact ? "mt-2 flex gap-2" : "mt-2 flex gap-2"}
      />
    </Link>
  );
}
