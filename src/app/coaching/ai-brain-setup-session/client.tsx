"use client";

import { useState } from "react";
import Image from "next/image";

// Images live in /public/images/AI Webinar Landing Page/
// Files confirmed present: stanley-hero.jpg, ai-layers-diagram.jpg, template-mockup.jpg
const IMG = (filename: string) =>
  `/images/AI Webinar Landing Page/${filename}`;

const STRIPE_URL =
  process.env.NEXT_PUBLIC_STRIPE_AI_BRAIN_SETUP_SESSION_URL || "#";

// ─── Shared CTA Button ────────────────────────────────────────────────────────

function BookButton({
  className = "",
  large = false,
}: {
  className?: string;
  large?: boolean;
}) {
  return (
    <a
      href={STRIPE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "inline-block rounded-button bg-red text-bone font-obviously-wide lowercase font-semibold",
        "transition-opacity hover:opacity-90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        large ? "px-10 py-5 text-xl md:text-2xl" : "px-5 py-3 text-sm md:text-base",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      Book Your Session{" "}
      <span className="whitespace-nowrap">— $897 NZD</span>
    </a>
  );
}

// ─── Sticky Nav ───────────────────────────────────────────────────────────────

function StickyNav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10"
      aria-label="Page navigation"
    >
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <Image
          src="/brand/logos/TAS-HighRes-_attn-seeker - Bone.png"
          alt="attn:seeker"
          width={120}
          height={30}
          className="object-contain"
          priority
        />
        <BookButton className="px-4 py-2 text-xs md:text-sm whitespace-nowrap" />
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative bg-black pt-16 min-h-[90vh] flex items-center overflow-hidden">
      {/* Full-bleed background photo */}
      <div className="absolute inset-0 z-0">
        {/* stanley-hero.jpg — full bleed background portrait of Stanley Henry */}
        <Image
          src={IMG("stanley-hero.jpg")}
          alt=""
          fill
          className="object-cover object-center"
          priority
          aria-hidden="true"
        />
        {/* Flat dark overlay — no gradient, left side heavier for text legibility */}
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="max-w-[600px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 mb-7">
            <div className="w-0.5 h-5 bg-red shrink-0" />
            <span className="font-georgia text-bone/60 text-sm uppercase tracking-widest">
              Done-With-You&nbsp;&nbsp;·&nbsp;&nbsp;The AI Brain Setup Session
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-obviously-wide lowercase text-bone leading-[1.0] mb-6"
            style={{ fontSize: "clamp(40px, 6.5vw, 72px)" }}
          >
            build your ai brain for you.
          </h1>

          {/* Subheading */}
          <p className="font-georgia text-bone text-xl md:text-[22px] leading-[1.6] mb-8">
            You know the framework. Now you need someone to build it with you.
            The AI Brain Setup Session is a hands-on, done-with-you service.
            Two calls, 30 days of support afterwards. You leave with a working
            AI operating system for your business.
          </p>

          {/* CTA */}
          <div className="mb-5">
            <BookButton large className="w-full md:w-auto" />
          </div>

          {/* Note */}
          <p className="font-georgia text-bone/50 text-sm leading-relaxed">
            Three spots available per month. Delivery by Stanley Henry or a
            senior team member.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Problem Section ──────────────────────────────────────────────────────────

function ProblemSection() {
  return (
    <section className="bg-bone py-20 md:py-28">
      <div className="max-w-[760px] mx-auto px-4 md:px-8">
        <h2
          className="font-obviously-wide lowercase text-black leading-[1.05] mb-12"
          style={{ fontSize: "clamp(28px, 4.5vw, 52px)" }}
        >
          you left the webinar knowing what to build. getting it done is a
          different thing.
        </h2>

        <div className="space-y-7 font-georgia text-black text-lg md:text-[20px] leading-[1.75]">
          <p>
            Most business owners who attend the webinar go home, open the
            templates, start filling in the company brief, and then get stuck.
            Not because the framework is complicated. Because building it alone,
            around a full schedule, takes longer than it should.
          </p>
          <p>
            The context files stay half-finished. The system never gets tested.
            Three weeks later the folder sits there and nothing has changed.
          </p>
          <p>
            The AI Brain Setup Session exists to solve exactly this problem.
          </p>
          <p className="font-semibold">
            We do it with you, on a call, so it actually gets done.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Process Section ──────────────────────────────────────────────────────────

const STEPS = [
  {
    n: 1,
    title: "The questionnaire",
    body: "Before your first call, you complete a 30-minute intake questionnaire. We use your answers to prepare everything so your first call is spent building, not briefing.",
  },
  {
    n: 2,
    title: "Call 1: we build it together (60-90 min)",
    body: "We review your questionnaire, then work through your AI operating system live. Layer 1 context files, your CLAUDE.md, your tone of voice document, your service descriptions. By the end of this call, you have a working foundation.",
  },
  {
    n: 3,
    title: "You use it (2 weeks)",
    body: "You go away and use the system. Ask it to write proposals, brief your team, plan content. Find the gaps. Find what needs refining. Keep a short list.",
  },
  {
    n: 4,
    title: "Call 2: we fix it (60 min)",
    body: "We review everything you found. Refine the files that are not working. Fill any gaps. Answer your questions. You leave with a system that is tuned to how you actually work.",
  },
  {
    n: 5,
    title: "30 days of email support",
    body: "After Call 2, you have 30 days to email us with anything. Questions, edge cases, things that are not quite right. We reply within one business day.",
  },
];

function ProcessSection() {
  return (
    <section className="bg-black py-20 md:py-28">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-[1fr_38%] gap-12 md:gap-16 items-start">
          {/* Steps */}
          <div>
            <h2
              className="font-obviously-wide lowercase text-bone leading-[1.05] mb-12"
              style={{ fontSize: "clamp(28px, 4.5vw, 52px)" }}
            >
              here is how it works.
            </h2>

            <div className="space-y-0">
              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className="flex gap-6 py-8 border-b border-bone/10 last:border-0"
                >
                  <div className="shrink-0 w-8 pt-1">
                    <span className="font-obviously-wide text-red text-lg leading-none">
                      {step.n}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-obviously-wide lowercase text-bone text-xl md:text-2xl mb-2 leading-tight">
                      {step.title}
                    </h3>
                    <p className="font-georgia text-bone/70 text-base md:text-lg leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagram — above steps on mobile, right column on desktop */}
          {/* ai-layers-diagram.jpg — visual of the 5-layer AI operating system */}
          <div className="md:sticky md:top-24 order-first md:order-last">
            <Image
              src={IMG("ai-layers-diagram.jpg")}
              alt="The 5-layer AI operating system diagram"
              width={800}
              height={800}
              className="w-full h-auto"
              style={{ borderRadius: 0 }}
              sizes="(max-width: 768px) 100vw, 38vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── What You Leave With ──────────────────────────────────────────────────────

const DELIVERABLES = [
  {
    n: "01",
    title: "A complete Layer 1 AI operating system",
    body: "Your company brief, services, team, tone of voice, target audience. All written, all loaded, all working.",
  },
  {
    n: "02",
    title: "A CLAUDE.md file built for your business",
    body: "The instruction layer that tells your AI everything it needs to know every time you open a session.",
  },
  {
    n: "03",
    title: "Layer 5 skill files for your top 3 tasks",
    body: "We write your three most-repeated tasks as skills during Call 1. Proposal writing, content briefs, meeting extraction - whatever you need most.",
  },
  {
    n: "04",
    title: "A tested, working system",
    body: "Not a template you have to fill in. A system we have built together, tested, and refined over two calls.",
  },
  {
    n: "05",
    title: "The full generic template pack",
    body: "The same template download from the webinar. All Layer 1 templates, prompts, and the 30-day roadmap.",
  },
  {
    n: "06",
    title: "30 days of email support",
    body: "A direct line to us for 30 days after your second call.",
  },
];

function WhatYouLeaveWith() {
  return (
    <section className="bg-bone py-20 md:py-28">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-[40%_1fr] gap-10 md:gap-16 items-start">
          {/* Image — left on desktop, below content on mobile */}
          {/* template-mockup.jpg — mockup of the template pack */}
          <div className="md:sticky md:top-24 order-last md:order-first">
            <Image
              src={IMG("template-mockup.jpg")}
              alt="The full template pack — Layer 1 context templates, prompts, and 30-day roadmap"
              width={880}
              height={660}
              className="w-full h-auto"
              style={{ borderRadius: 0 }}
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>

          {/* Content */}
          <div>
            <h2
              className="font-obviously-wide lowercase text-black leading-[1.05] mb-10"
              style={{ fontSize: "clamp(28px, 4.5vw, 52px)" }}
            >
              what you leave with.
            </h2>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {DELIVERABLES.map((item) => (
                <div key={item.n}>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="font-obviously-wide text-red text-sm leading-none pt-1 shrink-0">
                      {item.n}
                    </span>
                    <h3 className="font-obviously-wide lowercase text-black text-base md:text-[17px] leading-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="font-georgia text-black/70 text-sm md:text-[15px] leading-relaxed pl-8">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Who This Is For ──────────────────────────────────────────────────────────

const WHO_FOR = [
  "You attended the webinar and know the framework but have not built it yet",
  "You want it done right the first time, not figured out solo over three months",
  "You are running a service business and you are still the bottleneck",
  "You have tried AI tools before and got generic outputs that sound nothing like you",
  "You value your time more than the $897 investment",
  "You want accountability - someone to build alongside you, not just teach you",
];

function WhoThisIsFor() {
  return (
    <section className="bg-black py-20 md:py-28">
      <div className="max-w-[860px] mx-auto px-4 md:px-8">
        <h2
          className="font-obviously-wide lowercase text-bone leading-[1.05] mb-12"
          style={{ fontSize: "clamp(28px, 4.5vw, 52px)" }}
        >
          this is right for you if...
        </h2>

        <ul className="space-y-5 mb-14" role="list">
          {WHO_FOR.map((item, i) => (
            <li key={i} className="flex gap-5 items-start">
              <span
                className="text-red text-xl shrink-0 leading-none mt-1"
                aria-hidden="true"
              >
                ✓
              </span>
              <span className="font-georgia text-bone text-lg md:text-xl leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <p className="font-georgia text-bone text-xl md:text-2xl text-center leading-relaxed">
          If that is you, book a spot. Three per month. First available goes
          first.
        </p>
      </div>
    </section>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "Do I need to attend the webinar first?",
    a: "No. If you already understand the concept and want someone to build it with you, you can book directly. The intake questionnaire covers everything we need to know before your first call.",
  },
  {
    q: "Who delivers the session - is it always Stanley?",
    a: "Early sessions are delivered by Stanley Henry. As the programme scales, delivery moves to trained senior team members. All delivery follows the same framework.",
  },
  {
    q: "How long between Call 1 and Call 2?",
    a: "We recommend two to three weeks. You need time to use the system and find the gaps before Call 2 is worth having.",
  },
  {
    q: "What if I am not technical?",
    a: "There is no technical requirement. If you can type in a document, you can build this. The questionnaire is written, Call 1 is a conversation plus screen share, and we do the file building with you.",
  },
  {
    q: "Can I do this for my team as well as myself?",
    a: "The session builds one AI operating system per business. If you want to extend it to a team setup, ask about this on your first call and we can scope it.",
  },
  {
    q: "What happens after the 30 days?",
    a: "If you want ongoing support, coaching, and monthly implementation, the next step is the cohort. It is $2,990 per month. Session clients get priority access.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-black py-20 md:py-28">
      <div className="max-w-[800px] mx-auto px-4 md:px-8">
        <h2
          className="font-obviously-wide lowercase text-bone leading-[1.05] mb-12"
          style={{ fontSize: "clamp(28px, 4.5vw, 52px)" }}
        >
          common questions.
        </h2>

        <div className="divide-y divide-bone/10" role="list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} role="listitem">
              <button
                className="w-full flex justify-between items-start gap-6 py-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="font-obviously-wide lowercase text-bone text-lg md:text-xl leading-snug">
                  {item.q}
                </span>
                <span
                  className="text-red text-2xl shrink-0 mt-0.5 transition-transform duration-200 ease-out select-none"
                  style={{
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              <div
                id={`faq-answer-${i}`}
                className={`overflow-hidden transition-all duration-200 ease-out ${
                  open === i ? "max-h-96 pb-6" : "max-h-0"
                }`}
              >
                <p className="font-georgia text-bone/70 text-base md:text-lg leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTASection() {
  return (
    <section className="bg-black py-24 md:py-36">
      <div className="max-w-[680px] mx-auto px-4 md:px-8 text-center">
        <h2
          className="font-obviously-wide lowercase text-bone leading-[1.0] mb-6"
          style={{ fontSize: "clamp(36px, 6vw, 72px)" }}
        >
          book your spot.
        </h2>

        <p className="font-georgia text-bone text-xl md:text-2xl leading-relaxed mb-10">
          Three sessions available per month. Once they are gone, the next
          availability is the following month.
        </p>

        <BookButton large className="w-full md:w-auto mb-8" />

        <p className="font-georgia text-bone/40 text-sm leading-loose">
          Includes two calls, full template pack, and 30 days of email support.
          <br />
          Delivered by Stanley Henry or a senior attn:seeker team member.
        </p>
      </div>
    </section>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export function AiBrainSetupLanding() {
  return (
    <main>
      <StickyNav />
      <HeroSection />
      <ProblemSection />
      <ProcessSection />
      <WhatYouLeaveWith />
      <WhoThisIsFor />
      <FAQSection />
      <FinalCTASection />
    </main>
  );
}
