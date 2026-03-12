"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { submitGameResult } from "@/lib/xano";

const RECTANGLE_COLOURS = [
  "rgba(255, 0, 0, 0.12)",
  "rgba(180, 120, 60, 0.12)",
  "rgba(220, 160, 80, 0.12)",
  "rgba(160, 80, 40, 0.12)",
  "rgba(200, 60, 60, 0.12)",
  "rgba(180, 140, 100, 0.12)",
  "rgba(140, 100, 60, 0.15)",
  "rgba(220, 100, 60, 0.12)",
];

const SIZE = 6;

interface PuzzleCell {
  number: number | null;
}

interface Rectangle {
  id: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  colourIndex: number;
  isValid: boolean;
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
    now.getDate()
  );
}

function generatePuzzle(seed: number): PuzzleCell[][] {
  const random = seededRandom(seed);
  const grid: PuzzleCell[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({ number: null }))
  );
  const assigned: boolean[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => false)
  );

  const tryPlaceRectangle = (): boolean => {
    let startRow = -1,
      startCol = -1;
    for (let r = 0; r < SIZE && startRow === -1; r++) {
      for (let c = 0; c < SIZE && startCol === -1; c++) {
        if (!assigned[r][c]) {
          startRow = r;
          startCol = c;
        }
      }
    }
    if (startRow === -1) return false;

    const possibleRects: { rows: number; cols: number }[] = [];
    for (let h = 1; h <= Math.min(4, SIZE - startRow); h++) {
      for (let w = 1; w <= Math.min(6, SIZE - startCol); w++) {
        const area = h * w;
        if (area < 2 || area > 6) continue;
        let fits = true;
        for (let r = startRow; r < startRow + h && fits; r++) {
          for (let c = startCol; c < startCol + w && fits; c++) {
            if (assigned[r][c]) fits = false;
          }
        }
        if (fits) possibleRects.push({ rows: h, cols: w });
      }
    }

    if (possibleRects.length === 0) {
      assigned[startRow][startCol] = true;
      grid[startRow][startCol] = { number: 1 };
      return true;
    }

    const rect =
      possibleRects[Math.floor(random() * possibleRects.length)]!;
    const area = rect.rows * rect.cols;

    for (let r = startRow; r < startRow + rect.rows; r++) {
      for (let c = startCol; c < startCol + rect.cols; c++) {
        assigned[r][c] = true;
      }
    }

    const numberRow = startRow + Math.floor(random() * rect.rows);
    const numberCol = startCol + Math.floor(random() * rect.cols);
    grid[numberRow]![numberCol]! = { number: area };

    return true;
  };

  while (tryPlaceRectangle()) {
    // continue
  }

  return grid;
}

function rectsOverlap(
  a: { startRow: number; startCol: number; endRow: number; endCol: number },
  b: { startRow: number; startCol: number; endRow: number; endCol: number }
): boolean {
  const aMinR = Math.min(a.startRow, a.endRow);
  const aMaxR = Math.max(a.startRow, a.endRow);
  const aMinC = Math.min(a.startCol, a.endCol);
  const aMaxC = Math.max(a.startCol, a.endCol);
  const bMinR = Math.min(b.startRow, b.endRow);
  const bMaxR = Math.max(b.startRow, b.endRow);
  const bMinC = Math.min(b.startCol, b.endCol);
  const bMaxC = Math.max(b.startCol, b.endCol);
  return !(aMaxR < bMinR || aMinR > bMaxR || aMaxC < bMinC || aMinC > bMaxC);
}

export default function ShikakuGameClient() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [puzzle] = useState<PuzzleCell[][]>(() =>
    generatePuzzle(getDateSeed())
  );
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [dragEnd, setDragEnd] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [colourCounter, setColourCounter] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = `shikaku-${getDateSeed()}`;
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
      const key = `shikaku-${getDateSeed()}`;
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
      game_type: "shikaku",
      date: today,
      completed: true,
      time_seconds: timer,
      rectangles_used: rectangles.length,
    }).catch(() => {});
  }, [isComplete, timer, authUser?.id, rectangles.length]);

  const getCellFromPosition = useCallback((clientX: number, clientY: number) => {
    const el = boardRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return null;
    const col = Math.floor((x / rect.width) * SIZE);
    const row = Math.floor((y / rect.height) * SIZE);
    return { row: Math.min(row, SIZE - 1), col: Math.min(col, SIZE - 1) };
  }, []);

  const checkWin = useCallback(
    (rects: Rectangle[]) => {
      const covered = Array.from({ length: SIZE }, () =>
        Array.from({ length: SIZE }, () => 0)
      );
      for (const r of rects) {
        const minR = Math.min(r.startRow, r.endRow);
        const maxR = Math.max(r.startRow, r.endRow);
        const minC = Math.min(r.startCol, r.endCol);
        const maxC = Math.max(r.startCol, r.endCol);
        if (!r.isValid) return false;
        for (let row = minR; row <= maxR; row++) {
          for (let col = minC; col <= maxC; col++) {
            covered[row]![col]! += 1;
          }
        }
      }
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (covered[r]![c]! !== 1) return false;
        }
      }
      return true;
    },
    []
  );

  const finalizeRectangle = useCallback(
    (start: { row: number; col: number }, end: { row: number; col: number }) => {
      const minR = Math.min(start.row, end.row);
      const maxR = Math.max(start.row, end.row);
      const minC = Math.min(start.col, end.col);
      const maxC = Math.max(start.col, end.col);
      const area = (maxR - minR + 1) * (maxC - minC + 1);

      let numberCount = 0;
      let theNumber = 0;
      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          const n = puzzle[r]?.[c]?.number;
          if (n != null) {
            numberCount++;
            theNumber = n;
          }
        }
      }
      const isValid = numberCount === 1 && theNumber === area;

      setRectangles((prev) => {
        const newRect: Rectangle = {
          id: `rect-${Date.now()}`,
          startRow: minR,
          startCol: minC,
          endRow: maxR,
          endCol: maxC,
          colourIndex: colourCounter,
          isValid,
        };
        const filtered = prev.filter(
          (r) =>
            !rectsOverlap(
              {
                startRow: r.startRow,
                startCol: r.startCol,
                endRow: r.endRow,
                endCol: r.endCol,
              },
              {
                startRow: newRect.startRow,
                startCol: newRect.startCol,
                endRow: newRect.endRow,
                endCol: newRect.endCol,
              }
            )
        );
        const next = [...filtered, newRect];
        if (checkWin(next)) {
          setIsComplete(true);
          setIsRunning(false);
        }
        return next;
      });
      setColourCounter((c) => c + 1);
    },
    [puzzle, colourCounter, checkWin]
  );

  const handleMouseDown = useCallback((row: number, col: number) => {
    if (isComplete) return;
    setIsDragging(true);
    setDragStart({ row, col });
    setDragEnd({ row, col });
  }, [isComplete]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStart) return;
      const cell = getCellFromPosition(e.clientX, e.clientY);
      if (cell) setDragEnd(cell);
    },
    [isDragging, dragStart, getCellFromPosition]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !dragStart || !dragEnd) {
      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
      return;
    }
    finalizeRectangle(dragStart, dragEnd);
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }, [isDragging, dragStart, dragEnd, finalizeRectangle]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isComplete) return;
      const touch = e.touches[0];
      if (!touch) return;
      const cell = getCellFromPosition(touch.clientX, touch.clientY);
      if (cell) {
        setIsDragging(true);
        setDragStart(cell);
        setDragEnd(cell);
      }
    },
    [isComplete, getCellFromPosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !dragStart) return;
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      const cell = getCellFromPosition(touch.clientX, touch.clientY);
      if (cell) setDragEnd(cell);
    },
    [isDragging, dragStart, getCellFromPosition]
  );

  const handleTouchEnd = useCallback(() => {
    if (!dragStart || !dragEnd) {
      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
      return;
    }
    finalizeRectangle(dragStart, dragEnd);
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }, [dragStart, dragEnd, finalizeRectangle]);

  const handleUndo = useCallback(() => {
    setRectangles((prev) => prev.slice(0, -1));
  }, []);

  const handleReset = useCallback(() => {
    setRectangles([]);
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
    const text = `🟥 attn:seeker shikaku ${dateStr}\n⏱ ${timeStr}\nattnseeker.com/seekers/game/shikaku`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [timer]);

  const dragRect =
    dragStart && dragEnd
      ? {
          minR: Math.min(dragStart.row, dragEnd.row),
          maxR: Math.max(dragStart.row, dragEnd.row),
          minC: Math.min(dragStart.col, dragEnd.col),
          maxC: Math.max(dragStart.col, dragEnd.col),
        }
      : null;

  return (
    <div className="min-h-screen bg-bone px-4 pb-12">
      <div className="mx-auto max-w-[500px]">
        {/* Top bar */}
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

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="font-obviously-wide text-2xl font-bold">shikaku</h1>
          <p className="mt-1 font-tiempos-text text-sm text-black/55">
            divide the grid into rectangles
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
            {/* Game board */}
            <div
              ref={boardRef}
              className="relative mx-auto w-full max-w-[320px] aspect-square touch-none md:max-w-[400px]"
            >
              {/* Rectangle overlays */}
              {rectangles.map((rect) => {
                const minR = Math.min(rect.startRow, rect.endRow);
                const maxR = Math.max(rect.startRow, rect.endRow);
                const minC = Math.min(rect.startCol, rect.endCol);
                const maxC = Math.max(rect.startCol, rect.endCol);
                const h = maxR - minR + 1;
                const w = maxC - minC + 1;
                return (
                  <div
                    key={rect.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${(minC / SIZE) * 100}%`,
                      top: `${(minR / SIZE) * 100}%`,
                      width: `${(w / SIZE) * 100}%`,
                      height: `${(h / SIZE) * 100}%`,
                      backgroundColor:
                        RECTANGLE_COLOURS[rect.colourIndex % RECTANGLE_COLOURS.length],
                      border: `2px solid ${
                        rect.isValid
                          ? "rgba(22, 163, 74, 0.2)"
                          : "rgba(220, 38, 38, 0.2)"
                      }`,
                    }}
                  />
                );
              })}

              {/* Drag preview */}
              {dragRect && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${(dragRect.minC / SIZE) * 100}%`,
                    top: `${(dragRect.minR / SIZE) * 100}%`,
                    width: `${((dragRect.maxC - dragRect.minC + 1) / SIZE) * 100}%`,
                    height: `${((dragRect.maxR - dragRect.minR + 1) / SIZE) * 100}%`,
                    backgroundColor: "rgba(255, 0, 0, 0.15)",
                    border: "2px dashed rgba(255, 0, 0, 0.4)",
                  }}
                />
              )}

              {/* Grid cells */}
              <div
                className="absolute inset-0 grid grid-cols-6 grid-rows-6"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              >
                {Array.from({ length: SIZE }, (_, r) =>
                  Array.from({ length: SIZE }, (_, c) => (
                    <div
                      key={`${r}-${c}`}
                      className="flex items-center justify-center border border-black/10 bg-transparent touch-none"
                      onMouseDown={() => handleMouseDown(r, c)}
                    >
                      {puzzle[r]?.[c]?.number != null && (
                        <span className="font-obviously-narrow text-lg font-black text-red">
                          {puzzle[r]![c]!.number}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={rectangles.length === 0}
                  className="rounded-full border border-black/20 px-4 py-2 font-obviously text-xs font-medium text-black/60 transition-colors hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed"
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
