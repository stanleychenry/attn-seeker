"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { STATS } from "@/lib/constants";
import { SearchBar } from "@/components/search";
import { QuickPills } from "@/components/search/quick-pills";
import { ProfileCircle } from "@/components/layout/profile-circle";

const GREETINGS = [
  "ask us anything about social media",
  "nau mai, haere mai. what can we help you find?",
  "type a question, search a topic, or just explore",
  "looking for help with your brand's social? start here",
  "ask a question, find an article, discover a podcast",
  "everything you need to know about organic social",
];

export function HomePageContent() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setGreeting(
      GREETINGS[Math.floor(Math.random() * GREETINGS.length)] ?? ""
    );
  }, []);

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-red px-sm">
      <div className="fixed top-4 right-6 z-50">
        <ProfileCircle variant="light" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/brand/logos/TAS-HighRes-_attn-seeker - Bone.png"
          alt="attn:seeker"
          width={400}
          height={80}
          priority
          className="w-[280px] md:w-[400px] h-auto"
        />

        <p className="mt-4 text-center font-tiempos-text text-base font-normal lowercase text-bone/70 md:text-xl">
          {greeting || "\u00A0"}
        </p>

        <div className="mt-6 w-full max-w-[600px]">
          <SearchBar variant="hero" />
        </div>

        <div className="mt-3 w-full max-w-[600px]">
          <QuickPills />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
        <p className="font-obviously font-normal text-[13px] lowercase text-bone/85">
          <span>{STATS.followerCount} followers</span>
          <span className="mx-2">·</span>
          <span>{STATS.viewCount} views</span>
          <span className="mx-2">·</span>
          <span>{STATS.countries} countries</span>
          <span className="mx-2">·</span>
          <span>{STATS.paidAds} paid ads</span>
        </p>
      </div>
    </div>
  );
}
