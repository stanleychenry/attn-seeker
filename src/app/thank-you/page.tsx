"use client";

import { useEffect } from "react";
import Image from "next/image";
import { HomeSearch } from "@/components/search";
import { QuickPills } from "@/components/search/quick-pills";
import { ProfileCircle } from "@/components/layout/profile-circle";

declare global {
  function fbq(track: string, event: string, params?: object, options?: object): void;
}

export default function ThankYouPage() {
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    // TODO: value should be dynamic when this page is used for multiple products
    fbq("track", "Purchase", { currency: "NZD", value: 79 }, { eventID: sessionId });
  }, []);

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-black px-sm">
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

        <p className="mt-4 w-full max-w-[600px] text-center font-obviously-wide text-4xl font-black lowercase text-bone md:text-6xl">
          thank you.
        </p>

        <p className="mt-3 w-full max-w-[600px] text-center font-tiempos-text text-base font-normal lowercase text-bone/70 md:text-xl">
          so much for your purchase.
          <br />
          your support is everything.
          <br />
          why not look around the site while you are here?
        </p>

        <div className="mt-6 w-full max-w-[600px]">
          <HomeSearch />
        </div>

        <div className="mt-3 w-full max-w-[600px]">
          <QuickPills />
        </div>
      </div>
    </div>
  );
}
