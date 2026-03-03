"use client";

import Link from "next/link";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
const EXPLORE_LINKS = [
  { label: "agency", href: "/agency" },
  { label: "learn", href: "/learn" },
  { label: "shows", href: "/shows" },
  { label: "podcasts", href: "/podcasts" },
  { label: "events", href: "/events" },
  { label: "about", href: "/about" },
];

const SEEKERS_LINKS = [
  { label: "join the seekers", href: "/join-the-seekers" },
  { label: "dashboard", href: "/seekers/dashboard" },
  { label: "rewards store", href: "/seekers/store" },
  { label: "games", href: "/seekers/game" },
  { label: "leaderboard", href: "/seekers/leaderboard" },
];

const labelClass =
  "font-obviously font-medium text-[14px] lowercase text-bone/55 mb-4 block";
const linkClass =
  "font-obviously font-normal text-[14px] text-bone hover:text-bone/80 block py-1";

export function Footer() {
  return (
    <footer className="bg-black py-2xl text-bone">
      <div className="mx-auto max-w-full px-sm">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-obviously-wide font-bold text-[20px] lowercase text-bone">
              {SITE_NAME}
            </p>
            <p className="mt-2 font-tiempos-text text-base text-bone/55">
              Organic social for challenger brands.
            </p>
          </div>

          <div>
            <span className={labelClass}>explore</span>
            <ul className="flex flex-col">
              {EXPLORE_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className={labelClass}>seekers</span>
            <ul className="flex flex-col">
              {SEEKERS_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className={labelClass}>connect</span>
            <ul className="flex flex-col">
              {SOCIAL_LINKS.map(({ platform, url }) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    {platform}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:hello@attnseeker.com"
                  className={linkClass}
                >
                  hello@attnseeker.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-bone/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="font-obviously font-normal text-[13px] lowercase text-bone/55">
              © 2025 the attention seeker
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy-policy"
                className="font-obviously font-normal text-[13px] lowercase text-bone/55 hover:text-bone/80"
              >
                privacy policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="font-obviously font-normal text-[13px] lowercase text-bone/55 hover:text-bone/80"
              >
                terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
