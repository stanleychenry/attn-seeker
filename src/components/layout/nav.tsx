"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SearchBar } from "@/components/search";
import { ProfileCircle } from "./profile-circle";

const NAV_LINKS = [
  { label: "newsletter", href: "/learn" },
  { label: "podcasts", href: "/podcasts" },
  { label: "events", href: "/events" },
  { label: "agency", href: "/agency" },
  { label: "contact", href: "/agency/contact" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/") return null;

  const isDarkNav =
    pathname.startsWith("/shows") || pathname.startsWith("/podcasts");

  return (
    <>
      <header
        className={
          isDarkNav
            ? "fixed left-0 right-0 top-0 z-50 h-14 border-b border-bone/10 bg-[#1A1A1A] text-bone"
            : "fixed left-0 right-0 top-0 z-50 h-14 border-b border-black/10 bg-bone text-black"
        }
      >
        <div className="mx-auto flex h-full max-w-[1100px] items-center justify-between px-6">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/brand/logos/TAS-HighRes-_attn-seeker - Red.png"
              alt="attn:seeker"
              width={140}
              height={28}
              className="h-auto w-[120px] md:w-[140px]"
            />
          </Link>

          <div className="hidden flex-1 justify-center md:flex">
            <div className="w-full max-w-[320px]">
              <SearchBar variant="compact" darkNav={isDarkNav} />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <nav className="hidden md:flex md:items-center md:gap-6" aria-label="Main">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={
                    isDarkNav
                      ? "font-obviously font-medium text-[13px] lowercase text-bone/70 transition-colors hover:text-bone"
                      : "font-obviously font-medium text-[13px] lowercase text-black/70 transition-colors hover:text-black"
                  }
                >
                  {label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={
                isDarkNav
                  ? "flex h-10 w-10 items-center justify-center text-bone md:hidden"
                  : "flex h-10 w-10 items-center justify-center text-black md:hidden"
              }
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" strokeWidth={2} />
            </button>
            <ProfileCircle variant="dark" />
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-bone md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="flex h-full flex-col p-6 pt-16">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center text-black"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </button>
            <nav
              className="flex flex-1 flex-col justify-center gap-8"
              aria-label="Main"
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-obviously-wide font-semibold text-[28px] lowercase text-black hover:text-red"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-black/10 pt-6">
              <ProfileCircle variant="dark" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
