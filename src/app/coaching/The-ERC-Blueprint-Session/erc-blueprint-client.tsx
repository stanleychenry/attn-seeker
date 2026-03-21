"use client";

import { useState } from "react";
import { STRIPE_ERC_BLUEPRINT_URL } from "./constants";

const CTA_LABEL = "reserve my blueprint session | $697 NZD";
const CTA_MICRO = "60-minute 1-on-1 session. Pre-call research included. Satisfaction guaranteed.";

export function CTA({
  className = "",
  fullWidthMobile = true,
  label,
  showMicro = true,
}: {
  className?: string;
  fullWidthMobile?: boolean;
  /** Override button text (e.g. "Learn the System Behind These Results") */
  label?: React.ReactNode;
  /** Show microcopy under button */
  showMicro?: boolean;
}) {
  return (
    <div className={className}>
      <a
        href={STRIPE_ERC_BLUEPRINT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={
          "inline-block rounded-lg bg-red px-8 py-4 text-center font-obviously text-lg font-semibold text-white no-underline transition hover:bg-dark-red hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red focus:ring-offset-2 " +
          (fullWidthMobile ? "w-full md:w-auto" : "")
        }
      >
        {label ?? CTA_LABEL}
      </a>
      {showMicro && (
        <p className="mt-3 font-tiempos-text text-sm text-white/70 md:text-base">
          {CTA_MICRO}
        </p>
      )}
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "Who runs the session?",
    a: "Either Stanley Henry (founder of The Attention Seeker) or a senior content strategist from our team. Every session is led by someone with deep experience building content systems for businesses across dozens of industries.",
  },
  {
    q: "I attended the webinar but I'm not sure I remember everything. Is that okay?",
    a: "Absolutely. The session is designed to work whether you took detailed notes or just absorbed the big ideas. We guide the entire process and handle all the strategic thinking. You just need to bring your knowledge of your own business.",
  },
  {
    q: "What if I already have some content ideas but I'm not sure if they're right?",
    a: "Bring them. Part of the session is pressure-testing ideas against the ERC framework. We'll either validate what you've got or redirect you toward something stronger. Nothing is wasted.",
  },
  {
    q: "How soon after the webinar should I book?",
    a: "Ideally within a week while the framework is fresh. But we've worked with people weeks later and the session is just as effective because the questionnaire and pre-call research bring everything back into focus.",
  },
  {
    q: "What happens if I need to reschedule?",
    a: "Life happens. You can reschedule once with at least 24 hours' notice. We'll work with you to find a new time that works.",
  },
  {
    q: "Is this a sales call in disguise?",
    a: "No. This is a working session. You'll spend 60 minutes building your content series, not listening to a pitch. At the end, if it makes sense, we'll mention how we can help with ongoing production, but there's zero pressure and the session delivers full value regardless.",
  },
  {
    q: "Can I send a team member instead of attending myself?",
    a: "Yes, as long as they have decision-making authority on your content direction and can speak to your audience, expertise, and business goals. The session works best with someone who deeply knows the business.",
  },
];

export function ErcBlueprintFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[800px] px-4">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className={`border-b border-black/10 last:border-b-0 ${
              openIndex === i ? "border-l-4 border-l-red pl-4 -ml-4 md:pl-6 md:-ml-6" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className={`flex w-full items-center justify-between gap-4 py-4 text-left font-obviously text-lg font-semibold transition-colors ${
                openIndex === i ? "text-red" : "text-black"
              }`}
            >
              {item.q}
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center text-xl transition-transform duration-200 ${
                  openIndex === i ? "rotate-45 text-red" : "text-black/70"
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === i ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <p className="pb-4 font-tiempos-text text-base text-black/85 md:text-lg leading-relaxed">
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
