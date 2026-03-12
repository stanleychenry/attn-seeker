"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { submitGameResult } from "@/lib/xano";

const SIZE = 7;

type CellType = "empty" | "wall" | "wall-number";

interface PuzzleCell {
  type: CellType;
  number?: number;
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
    1000000
  );
}

function generateAkariPuzzle(seed: number): PuzzleCell[][] {
  const random = seededRandom(seed);

  const grid: PuzzleCell[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({ type: "empty" }))
  );

  const wallCount =
    Math.floor(SIZE * SIZE * 0.25) + Math.floor(random() * 4);
  const wallPositions = new Set<string>();

  while (wallPositions.size < wallCount) {
    const r = Math.floor(random() * SIZE);
    const c = Math.floor(random() * SIZE);
    wallPositions.add(`${r}-${c}`);
  }

  wallPositions.forEach((key) => {
    const [r, c] = key.split("-").map(Number);
    grid[r]![c]! = { type: "wall" };
  });

  const solution = new Set<string>();
  const illuminated = new Set<string>();

  const canPlaceBulb = (row: number, col: number): boolean => {
    if (grid[row]?.[col]?.type !== "empty") return false;
    if (solution.has(`${row}-${col}`)) return false;
    const directions: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
        if (grid[r]?.[c]?.type !== "empty") break;
        if (solution.has(`${r}-${c}`)) return false;
        r += dr;
        c += dc;
      }
    }
    return true;
  };

  const placeBulb = (row: number, col: number) => {
    solution.add(`${row}-${col}`);
    illuminated.add(`${row}-${col}`);
    const directions: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
        if (grid[r]?.[c]?.type !== "empty") break;
        illuminated.add(`${r}-${c}`);
        r += dr;
        c += dc;
      }
    }
  };

  const emptyCells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r]?.[c]?.type === "empty") emptyCells.push([r, c]);
    }
  }

  for (let i = emptyCells.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [emptyCells[i], emptyCells[j]] = [emptyCells[j]!, emptyCells[i]!];
  }

  for (const [r, c] of emptyCells) {
    if (!illuminated.has(`${r}-${c}`) && canPlaceBulb(r, c)) {
      placeBulb(r, c);
    }
  }

  for (const [r, c] of emptyCells) {
    if (!illuminated.has(`${r}-${c}`) && canPlaceBulb(r, c)) {
      placeBulb(r, c);
    }
  }

  wallPositions.forEach((key) => {
    const [r, c] = key.split("-").map(Number);
    const adjacent: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    let adjBulbs = 0;
    for (const [dr, dc] of adjacent) {
      const nr = r! + dr;
      const nc = c! + dc;
      if (
        nr >= 0 &&
        nr < SIZE &&
        nc >= 0 &&
        nc < SIZE &&
        solution.has(`${nr}-${nc}`)
      ) {
        adjBulbs++;
      }
    }
    if (random() < 0.4) {
      grid[r!]![c!]! = { type: "wall-number", number: adjBulbs };
    }
  });

  return grid;
}

export default function AkariGameClient() {
  const [puzzle] = useState<PuzzleCell[][]>(() =>
    generateAkariPuzzle(getDateSeed())
  );
  const [bulbs, setBulbs] = useState<Set<string>>(new Set());
  const [bulbHistory, setBulbHistory] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = `akari-${getDateSeed()}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved) as { completed?: boolean; time?: number };
        if (data.completed) {
          setIsComplete(true);
          setTimer(data.time ?? 0);
          setIsRunning(false);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const submittedRef = useRef(false);
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (isComplete) {
      const key = `akari-${getDateSeed()}`;
      try {
        localStorage.setItem(
          key,
          JSON.stringify({ completed: true, time: timer })
        );
      } catch {
        // ignore
      }
    }
  }, [isComplete, timer]);

  useEffect(() => {
    if (!isComplete || !authUser || submittedRef.current) return;
    submittedRef.current = true;
    const today = new Date().toISOString().split("T")[0];
    submitGameResult({
      game_type: "akari",
      date: today,
      completed: true,
      time_seconds: timer,
      bulbs_used: bulbs.size,
    }).catch(() => {});
  }, [isComplete, timer, authUser?.id, bulbs.size]);

  const getIlluminatedCells = useCallback(
    (bulbSet: Set<string>): Set<string> => {
      const illuminated = new Set<string>();
      bulbSet.forEach((key) => {
        const [row, col] = key.split("-").map(Number);
        illuminated.add(key);
        const directions: [number, number][] = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ];
        for (const [dr, dc] of directions) {
          let r = row! + dr;
          let c = col! + dc;
          while (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
            if (puzzle[r]?.[c]?.type !== "empty") break;
            illuminated.add(`${r}-${c}`);
            r += dr;
            c += dc;
          }
        }
      });
      return illuminated;
    },
    [puzzle]
  );

  const isBulbConflicting = useCallback(
    (row: number, col: number): boolean => {
      const key = `${row}-${col}`;
      if (!bulbs.has(key)) return false;
      const directions: [number, number][] = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
          if (puzzle[r]?.[c]?.type !== "empty") break;
          if (bulbs.has(`${r}-${c}`)) return true;
          r += dr;
          c += dc;
        }
      }
      return false;
    },
    [bulbs, puzzle]
  );

  const isNumberSatisfied = useCallback(
    (row: number, col: number): boolean | null => {
      const cell = puzzle[row]?.[col];
      if (cell?.type !== "wall-number" || cell.number === undefined)
        return null;
      const adjacent: [number, number][] = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      let count = 0;
      for (const [dr, dc] of adjacent) {
        const r = row + dr;
        const c = col + dc;
        if (
          r >= 0 &&
          r < SIZE &&
          c >= 0 &&
          c < SIZE &&
          bulbs.has(`${r}-${c}`)
        ) {
          count++;
        }
      }
      if (count === 0 && cell.number > 0) return null;
      return count === cell.number;
    },
    [puzzle, bulbs]
  );

  const toggleBulb = useCallback(
    (row: number, col: number) => {
      if (isComplete) return;
      if (puzzle[row]?.[col]?.type !== "empty") return;
      const key = `${row}-${col}`;
      setBulbs((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
          setBulbHistory((h) => h.filter((k) => k !== key));
        } else {
          next.add(key);
          setBulbHistory((h) => [...h, key]);
        }
        return next;
      });
    },
    [isComplete, puzzle]
  );

  useEffect(() => {
    if (bulbs.size === 0) return;

    const illuminated = getIlluminatedCells(bulbs);

    let allLit = true;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (
          puzzle[r]?.[c]?.type === "empty" &&
          !illuminated.has(`${r}-${c}`)
        ) {
          allLit = false;
        }
      }
    }

    let noConflicts = true;
    bulbs.forEach((key) => {
      const [row, col] = key.split("-").map(Number);
      if (isBulbConflicting(row!, col!)) noConflicts = false;
    });

    let allNumbersSatisfied = true;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (puzzle[r]?.[c]?.type === "wall-number") {
          if (isNumberSatisfied(r, c) !== true) allNumbersSatisfied = false;
        }
      }
    }

    if (allLit && noConflicts && allNumbersSatisfied) {
      setIsComplete(true);
      setIsRunning(false);
    }
  }, [
    bulbs,
    puzzle,
    getIlluminatedCells,
    isBulbConflicting,
    isNumberSatisfied,
  ]);

  const handleUndo = useCallback(() => {
    if (bulbHistory.length === 0) return;
    const lastKey = bulbHistory[bulbHistory.length - 1]!;
    setBulbs((prev) => {
      const next = new Set(prev);
      next.delete(lastKey);
      return next;
    });
    setBulbHistory((prev) => prev.slice(0, -1));
  }, [bulbHistory]);

  const handleReset = useCallback(() => {
    setBulbs(new Set());
    setBulbHistory([]);
    setTimer(0);
    setIsRunning(true);
    setIsComplete(false);
  }, []);

  const handleShare = useCallback(() => {
    const dateStr = new Date().toLocaleDateString("en-NZ", {
      day: "numeric",
      month: "short",
    });
    const timeStr = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;
    const text = `💡 attn:seeker akari ${dateStr}\n⏱ ${timeStr}\nattnseeker.com/seekers/game/akari`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [timer]);

  const illuminated = useMemo(() => getIlluminatedCells(bulbs), [bulbs, getIlluminatedCells]);

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
          <h1 className="font-obviously-wide text-2xl font-bold">akari</h1>
          <p className="mt-1 font-tiempos-text text-sm text-black/55">
            light up every cell
          </p>
        </div>

        {isComplete ? (
          <div className="py-12 text-center">
            <p className="font-obviously-wide text-2xl font-bold">
              puzzle complete!
            </p>
            <p className="mt-3 font-obviously-narrow text-4xl font-black text-red">
              +2 pts
            </p>
            <p className="mt-2 font-tiempos-text text-sm text-black/55">
              completed in{" "}
              {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
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
        ) : (
          <>
            <div className="relative mx-auto w-full max-w-[350px] aspect-square touch-none md:max-w-[420px]">
              <div className="absolute inset-0 grid grid-cols-7 grid-rows-7">
                {Array.from({ length: SIZE }, (_, r) =>
                  Array.from({ length: SIZE }, (_, c) => {
                    const cell = puzzle[r]?.[c];
                    const key = `${r}-${c}`;
                    const hasBulb = bulbs.has(key);
                    const isLit = illuminated.has(key);

                    if (cell?.type === "wall") {
                      return <div key={key} className="bg-black" />;
                    }
                    if (cell?.type === "wall-number") {
                      const satisfied = isNumberSatisfied(r, c);
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-center bg-black"
                        >
                          <span
                            className={`font-obviously-narrow text-sm font-black ${
                              satisfied === false ? "text-red" : "text-bone"
                            }`}
                          >
                            {cell.number}
                          </span>
                        </div>
                      );
                    }

                    if (hasBulb) {
                      const conflicting = isBulbConflicting(r, c);
                      return (
                        <div
                          key={key}
                          role="button"
                          tabIndex={0}
                          className={`flex cursor-pointer items-center justify-center border border-black/10 transition-colors ${
                            conflicting ? "bg-red/10" : "bg-[#EDE8D6]"
                          }`}
                          onClick={() => toggleBulb(r, c)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleBulb(r, c);
                            }
                          }}
                        >
                          <span
                            className={`text-lg ${
                              conflicting ? "text-red" : "text-yellow-500"
                            }`}
                          >
                            ☀
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={key}
                        role="button"
                        tabIndex={0}
                        className={`cursor-pointer border border-black/10 transition-colors ${
                          isLit ? "bg-[#EDE8D6]" : "bg-bone hover:bg-bone/80"
                        }`}
                        onClick={() => toggleBulb(r, c)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleBulb(r, c);
                          }
                        }}
                      />
                    );
                  })
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={bulbHistory.length === 0}
                  className="rounded-full border border-black/20 px-4 py-2 font-obviously text-xs font-medium text-black/60 transition-colors hover:border-black/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  undo
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full border border-black/20 px-4 py-2 font-obviously text-xs font-medium text-black/60 transition-colors hover:border-black/40"
                >
                  reset
                </button>
              </div>
              <p className="font-obviously-narrow tabular-nums text-lg font-black text-black">
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
