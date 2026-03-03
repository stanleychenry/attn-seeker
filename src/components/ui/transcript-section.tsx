"use client";

import { useState } from "react";

export function TranscriptSection({ transcript }: { transcript: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-bone/10 pt-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-obviously text-sm font-medium text-bone transition-colors hover:text-red"
      >
        <span>transcript</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-4 whitespace-pre-wrap font-obviously text-sm leading-relaxed text-bone/80">
          {transcript}
        </div>
      )}
    </div>
  );
}
