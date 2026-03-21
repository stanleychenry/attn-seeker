"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const STRIPE_URL =
  process.env.NEXT_PUBLIC_STRIPE_AI_WEBINAR_URL ||
  "https://buy.stripe.com/3cIdRbeHN8CAg9RcWt1ck0h";

const IMG = (filename: string) =>
  `/images/AI Webinar Landing Page/${filename}`;

// ─── Shared CTA Button ────────────────────────────────────────────────────────

function RegisterButton({
  className = "",
  large = false,
  label = "Register Now — $149 NZD",
}: {
  className?: string;
  large?: boolean;
  label?: string;
}) {
  return (
    <a
      href={STRIPE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-block rounded-button bg-red text-bone font-obviously-wide lowercase font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        large ? "px-10 py-5 text-xl md:text-2xl" : "px-6 py-4 text-base md:text-lg",
        className
      )}
    >
      {label}
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
        <RegisterButton
          label="Register — $149 NZD"
          className="px-4 py-2 text-sm whitespace-nowrap"
        />
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
        <Image
          src={IMG("stanley-hero.jpg")}
          alt=""
          fill
          className="object-cover object-center"
          priority
          aria-hidden="true"
        />
        {/* Left-to-right gradient: opaque on left where text is, clear on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30" />
        {/* Top-to-bottom gradient: darker at top so headline pops */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="max-w-[600px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 mb-7">
            <div className="w-0.5 h-5 bg-red rounded-full" />
            <span className="font-tiempos-text text-bone/60 text-sm uppercase tracking-widest">
              Live Workshop&nbsp;&nbsp;·&nbsp;&nbsp;Tuesday 31 March 2026
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-obviously-wide lowercase text-bone leading-[1.0] mb-6"
            style={{ fontSize: "clamp(40px, 6.5vw, 82px)" }}
          >
            build your ai brain.
          </h1>

          {/* Subheading */}
          <p className="font-tiempos-text text-bone text-xl md:text-[22px] leading-[1.6] mb-6">
            A live 2-hour workshop with Stanley Henry. Learn the exact 5-layer
            AI system I built to run my business. Leave with your foundation
            set up.
          </p>

          {/* Timezones */}
          <p className="font-tiempos-text text-bone/50 text-sm md:text-[15px] mb-9">
            11am New Zealand&nbsp;&nbsp;·&nbsp;&nbsp;9am
            Sydney&nbsp;&nbsp;·&nbsp;&nbsp;6pm New
            York&nbsp;&nbsp;·&nbsp;&nbsp;3pm Los Angeles
          </p>

          {/* CTA */}
          <div className="mb-5">
            <RegisterButton large className="w-full md:w-auto" />
          </div>

          {/* Note */}
          <p className="font-tiempos-text text-bone/50 text-sm leading-relaxed">
            Every attendee gets the full template download included. The folder
            structure, all context templates, and the prompts to fill them in.
            Yours just for showing up.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Value Stack ──────────────────────────────────────────────────────────────

const VALUE_ITEMS = [
  {
    n: "01",
    title: "2 hours live with Stanley Henry",
    body: "You are not watching a recording. Stanley is live, taking questions, building alongside you.",
  },
  {
    n: "02",
    title: "The complete 5-layer framework",
    body: "Taught from first principles. You will understand why each layer exists before you build it.",
  },
  {
    n: "03",
    title: "Live build — your foundation, not just a demo",
    body: "You will set up your workspace and write your first context file during the session. Not watching. Doing.",
  },
  {
    n: "04",
    title: "The full generic template pack",
    body: "The folder structure, all Layer 1 context templates, and the prompts to fill them in. Sent to every attendee. Yours even if you watch the recording later.",
  },
  {
    n: "05",
    title: "Your 30-day roadmap",
    body: "A clear plan for what to build in week one, week two, and weeks three and four. So you keep momentum after the session.",
  },
  {
    n: "06",
    title: "The recording",
    body: "Sent to all attendees after the session. Rewatch any section. Share with a business partner.",
  },
];

function ValueStackSection() {
  return (
    <section className="bg-bone py-20 md:py-28">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        <h2
          className="font-obviously-wide lowercase text-black leading-[1.05] mb-5"
          style={{ fontSize: "clamp(30px, 5vw, 60px)" }}
        >
          here is what $149 gets you.
        </h2>
        <p className="font-tiempos-text text-black/70 text-lg md:text-xl leading-relaxed mb-14 max-w-[640px]">
          This is not a webinar where you sit and take notes. You will be
          building alongside Stanley, live.
        </p>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {VALUE_ITEMS.map((item) => (
            <div key={item.n} className="flex gap-6">
              <div className="font-obviously-wide text-red text-lg leading-none pt-1 w-8 shrink-0">
                {item.n}
              </div>
              <div>
                <h3 className="font-obviously-wide lowercase text-black text-xl md:text-2xl mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="font-tiempos-text text-black/70 text-base md:text-lg leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Template mockup visual */}
        <div className="mt-16 border border-black/10">
          <Image
            src={IMG("template-mockup.jpg")}
            alt="The full template download — folder structure, context templates, and prompts"
            width={1600}
            height={900}
            style={{ width: "100%", height: "auto" }}
            sizes="(max-width: 768px) 100vw, 1100px"
          />
          <div className="px-6 py-4 bg-black/5">
            <p className="font-tiempos-text text-black/60 text-sm text-center">
              The complete template pack — included with every registration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────

function ProblemSection() {
  return (
    <section className="bg-black py-20 md:py-28">
      <div className="max-w-[760px] mx-auto px-4 md:px-8">
        <h2
          className="font-obviously-wide lowercase text-bone leading-[1.05] mb-12"
          style={{ fontSize: "clamp(30px, 5vw, 56px)" }}
        >
          you&apos;re using ai like a search engine.
        </h2>
        <div className="space-y-7 font-tiempos-text text-bone text-lg md:text-[20px] leading-[1.75]">
          <p>
            Open ChatGPT or Claude. Type a question with no context about your
            business. Get a generic answer. Rewrite it manually. Repeat
            tomorrow.
          </p>
          <p>
            Every session starts from zero. The AI never learns your tone, your
            clients, your services, or how you make decisions.
          </p>
          <p>
            That is not an AI problem. That is a context problem. And it is
            completely fixable.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Solution ─────────────────────────────────────────────────────────────────

function SolutionSection() {
  return (
    <section className="bg-black border-t border-bone/10 py-20 md:py-28">
      <div className="max-w-[760px] mx-auto px-4 md:px-8">
        <h2
          className="font-obviously-wide lowercase text-bone leading-[1.05] mb-12"
          style={{ fontSize: "clamp(30px, 5vw, 56px)" }}
        >
          when ai knows your business, everything changes.
        </h2>
        <div className="space-y-7 font-tiempos-text text-bone text-lg md:text-[20px] leading-[1.75]">
          <p>
            I built a layered context system for my business. Five layers of
            files that give my AI everything it needs to know about how I
            operate.
          </p>
          <p>
            My tone of voice. My services. My clients. My team. My history. My
            decision-making patterns.
          </p>
          <p>
            Now I write proposals in 4 minutes. Plan campaigns in 8. Brief my
            team with a single prompt.
          </p>
          <p>The AI does not replace my thinking. It executes it.</p>
          <p>On 31 March I am teaching you exactly how to build this.</p>
        </div>
      </div>
    </section>
  );
}

// ─── Framework ────────────────────────────────────────────────────────────────

const LAYERS = [
  {
    n: "1",
    title: "Context",
    body: "Everything your AI needs to know about your business. Your company brief, services, team, tone of voice, and target audience. This is the foundation. Nothing else works without it.",
  },
  {
    n: "2",
    title: "Data",
    body: "Your history. Clients, past meetings, financials, performance records. This layer makes your AI progressively smarter over time.",
  },
  {
    n: "3",
    title: "Intelligence",
    body: "The systems that turn raw data into insight. Daily briefs. Trend analysis. Pattern recognition. This layer produces decisions.",
  },
  {
    n: "4",
    title: "Automation",
    body: "The workflows that run without you. Email sequences. Content approvals. Lead routing. This is where you stop being the bottleneck.",
  },
  {
    n: "5",
    title: "Skills",
    body: "Your repeatable prompts. Caption writing. Proposal drafting. Meeting notes. Performance reports. Your AI's job descriptions.",
  },
];

function FrameworkSection() {
  return (
    <section className="bg-black border-t border-bone/10 py-20 md:py-28">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left: Layers */}
          <div>
            {/* Section header with icon */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-8 h-8 rounded-none overflow-hidden shrink-0">
                <Image
                  src={IMG("five-layers-icon.jpg")}
                  alt=""
                  fill
                  className="object-cover"
                  aria-hidden="true"
                />
              </div>
              <h2
                className="font-obviously-wide lowercase text-bone leading-[1.05]"
                style={{ fontSize: "clamp(28px, 4.5vw, 52px)" }}
              >
                the 5-layer system.
              </h2>
            </div>
            <p className="font-tiempos-text text-bone/50 text-lg mb-12">
              Each layer builds on the one below it. Start at Layer 1. Work up.
            </p>

            <div className="space-y-8">
              {LAYERS.map((layer) => (
                <div
                  key={layer.n}
                  className="flex gap-6 pb-8 border-b border-bone/10 last:border-0 last:pb-0"
                >
                  <div className="shrink-0">
                    <span className="font-obviously-wide text-red text-sm uppercase tracking-wide whitespace-nowrap">
                      Layer {layer.n}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-obviously-wide lowercase text-bone text-xl md:text-2xl mb-2">
                      {layer.title}
                    </h3>
                    <p className="font-tiempos-text text-bone/60 text-base md:text-lg leading-relaxed">
                      {layer.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="font-tiempos-text text-bone/40 text-sm italic mt-10">
              Today we build Layer 1. Everything else follows from here.
            </p>
          </div>

          {/* Right: Diagram */}
          <div className="w-full md:sticky md:top-24">
            <Image
              src={IMG("ai-layers-diagram.jpg")}
              alt="The 5-layer AI operating system diagram"
              width={1200}
              height={1200}
              style={{ width: "100%", height: "auto" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Who This Is For ──────────────────────────────────────────────────────────

const WHO_FOR_ITEMS = [
  "You run a business and you are still the bottleneck on everything",
  "You use ChatGPT or Claude occasionally but you have no system around it",
  "You are spending hours on work that should take 20 minutes",
  "You know AI is important but you do not know where to actually start",
  "You want to build the machine, not just read about it",
  "You are done with generic AI outputs that sound nothing like you",
];

function WhoForSection() {
  return (
    <section className="bg-bone py-20 md:py-28">
      <div className="max-w-[860px] mx-auto px-4 md:px-8">
        <h2
          className="font-obviously-wide lowercase text-black leading-[1.05] mb-12"
          style={{ fontSize: "clamp(30px, 5vw, 56px)" }}
        >
          this is for you if...
        </h2>

        <ul className="space-y-5 mb-16" role="list">
          {WHO_FOR_ITEMS.map((item, i) => (
            <li key={i} className="flex gap-5 items-start">
              <span
                className="text-red shrink-0 text-xl leading-none mt-1.5"
                aria-hidden="true"
              >
                ✓
              </span>
              <span className="font-tiempos-text text-black text-lg md:text-xl leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <p className="font-tiempos-text text-black text-xl md:text-2xl text-center leading-relaxed font-semibold">
          If that is you, this is the most useful 2 hours you will spend this
          year.
        </p>
      </div>
    </section>
  );
}

// ─── About Stanley ────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section className="bg-black py-20 md:py-28">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-[360px_1fr] gap-12 md:gap-16 items-start">
          {/* Photo */}
          <div className="w-full md:w-[360px]">
            <Image
              src={IMG("stanley-about.JPG")}
              alt="Stanley Henry, CEO of The Attention Seeker"
              width={720}
              height={960}
              style={{ width: "100%", height: "auto" }}
              sizes="(max-width: 768px) 100vw, 360px"
            />
          </div>

          {/* Text */}
          <div>
            <h2
              className="font-obviously-wide lowercase text-bone leading-[1.05] mb-8"
              style={{ fontSize: "clamp(30px, 4.5vw, 52px)" }}
            >
              hi, i&apos;m stanley henry.
            </h2>
            <div className="space-y-6 font-tiempos-text text-bone text-lg md:text-[20px] leading-[1.75]">
              <p>
                I am the CEO of The Attention Seeker, a social media agency
                based in Auckland, New Zealand.
              </p>
              <p>
                We have 1.4 million followers across our own platforms and
                generate over 1.2 billion organic views every year. No paid
                ads. Just content that works.
              </p>
              <p>
                In late 2025 I started building an AI operating system for my
                business. I call it KEVAN. It now runs half of how we operate.
                Morning briefs. Proposal drafts. Content planning. Team
                coordination. Lead qualification.
              </p>
              <p>
                It took me 3 months of trial and error to build. On 31 March I
                am teaching you the exact system, live, in 2 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "Do I need to be technical?",
    a: "No. If you can write a document, you can do this. There is no coding involved. If you can type, you can build this system.",
  },
  {
    q: "What AI tool do we use?",
    a: "We use Claude (claude.ai). Free or Pro both work. Claude Pro is $20 per month and worth it. The principles in this session also apply to ChatGPT.",
  },
  {
    q: "Will there be a recording?",
    a: "Yes. All attendees receive the recording after the session. You will also get the full template download whether you watch live or later.",
  },
  {
    q: "What if I cannot make it at 11am?",
    a: "Register anyway. You get the recording and the complete template pack sent to you after. You will not miss out on the material.",
  },
  {
    q: "Is this the same as the ERC content webinar?",
    a: "No. The ERC webinar is about content strategy — what to make and how to make it consistently. This is about the operating system that runs your business. Different framework, different outcome. They complement each other perfectly.",
  },
  {
    q: "What happens after the webinar?",
    a: "Two options if you want to go further. The AI Setup Session ($897 NZD) — we build your complete system with you in two calls. Or the Cohort ($2,990/month) — monthly coaching, weekly implementation calls, and a peer group. Both are optional and only available to webinar attendees.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-bone py-20 md:py-28">
      <div className="max-w-[800px] mx-auto px-4 md:px-8">
        <h2
          className="font-obviously-wide lowercase text-black leading-[1.05] mb-12"
          style={{ fontSize: "clamp(30px, 5vw, 56px)" }}
        >
          common questions.
        </h2>

        <div className="divide-y divide-black/10" role="list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} role="listitem">
              <button
                className="w-full flex justify-between items-start gap-6 py-6 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="font-obviously-wide lowercase text-black text-lg md:text-xl leading-snug">
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
                <p className="font-tiempos-text text-black/70 text-base md:text-lg leading-relaxed">
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
          className="font-obviously-wide lowercase text-bone leading-[1.05] mb-6"
          style={{ fontSize: "clamp(32px, 5.5vw, 64px)" }}
        >
          build the system that runs your business.
        </h2>
        <p className="font-tiempos-text text-bone text-xl md:text-2xl leading-relaxed mb-10">
          2 hours. Tuesday 31 March. You leave with your foundation built.
        </p>
        <RegisterButton large className="w-full md:w-auto mb-8" />
        <p className="font-tiempos-text text-bone/40 text-sm leading-relaxed">
          Template pack included. Recording sent to all attendees.
          <br />
          11am New Zealand&nbsp;&nbsp;·&nbsp;&nbsp;9am
          Sydney&nbsp;&nbsp;·&nbsp;&nbsp;6pm New York
        </p>
      </div>
    </section>
  );
}

// ─── Root Export ─────────────────────────────────────────────────────────────

export function AiWebinarLanding() {
  return (
    <main>
      <StickyNav />
      <HeroSection />
      <ValueStackSection />
      <ProblemSection />
      <SolutionSection />
      <FrameworkSection />
      <WhoForSection />
      <AboutSection />
      <FAQSection />
      <FinalCTASection />
    </main>
  );
}
