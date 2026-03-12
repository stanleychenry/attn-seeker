"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { submitGameResult } from "@/lib/xano";

const COLOURS = [
  { id: "red", hex: "#FF0000", label: "red" },
  { id: "black", hex: "#000000", label: "black" },
  { id: "orange", hex: "#E67E22", label: "orange" },
  { id: "teal", hex: "#1ABC9C", label: "teal" },
  { id: "purple", hex: "#8E44AD", label: "purple" },
  { id: "bone-dark", hex: "#D4C5A9", label: "bone" },
];

interface Guess {
  colours: (string | null)[];
  feedback: ("exact" | "wrong-position" | "miss")[];
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getDateSeed(): number {
  const now = new Date();
  return (
    now.getFullYear() * 10000 +
    (now.getMonth() + 1) * 100 +
    now.getDate() +
    2000000
  );
}

function generateSecretCode(seed: number): string[] {
  const random = seededRandom(seed);
  const colourIds = COLOURS.map((c) => c.id);
  return Array.from(
    { length: 4 },
    () => colourIds[Math.floor(random() * colourIds.length)]!
  );
}

function calculateFeedback(
  guess: string[],
  secret: string[]
): ("exact" | "wrong-position" | "miss")[] {
  const feedback: ("exact" | "wrong-position" | "miss")[] = [
    "miss",
    "miss",
    "miss",
    "miss",
  ];
  const secretRemaining: (string | null)[] = [...secret];
  const guessRemaining: (string | null)[] = [...guess];

  for (let i = 0; i < 4; i++) {
    if (guess[i] === secret[i]) {
      feedback[i] = "exact";
      secretRemaining[i] = null;
      guessRemaining[i] = null;
    }
  }

  for (let i = 0; i < 4; i++) {
    if (guessRemaining[i] === null) continue;
    const matchIndex = secretRemaining.findIndex((s) => s === guessRemaining[i]);
    if (matchIndex !== -1) {
      feedback[i] = "wrong-position";
      secretRemaining[matchIndex] = null;
    }
  }

  feedback.sort((a, b) => {
    const order = { exact: 0, "wrong-position": 1, miss: 2 };
    return order[a] - order[b];
  });

  return feedback;
}

export default function MastermindGameClient() {
  const [secretCode] = useState<string[]>(() =>
    generateSecretCode(getDateSeed())
  );
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = `mastermind-${getDateSeed()}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved) as {
          won?: boolean;
          guesses?: Guess[];
          time?: number;
        };
        setGameState(data.won ? "won" : "lost");
        setGuesses(data.guesses ?? []);
        setTimer(data.time ?? 0);
        setIsRunning(false);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const submittedRef = useRef(false);
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (gameState === "won" || gameState === "lost") {
      const key = `mastermind-${getDateSeed()}`;
      try {
        localStorage.setItem(
          key,
          JSON.stringify({
            won: gameState === "won",
            guesses,
            time: timer,
          })
        );
      } catch {
        // ignore
      }
    }
  }, [gameState, guesses, timer]);

  useEffect(() => {
    if (gameState !== "won" || !authUser?.email || submittedRef.current) return;
    submittedRef.current = true;
    const today = new Date().toISOString().split("T")[0];
    submitGameResult({
      user_email: authUser.email,
      game_type: "mastermind",
      date: today,
      completed: true,
      time_seconds: timer,
      guesses_used: guesses.length,
    }).catch(() => {});
  }, [gameState, timer, authUser?.email, guesses.length]);

  const handleColourSelect = useCallback(
    (colourId: string) => {
      if (gameState !== "playing") return;
      const next = [...currentGuess];
      next[currentSlot] = colourId;
      setCurrentGuess(next);
      let nextSlot = 0;
      for (let i = 0; i < 4; i++) {
        if (next[i] === null) {
          nextSlot = i;
          break;
        }
        nextSlot = i;
      }
      setCurrentSlot(nextSlot);
    },
    [gameState, currentSlot, currentGuess]
  );

  const handleClearRow = useCallback(() => {
    setCurrentGuess([null, null, null, null]);
    setCurrentSlot(0);
  }, []);

  const handleSubmitGuess = useCallback(() => {
    if (currentGuess.some((c) => c === null)) return;

    const guess = currentGuess as string[];
    const feedback = calculateFeedback(guess, secretCode);

    const newGuess: Guess = {
      colours: [...guess],
      feedback,
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);

    if (feedback.every((f) => f === "exact")) {
      setGameState("won");
      setIsRunning(false);
    } else if (newGuesses.length >= 10) {
      setGameState("lost");
      setIsRunning(false);
    }

    setCurrentGuess([null, null, null, null]);
    setCurrentSlot(0);
  }, [currentGuess, secretCode, guesses]);

  const handleShare = useCallback(() => {
    const dateStr = new Date().toLocaleDateString("en-NZ", {
      day: "numeric",
      month: "short",
    });
    const result =
      gameState === "won" ? `${guesses.length}/10` : "X/10";
    const timeStr = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;

    const rows = guesses
      .map((g) =>
        g.feedback
          .map((f) =>
            f === "exact" ? "🟥" : f === "wrong-position" ? "⬜" : "⬛"
          )
          .join("")
      )
      .join("\n");

    const text = `🧠 attn:seeker mastermind ${dateStr}\n${result} · ⏱ ${timeStr}\n\n${rows}\n\nattnseeker.com/seekers/game/mastermind`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [gameState, guesses, timer]);

  return (
    <div className="min-h-screen bg-bone px-4 pb-12">
      <div className="mx-auto max-w-[500px]">
        <div className="flex items-center justify-between py-6">
          <Link
            href="/seekers/game"
            className="font-obviously text-xs text-red hover:underline"
          >
            ← back to games
          </Link>
          <p className="font-obviously text-xs font-medium text-red">
            🔥 12 day streak
          </p>
        </div>

        <div className="mb-8 text-center">
          <h1 className="font-obviously-wide text-2xl font-bold">
            mastermind
          </h1>
          <p className="mt-1 font-tiempos-text text-sm text-black/55">
            crack the colour code
          </p>
        </div>

        {gameState === "won" && (
          <div className="py-12 text-center">
            <p className="font-obviously-wide text-2xl font-bold">
              code cracked!
            </p>
            <p className="mt-3 font-obviously-narrow text-4xl font-black text-red">
              +2 pts
            </p>
            <p className="mt-2 font-tiempos-text text-sm text-black/55">
              solved in {guesses.length} guess
              {guesses.length !== 1 ? "es" : ""} ·{" "}
              {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </p>

            <div className="mt-4 flex justify-center gap-2">
              {secretCode.map((colourId, i) => {
                const colour = COLOURS.find((c) => c.id === colourId);
                return (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full"
                    style={{ backgroundColor: colour?.hex }}
                  />
                );
              })}
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full border border-black/20 px-5 py-2.5 font-obviously text-xs font-medium text-black/60 transition-colors hover:border-black/40"
              >
                {copied ? "copied!" : "share"}
              </button>
              <Link
                href="/seekers/game"
                className="inline-block rounded-full bg-red px-5 py-2.5 font-obviously text-xs font-medium text-bone transition-colors hover:bg-red/90"
              >
                back to games
              </Link>
            </div>
          </div>
        )}

        {gameState === "lost" && (
          <div className="py-12 text-center">
            <p className="font-obviously-wide text-2xl font-bold">
              not this time
            </p>
            <p className="mt-2 font-tiempos-text text-sm text-black/55">
              the code was:
            </p>

            <div className="mt-4 flex justify-center gap-2">
              {secretCode.map((colourId, i) => {
                const colour = COLOURS.find((c) => c.id === colourId);
                return (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full"
                    style={{ backgroundColor: colour?.hex }}
                  />
                );
              })}
            </div>

            <p className="mt-4 font-tiempos-text text-sm text-black/40">
              better luck tomorrow.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full border border-black/20 px-5 py-2.5 font-obviously text-xs font-medium text-black/60 transition-colors hover:border-black/40"
              >
                {copied ? "copied!" : "share"}
              </button>
              <Link
                href="/seekers/game"
                className="inline-block rounded-full bg-red px-5 py-2.5 font-obviously text-xs font-medium text-bone transition-colors hover:bg-red/90"
              >
                back to games
              </Link>
            </div>
          </div>
        )}

        {gameState === "playing" && (
          <>
            <div className="space-y-2">
              {Array.from({ length: 10 }, (_, rowIndex) => {
                const guess = guesses[rowIndex];
                const isCurrentRow =
                  rowIndex === guesses.length && gameState === "playing";

                return (
                  <div
                    key={rowIndex}
                    className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-colors ${
                      isCurrentRow
                        ? "bg-white"
                        : guess
                          ? "bg-white/60"
                          : "bg-black/[0.02]"
                    }`}
                  >
                    <span className="font-obviously-narrow w-4 text-xs font-black text-black/20">
                      {rowIndex + 1}
                    </span>

                    <div className="flex gap-2">
                      {Array.from({ length: 4 }, (_, slotIndex) => {
                        const colourId = isCurrentRow
                          ? currentGuess[slotIndex]
                          : guess?.colours[slotIndex] ?? null;

                        const colour = colourId
                          ? COLOURS.find((c) => c.id === colourId)
                          : null;

                        return (
                          <button
                            key={slotIndex}
                            type="button"
                            onClick={() => {
                              if (isCurrentRow) {
                                setCurrentSlot(slotIndex);
                              }
                            }}
                            className={`h-10 w-10 rounded-full transition-all ${
                              isCurrentRow && slotIndex === currentSlot
                                ? "ring-2 ring-red ring-offset-2 ring-offset-bone"
                                : ""
                            }`}
                            style={{
                              backgroundColor: colour
                                ? colour.hex
                                : "transparent",
                              border: colour
                                ? "none"
                                : "2px dashed rgba(0,0,0,0.1)",
                            }}
                            disabled={!isCurrentRow}
                            aria-label={
                              colour
                                ? colour.label
                                : `slot ${slotIndex + 1} empty`
                            }
                          />
                        );
                      })}
                    </div>

                    <div className="ml-2 grid grid-cols-2 gap-1">
                      {Array.from({ length: 4 }, (_, pegIndex) => {
                        const feedback = guess?.feedback[pegIndex];
                        return (
                          <div
                            key={pegIndex}
                            className={`h-3 w-3 rounded-full ${
                              feedback === "exact"
                                ? "bg-red"
                                : feedback === "wrong-position"
                                  ? "border-2 border-black bg-transparent"
                                  : guess
                                    ? "bg-black/10"
                                    : "bg-black/5"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <div className="flex justify-center gap-3">
                {COLOURS.map((colour) => (
                  <button
                    key={colour.id}
                    type="button"
                    onClick={() => handleColourSelect(colour.id)}
                    className="h-10 w-10 rounded-full transition-transform hover:scale-110"
                    style={{ backgroundColor: colour.hex }}
                    aria-label={colour.label}
                  />
                ))}
              </div>

              <div className="mt-5 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClearRow}
                  className="rounded-full border border-black/20 px-4 py-2 font-obviously text-xs font-medium text-black/60 transition-colors hover:border-black/40"
                >
                  clear row
                </button>
                <button
                  type="button"
                  onClick={handleSubmitGuess}
                  disabled={currentGuess.some((c) => c === null)}
                  className={`rounded-full px-5 py-2 font-obviously text-xs font-medium transition-colors ${
                    currentGuess.every((c) => c !== null)
                      ? "bg-red text-bone hover:bg-red/90"
                      : "cursor-not-allowed bg-black/10 text-black/30"
                  }`}
                >
                  submit
                </button>
              </div>

              <p className="mt-4 text-center font-obviously-narrow text-lg font-black tabular-nums text-black">
                {String(Math.floor(timer / 60)).padStart(2, "0")}:
                {String(timer % 60).padStart(2, "0")}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
