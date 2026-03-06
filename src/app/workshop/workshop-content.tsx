"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState, useMemo } from "react";

const STRIPE_URL = "https://buy.stripe.com/dRm3cxarxbOM5vd3lT1ck0e";

const CLIENT_LOGOS = [
  "Client Logos-1.png", "Client Logos-2.png", "Client Logos-3.png", "Client Logos-4.png",
  "Client Logos-5.png", "Client Logos-6.png", "Client Logos-7.png", "Client Logos-8.png",
  "Client Logos-9.png", "Client Logos-10.png", "Client Logos-11.png", "Client Logos-12.png",
  "Client Logos-13.png", "Client Logos-14.png", "Client Logos-15.png", "Client Logos-16.png",
  "Client Logos-17.png", "Client Logos-18.png", "Client Logos-19.png", "Client Logos-20.png",
  "Client Logos-21.png", "Client Logos-22.png", "Client Logos-23.png", "Client Logos-24.png",
  "Client Logos-25.png", "Client Logos-26.png", "Client Logos-27.png", "Client Logos-28.png",
  "Client Logos-29.png", "Client Logos-31.png", "Client Logos-32.png", "Client Logos-33.png",
  "Client Logos-34.png", "Client Logos-35.png", "Client Logos-36.png", "Client Logos-37.png",
  "Client Logos-38.png", "Client Logos-39.png", "Client Logos-40.png", "Client Logos-41.png",
  "Client Logos-42.png", "Client Logos-43.png", "Client Logos-44.png", "Client Logos-46.png",
  "Client Logos-47.png", "Client Logos-48.png", "Client Logos-49.png", "Client Logos-50.png",
  "Client Logos-52.png", "Client Logos-57.png", "Client Logos-58.png", "Client Logos-60.png",
  "Client Logos-63.png", "Client Logos-64.png", "Client Logos-65.png",
];

function CtaButton({
  href,
  children,
  style = "primary",
}: {
  href: string;
  children: React.ReactNode;
  style?: "primary" | "ghost";
}) {
  const base =
    "inline-block rounded-button px-8 py-4 font-obviously text-base font-medium lowercase transition-colors";
  const primary =
    "bg-red text-bone hover:bg-dark-red";
  const ghost =
    "border border-red text-red hover:bg-red hover:text-bone";
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${style === "primary" ? primary : ghost}`}
    >
      {children}
    </Link>
  );
}

const LOGO_ITEM_WIDTH = 210;
const LOGO_GAP = 80;
const LOGO_HALF_OFFSET = (CLIENT_LOGOS.length * (LOGO_ITEM_WIDTH + LOGO_GAP)) / 2;

function ClientLogoBanner() {
  const duplicated = useMemo(() => [...CLIENT_LOGOS, ...CLIENT_LOGOS], []);
  return (
    <section className="w-full bg-bone py-16">
      <div className="mx-auto max-w-standard px-6 text-center">
        <p className="font-obviously text-sm font-medium lowercase tracking-wide text-red md:text-base">
          our clients
        </p>
        <h2 className="mt-2 font-obviously-wide text-h2-mobile font-semibold lowercase text-black md:text-h2">
          brands we&apos;ve worked with
        </h2>
      </div>
      <div
        className="relative mt-12 flex min-h-[180px] w-full items-center overflow-hidden px-2"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <motion.div
          className="flex gap-20"
          style={{ width: "max-content" }}
          animate={{ x: [0, -LOGO_HALF_OFFSET] }}
          transition={{
            x: { repeat: Infinity, duration: 50, ease: "linear" },
          }}
        >
          {duplicated.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex shrink-0 items-center justify-center"
              style={{ width: LOGO_ITEM_WIDTH }}
            >
              <div className="relative flex h-[84px] w-36 items-center justify-center">
                <Image
                  src={`/Client Logos/${name}`}
                  alt=""
                  width={144}
                  height={84}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="mt-10 text-center">
        <CtaButton href={STRIPE_URL}>book your team&apos;s session</CtaButton>
      </div>
    </section>
  );
}

function FAQAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-bone/20">
      {items.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-start justify-between gap-4 py-6 text-left"
          >
            <span className="font-obviously-wide text-h4-mobile font-semibold lowercase text-bone md:text-h4">
              {item.question}
            </span>
            <span
              className={`shrink-0 transition-colors ${open === i ? "text-red" : "text-bone"}`}
            >
              {open === i ? (
                <Minus className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Plus className="h-5 w-5" strokeWidth={2} />
              )}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="pb-6 font-tiempos-text text-body-mobile text-bone md:text-body">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function WorkshopContent() {
  const faqItems = [
    {
      question: "How many team members can attend?",
      answer:
        "The session is designed for teams of 3 to 15 people. Larger teams can be accommodated with a custom quote.",
    },
    {
      question: "Where does the session take place?",
      answer:
        "We come to you. The session runs at your office or a location of your choice. We can also run it at our studio in Auckland if preferred.",
    },
    {
      question: "What do we need to prepare beforehand?",
      answer:
        "Not much. We run a short discovery session before the day to understand your brand, your team's current workflow, and what challenges you're facing. That's what lets us tailor the day to your specific situation.",
    },
    {
      question: "What if we've done content training before and it didn't stick?",
      answer:
        "That's exactly why this exists. Most content training is all theory and no system. Your team leaves this session with an actual built framework they can start using immediately, not just a slide deck of inspiration.",
    },
    {
      question: "Can this be run virtually?",
      answer:
        "We strongly recommend in-person for the hands-on build component. Virtual delivery is possible but works best as a follow-up or supplementary session.",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative min-h-[80vh] w-full px-6 pb-24 pt-16 md:min-h-[85vh] md:pb-24 md:pt-32">
        <Image
          src="/Workshop - Landing Page/hero-bg.JPG"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-black/60"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-[60vh] max-w-standard flex-col justify-center md:min-h-[70vh]">
          <p className="font-obviously text-sm font-medium lowercase tracking-wide text-red md:text-base">
            attn:seeker social content workshop
          </p>
          <h1 className="mt-4 font-obviously-wide text-h1-mobile font-bold lowercase leading-none tracking-tight text-bone md:text-h1">
            your team doesn&apos;t need more content ideas.
            <br />
            they need a system.
          </h1>
          <p className="mt-6 max-w-standard font-tiempos-text text-body-lg-mobile text-bone md:text-body-lg">
            A one-day workshop that gives your internal marketing team an easily
            repeatable content system they can implement the moment they walk
            out the door.
          </p>
          <div className="mt-10">
            <CtaButton href={STRIPE_URL}>book your team&apos;s session</CtaButton>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-black px-6 py-16 md:py-24">
        <div className="mx-auto max-w-content">
          <h2 className="font-obviously-wide text-h2-mobile font-semibold lowercase text-bone md:text-h2">
            the problem
          </h2>
          <div className="mt-6 space-y-4 font-tiempos-text text-body-mobile text-bone md:text-body">
            <p>
              Your team is producing content every week. But it feels like
              starting from scratch every time.
            </p>
            <p>
              There&apos;s no repeatable framework. No system for turning one
              idea into ten pieces. No clear connection between what you&apos;re
              posting organically and what you&apos;re spending money to boost.
              Every brief is a blank page. Every month is a scramble.
            </p>
            <p>
              You&apos;ve probably tried a training day before. Someone flew in,
              talked for six hours about &quot;storytelling&quot; and
              &quot;authenticity,&quot; and your team went back to doing exactly
              what they were doing before. Because inspiration without a system
              changes nothing.
            </p>
          </div>
          <div className="mt-10">
            <CtaButton href={STRIPE_URL}>book your team&apos;s session</CtaButton>
          </div>
        </div>
      </section>

      {/* What makes this different */}
      <section className="bg-black px-6 py-16 md:py-24">
        <div className="mx-auto max-w-standard">
          <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
            <div>
              <p className="font-obviously text-sm font-medium lowercase tracking-wide text-red md:text-base">
                what makes this different
              </p>
              <h2 className="mt-4 font-obviously-wide text-h2-mobile font-semibold lowercase text-bone md:text-h2">
                this isn&apos;t a talk. it&apos;s a build day.
              </h2>
              <div className="mt-6 space-y-4 font-tiempos-text text-body-mobile text-bone md:text-body">
                <p>
                  Your team won&apos;t just learn theory. They&apos;ll leave
                  with a fully built Easily Repeatable Content (ERC) system,
                  tailored to your brand, that turns content creation from a
                  guessing game into a repeatable machine.
                </p>
                <p>
                  We&apos;ll work with your team to uncover the human truth at
                  the core of your brand, then build content systems and series
                  around it that your team can produce week after week without
                  burning out or running dry.
                </p>
                <p>
                  The difference between this and every other &quot;content
                  workshop&quot; is what exists at the end of the day: not just
                  notes and good vibes, but a working system ready to execute.
                </p>
              </div>
              <div className="mt-10">
                <CtaButton href={STRIPE_URL}>book your team&apos;s session</CtaButton>
              </div>
            </div>
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-none">
              <Image
                src="/Workshop - Landing Page/workshop-action.jpg"
                alt="Candid shot of a real workshop session"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What your team walks away with */}
      <section className="bg-black px-6 py-16 md:py-24">
        <div className="mx-auto max-w-standard">
          <p className="font-obviously text-sm font-medium lowercase tracking-wide text-red md:text-base">
            the deliverables
          </p>
          <h2 className="mt-4 font-obviously-wide text-h2-mobile font-semibold lowercase text-bone md:text-h2">
            what your team walks away with
          </h2>
          <div className="mt-10 grid gap-0 border border-bone/20 md:grid-cols-2">
            {[
              "An Easily Repeatable Content (ERC) system built around your brand's human truth",
              "A clear framework for using organic content as a testing ground before spending on paid",
              "The storytelling structure behind content that actually gets shared, not just posted",
              "A method for adapting high-performing organic content into paid assets",
              "A sustainable workflow that stops content feeling like a weekly scramble",
              "A strategic lens for how to think about content, not just how to make it",
            ].map((text, i) => (
              <div
                key={i}
                className={`flex gap-4 border-b border-r border-bone/20 p-6 md:odd:border-r md:even:border-r-0 ${i >= 4 ? "md:border-b-0" : ""}`}
              >
                <div className="h-1 w-8 shrink-0 bg-red" aria-hidden />
                <p className="font-tiempos-text text-body-mobile text-bone md:text-body">
                  {text}
                </p>
              </div>
            ))}
          </div>
          <div className="relative mt-12 aspect-[3/2] w-full overflow-hidden rounded-none">
            <Image
              src="/Workshop - Landing Page/erc-deliverable.png"
              alt="ERC framework deliverable kit"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>
          <div className="mt-10 text-center">
            <CtaButton href={STRIPE_URL}>book your team&apos;s session</CtaButton>
          </div>
        </div>
      </section>

      {/* The day */}
      <section className="bg-black px-6 py-16 md:py-24">
        <div className="mx-auto max-w-standard">
          <p className="font-obviously text-sm font-medium lowercase tracking-wide text-red md:text-base">
            the agenda
          </p>
          <h2 className="mt-4 font-obviously-wide text-h2-mobile font-semibold lowercase text-bone md:text-h2">
            the day
          </h2>
          <div className="mt-10 divide-y divide-bone/20">
            <div className="py-8 first:pt-0">
              <p className="font-obviously-wide text-h3-mobile font-semibold lowercase text-bone md:text-h3">
                part 1: foundational theory (4 hours)
              </p>
              <p className="mt-4 font-tiempos-text text-body-mobile text-bone md:text-body">
                We start by getting your whole team onto the same page. This
                covers our framework for organic content and how it feeds into
                paid strategy, how to identify your brand&apos;s core human
                truth, the principles of storytelling using proper narrative
                structure, and how to think in content systems and series rather
                than one-off posts.
              </p>
            </div>
            <div className="py-8">
              <p className="font-obviously-wide text-h3-mobile font-semibold lowercase text-bone md:text-h3">
                part 2: practical application (4 hours)
              </p>
              <p className="mt-4 font-tiempos-text text-body-mobile text-bone md:text-body">
                Then we build. Your team gets hands-on, applying the theory to
                create real content. We work through adapting content across
                platforms and objectives, from organic to paid, from awareness
                to conversion. We finish by locking in the ongoing system and
                workflow so the work doesn&apos;t stop when we leave.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <CtaButton href={STRIPE_URL}>book your team&apos;s session</CtaButton>
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="bg-black px-6 py-16 md:py-24">
        <div className="mx-auto max-w-standard">
          <p className="font-obviously text-sm font-medium lowercase tracking-wide text-red md:text-base">
            is this right for you
          </p>
          <h2 className="mt-4 font-obviously-wide text-h2-mobile font-semibold lowercase text-bone md:text-h2">
            who this is for
          </h2>
          <p className="mt-6 font-tiempos-text text-body-mobile text-bone md:text-body">
            This session is built for internal marketing teams of 3 to 15
            people who are already producing content but know they could be
            doing it smarter. It&apos;s ideal if:
          </p>
          <ul className="mt-6 space-y-4">
            {[
              "Your team is stuck in a cycle of one-off content with no repeatable system",
              "You're spending on paid but not using organic as a testing ground first",
              "You've invested in \"content training\" before and nothing stuck",
              "You want your team thinking strategically about content, not just executing briefs",
            ].map((text, i) => (
              <li key={i} className="flex gap-4">
                <div className="h-1 w-8 shrink-0 bg-red" aria-hidden />
                <span className="font-tiempos-text text-body-mobile text-bone md:text-body">
                  {text}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <CtaButton href={STRIPE_URL}>book your team&apos;s session</CtaButton>
          </div>
        </div>
      </section>

      {/* Client logo banner */}
      <ClientLogoBanner />

      {/* Facilitator */}
      <section className="bg-black px-6 py-16 md:py-24">
        <div className="mx-auto max-w-standard">
          <div className="grid gap-12 md:grid-cols-[2fr_3fr] md:gap-16">
            <div className="w-full overflow-hidden rounded-none">
              <Image
                src="/Workshop - Landing Page/stanley-headshot.png"
                alt="Stanley Henry"
                width={800}
                height={800}
                className="w-full max-w-md object-contain object-top"
                sizes="(max-width: 768px) 100vw, 360px"
              />
            </div>
            <div>
              <p className="font-obviously text-sm font-medium lowercase tracking-wide text-red md:text-base">
                your facilitator
              </p>
              <h2 className="mt-4 font-obviously-wide text-h2-mobile font-semibold lowercase text-bone md:text-h2">
                stanley henry
              </h2>
              <p className="mt-6 font-tiempos-text text-body-mobile text-bone md:text-body">
                Stanley Henry is the founder and CEO of attn:seeker, one of New
                Zealand&apos;s leading organic social media agencies. Over seven
                years, his team has built content systems for brands including
                One NZ, Pizza Hut NZ, and AA Insurance, treating social content
                like television shows with recurring characters and narrative
                arcs. He runs the Your Attn Please newsletter, read by
                thousands of marketers across New Zealand and beyond.
              </p>
              <div className="mt-10">
                <CtaButton href={STRIPE_URL}>book your team&apos;s session</CtaButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-black px-6 py-16 md:py-24">
        <div className="mx-auto max-w-narrow text-center">
          <p className="font-obviously text-sm font-medium lowercase tracking-wide text-red md:text-base">
            investment
          </p>
          <p className="mt-4 font-obviously-narrow text-stat-mobile font-black text-red md:text-stat">
            $9,000
            <span className="ml-1 font-obviously text-2xl font-medium text-bone/70">
              + GST
            </span>
          </p>
          <p className="mt-6 font-tiempos-text text-body text-bone">
            To put that in context: a single month of agency retainer for
            organic content management typically runs $8,000 to $15,000. This
            workshop gives your team the system to do it themselves, permanently.
          </p>
          <div className="mx-auto mt-10 max-w-md divide-y divide-bone/20 rounded-card border border-bone/20 bg-white text-left">
            {[
              "Full-day facilitated workshop (8 hours)",
              "Custom ERC system built around your brand",
              "Pre-session discovery to tailor the day to your team's challenges",
              "All workshop materials and frameworks",
              "30-day post-session support for implementation questions",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 px-6 py-4">
                {text.includes("30-day") && (
                  <span className="shrink-0">
                    <Image
                      src="/Workshop - Landing Page/support-badge.png"
                      alt=""
                      width={28}
                      height={28}
                    />
                  </span>
                )}
                <span className="font-tiempos-text text-body-sm text-black">
                  {text}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <CtaButton href={STRIPE_URL}>book your team&apos;s session</CtaButton>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-black px-6 py-16 md:py-24">
        <div className="mx-auto max-w-content">
          <p className="font-obviously text-sm font-medium lowercase tracking-wide text-red md:text-base">
            questions
          </p>
          <h2 className="mt-4 font-obviously-wide text-h2-mobile font-semibold lowercase text-bone md:text-h2">
            faq
          </h2>
          <div className="mt-10">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black px-6 py-16 md:py-24">
        <div className="mx-auto max-w-narrow text-center">
          <h2 className="font-obviously-wide text-h2-mobile font-bold lowercase text-bone md:text-[48px]">
            stop starting from scratch every week.
          </h2>
          <p className="mt-6 font-tiempos-text text-body-lg-mobile text-bone md:text-body-lg">
            Your team already knows how to make content. Give them the system to
            make it count.
          </p>
          <div className="mt-10">
            <CtaButton href={STRIPE_URL}>book your team&apos;s session</CtaButton>
          </div>
        </div>
      </section>
    </div>
  );
}
