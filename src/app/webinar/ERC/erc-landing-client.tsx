"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { STRIPE_PAYMENT_URL } from "./constants";

const CTA = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <a
    href={STRIPE_PAYMENT_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={
      "inline-block rounded-lg bg-red px-6 py-4 text-center font-obviously text-lg font-semibold text-white no-underline transition hover:bg-dark-red focus:outline-none focus:ring-2 focus:ring-red focus:ring-offset-2 focus:ring-offset-[#0d0d0d] " +
      className
    }
  >
    {children}
  </a>
);

export function StripeBuyButton() {
  const BuyButton = "stripe-buy-button" as unknown as React.ElementType;
  return (
    <>
      <Script
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="lazyOnload"
      />
      <BuyButton
        buy-button-id="buy_btn_1TAzkaS32BzFhGHoMTDEamWa"
        publishable-key="pk_live_51Om1JLS32BzFhGHoc1xshj6RliKsJPKPu448jscHMkcIyM4N3DaVqoGDWVqhwJf9zIplNak4rLKqi1lmQiHZZio700daW6cPBD"
      />
    </>
  );
}

const FAQ_ITEMS = [
  {
    q: "Will this work for my industry?",
    a: "We've used this system for real estate agents, restaurants, e-commerce brands, coaches, consultants, SaaS founders, tradespeople, and personal brands. The ERC framework adapts to any niche because it's built on how the algorithm works, not on any specific type of content.",
  },
  {
    q: "What if I can't make it live?",
    a: "You'll get the full recording, all the slides, and the complete AI summary of everything covered, including Q&A answers. You won't miss anything.",
  },
  {
    q: "I'm not good on camera. Will this still work?",
    a: "Some of our highest-performing ERC series feature people who had never made a video before. One was filmed by a founder and his retired dad. Another was someone who didn't know how to edit. The system is designed to be simple enough that camera skills don't matter.",
  },
  {
    q: "Do I need a big following to start?",
    a: "No. Multiple case studies started from near zero. Spark Media App had no followers when they started. Harification started at 16 followers. The ERC system is specifically built to grow accounts from scratch.",
  },
  {
    q: "Is there a recording?",
    a: "Yes. Every attendee gets the full recording, slides, and a detailed summary sent after the event.",
  },
  {
    q: "How is this different from other social media courses?",
    a: "Most courses teach you to create more content across more platforms with more variety. We teach the opposite. Find one thing. Repeat it. 20 minutes a day. That's it. The results speak for themselves.",
  },
];

export function ErcLandingClient() {
  const [stickyVisible, setStickyVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const heroCta = document.getElementById("hero-cta");
    if (!heroCta) return;
    const observer = new IntersectionObserver(
      ([e]) => setStickyVisible(!e.isIntersecting),
      { threshold: 0, rootMargin: "-10px 0px 0px 0px" }
    );
    observer.observe(heroCta);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sticky mobile CTA bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0d0d0d] px-4 py-3 transition-transform duration-200 md:hidden ${
          stickyVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-obviously text-base font-semibold text-white">
            $79 NZD
          </span>
          <a
            href={STRIPE_PAYMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-red py-3 text-center font-obviously text-base font-semibold text-white no-underline transition hover:bg-dark-red"
          >
            Buy Now
          </a>
        </div>
      </div>

      {/* FAQ Accordion */}
      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-[600px] px-4">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="border-b border-white/10 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="group flex w-full items-center justify-between gap-4 py-4 text-left font-obviously text-base font-semibold text-white"
              >
                {item.q}
                <span
                  className={`text-2xl transition-all duration-200 group-hover:text-red ${
                    openFaq === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all ${
                  openFaq === i ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                <p className="pb-4 font-tiempos-text text-body-mobile text-white/90 md:text-body">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export { CTA };
