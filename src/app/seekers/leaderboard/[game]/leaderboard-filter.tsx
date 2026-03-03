"use client";

import { useState } from "react";

const TIME_FILTERS = ["today", "this week", "all time"];

export default function LeaderboardFilter() {
  const [active, setActive] = useState("today");

  return (
    <div className="flex gap-2">
      {TIME_FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => setActive(filter)}
          className={`rounded-full px-4 py-1.5 font-obviously text-xs font-medium transition-colors ${
            active === filter
              ? "bg-black text-bone"
              : "border border-black/20 text-black/60 hover:border-black/40"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
