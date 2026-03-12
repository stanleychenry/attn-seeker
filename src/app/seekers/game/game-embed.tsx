"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { submitGameResult } from "@/lib/xano";

const VERCEL_GAME_ORIGINS = [
  "https://shikaku-game.vercel.app",
  "https://akari-game.vercel.app",
  "https://mastermind-game-brown.vercel.app",
];

const GAME_CONFIG = {
  shikaku: {
    name: "shikaku",
    src: "https://shikaku-game.vercel.app",
    description: "divide the grid into rectangles.",
  },
  akari: {
    name: "akari",
    src: "https://akari-game.vercel.app",
    description: "light up every cell.",
  },
  mastermind: {
    name: "mastermind",
    src: "https://mastermind-game-brown.vercel.app",
    description: "crack the colour code.",
  },
} as const;

type GameId = keyof typeof GAME_CONFIG;

type GameEmbedProps = {
  game: GameId;
};

export default function GameEmbed({ game }: GameEmbedProps) {
  const { user } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(700);

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;
      if (!VERCEL_GAME_ORIGINS.includes(event.origin)) return;

      const data = event.data as {
        type?: string;
        game?: string;
        data?: Record<string, unknown>;
        height?: number;
      };

      if (data.type === "RESIZE_IFRAME" && typeof data.height === "number") {
        setIframeHeight(data.height);
        return;
      }

      if (data.type !== "GAME_COMPLETE") return;

      if (!user) return;

      const today = new Date().toISOString().split("T")[0];
      const d = data.data ?? {};
      try {
        await submitGameResult({
          game_type: data.game ?? game,
          date: today,
          completed: (d.completed as boolean) ?? true,
          time_seconds: (d.time_seconds as number) ?? 0,
          difficulty: (d.difficulty as string) ?? "",
          guesses_used: (d.guesses_used as number) ?? 0,
          rectangles_used: (d.rectangles_used as number) ?? 0,
          bulbs_used: (d.bulbs_used as number) ?? 0,
        });
      } catch {
        // ignore
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [game, user?.email]);

  const config = GAME_CONFIG[game];
  if (!config) return null;

  return (
    <div className="min-h-screen bg-bone px-4 pb-12">
      <div className="mx-auto max-w-[900px]">
        <div className="flex items-center justify-between py-6">
          <Link
            href="/seekers/game"
            className="font-obviously text-xs text-red hover:underline"
          >
            ← back to games
          </Link>
        </div>

        <div className="mb-4 text-center">
          <h1 className="font-obviously-wide text-2xl font-bold">
            {config.name}
          </h1>
          <p className="mt-1 font-tiempos-text text-sm text-black/55">
            {config.description}
          </p>
        </div>

        <div
          className="overflow-hidden rounded-lg bg-white"
          style={{ minHeight: 400 }}
        >
          <iframe
            ref={iframeRef}
            src={config.src}
            title={`${config.name} daily puzzle`}
            className="w-full border-0"
            style={{ height: iframeHeight }}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
