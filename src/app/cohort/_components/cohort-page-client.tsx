"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const APPLY_PATH = "/cohort/apply";

const FAQS = [
  {
    q: "who is the cohort for?",
    a: "Service business owners doing $500,000 to $5,000,000 per year in revenue who are ready to build a business that doesn't depend entirely on them. The programme works across agency owners, creative studio founders, consultants, coaches, and B2B service businesses. If you're generating real revenue and you're stuck as the ceiling, the cohort was built for you.",
  },
  {
    q: "how much time does this require?",
    a: "Budget 3 to 5 hours per week. That covers the monthly group coaching call, the weekly implementation sessions, and time in the peer group. The implementation work on your business is on top of that. But that's the work you're already not doing because you don't have the system or the accountability.",
  },
  {
    q: "i've done programmes before and they didn't change much. why is this different?",
    a: "Two reasons. First, this is peer-led, not lecture-led. You're not watching someone explain a framework. You're in a room with operators working the same problems and holding you accountable to your own goals. Second, it's built on a working system, not content designed to fill 12 months. Every session is tied to implementation.",
  },
  {
    q: "is the founding cohort right for me or should i wait for a future cohort?",
    a: "Founding member pricing is $1,495/month, half the standard rate of $2,990. That rate is locked for your entire enrolment while you remain continuously enrolled. There is no future cohort at this price. If the programme is right for you, the founding cohort is the only time this value exists.",
  },
  {
    q: "what happens if i need to leave before 12 months?",
    a: "The 12-month minimum commitment is part of the Individual Member Agreement. Early termination terms are detailed in that document. We ask for a 12-month commitment because peer-based programmes don't work without committed members: it's a quality gate as much as a commercial one.",
  },
  {
    q: "is stanley actually accessible or is this one of those programmes where you never hear from the founder?",
    a: "Stanley is in the monthly group coaching calls, in the peer group WhatsApp, and reviewing 90-day sprints. This is a founding cohort of 6 people. He built it specifically because he wanted to stay close to the work. As the programme scales to future cohorts, the access model may change, but not for founding members.",
  },
  {
    q: "what currency is pricing in?",
    a: "All pricing is in New Zealand Dollars (NZD) and excludes GST. If you're outside New Zealand, you'll receive an invoice in NZD. We recommend checking the current exchange rate. Payment processor to be confirmed.",
  },
  {
    q: "when does the founding cohort start and what happens at launch?",
    a: "The founding cohort launches on 20 April 2026. In the week prior, founding members receive their onboarding pack, WhatsApp group access, and a pre-cohort briefing document. The first monthly group coaching call is on the first Friday of May 2026.",
  },
  {
    q: "is there a money-back guarantee?",
    a: "There is no general money-back policy on a 12-month peer group. The nature of the product is that value is created by committed members being present. A refund policy would undermine the quality of the room. What we do commit to: if you complete the first 30 days and feel the fit isn't right, bring it to us directly. We'll work through it.",
  },
  {
    q: "what's the application process and does applying commit me to anything?",
    a: "The application form takes five minutes. No payment is required. We review applications personally and contact you within 48 hours. If it looks like a good fit, we'll schedule a 30-minute call with Stanley or a team member. If both sides agree, you'll receive the Individual Member Agreement and a payment link. Applying commits you to nothing except the conversation.",
  },
  {
    q: "what if i'm slightly below the $500k revenue threshold?",
    a: "Apply and tell us where you are. The floor exists to ensure the peer group is at a roughly similar stage, but we review applications on the full picture. If you're at $380K with the right trajectory, it's worth a conversation.",
  },
];

export function CohortPageClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroImgError, setHeroImgError] = useState(false);
  const [stanleyImgError, setStanleyImgError] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-black min-h-screen">

      {/* ── SECTION 2: Announcement Bar ── */}
      <div className="bg-black border-b border-bone/10 py-[10px] text-center">
        <p className="font-obviously text-bone/70 lowercase text-[13px] px-4">
          founding member pricing: $1,495/month · closes 20 april 2026 or when 6 spots are sold · standard rate: $2,990/month
        </p>
      </div>

      {/* ── SECTION 1: Navigation ── */}
      <nav
        className={`sticky top-0 z-40 bg-black py-5 transition-none ${
          navScrolled ? "border-b border-bone/10" : ""
        }`}
      >
        <div className="mx-auto max-w-full px-8 flex items-center justify-between">
          <Link href="/" className="min-w-[120px]">
            <span className="font-obviously-wide font-bold text-red lowercase text-[22px]">
              attn:seeker
            </span>
          </Link>
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#whats-included"
              className="font-obviously font-medium lowercase text-bone text-[14px] hover:text-red"
            >
              what&apos;s included
            </Link>
            <Link
              href={APPLY_PATH}
              className="bg-red text-bone font-obviously font-medium lowercase text-[16px] px-8 py-4 rounded-button hover:bg-dark-red"
            >
              apply now
            </Link>
          </div>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 flex flex-col gap-1.5"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-6 h-0.5 bg-bone" />
            <span className="block w-6 h-0.5 bg-bone" />
            <span className="block w-6 h-0.5 bg-bone" />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <button
            className="absolute top-5 right-6 text-bone text-[24px] font-obviously"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
          <nav className="flex flex-col items-center gap-8">
            {[
              { label: "what's included", href: "#whats-included" },
              { label: "how it works", href: "#how-it-works" },
              { label: "pricing", href: "#pricing" },
              { label: "faq", href: "#faq" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-obviously-wide font-bold text-bone text-[40px] leading-none lowercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href={APPLY_PATH}
            className="absolute bottom-12 bg-red text-bone font-obviously font-medium lowercase text-[16px] px-8 py-4 rounded-button"
            onClick={() => setMobileMenuOpen(false)}
          >
            apply now
          </Link>
        </div>
      )}

      {/* ── SECTION 3: Hero ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background image */}
        {!heroImgError ? (
          <Image
            src="/images/cohort/stanley-hero.jpg"
            alt="Stanley Henry"
            fill
            className="object-cover object-center"
            priority
            onError={() => setHeroImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/65" />
        {/* Content */}
        <div className="relative z-10 w-full mx-auto max-w-standard px-6 md:px-8 pt-[96px] pb-[96px] md:pt-[128px] md:pb-[96px]">
          <p className="font-obviously font-medium text-red lowercase text-[14px] tracking-[0.01em] mb-xs">
            attn:founders
          </p>
          <h1
            className="font-obviously-wide font-bold lowercase text-bone leading-none max-w-[580px]"
            style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.02em" }}
          >
            stop running
            <br />
            the business.
            <br />
            start building it.
          </h1>
          <p className="font-tiempos-text text-bone text-[18px] md:text-[20px] leading-[1.6] mt-md max-w-[500px]">
            The attn:seeker Cohort Programme is a 12-month peer group and coaching programme for
            service business owners doing $500K to $5M. Built on the same system that took
            attn:seeker from zero to 1.2 billion organic views and a team of 18, without a single
            paid ad.
          </p>
          <div className="mt-lg">
            <Link
              href={APPLY_PATH}
              className="inline-block bg-red text-bone font-obviously font-medium lowercase text-[16px] px-8 py-4 rounded-button hover:bg-dark-red"
            >
              apply for founding cohort
            </Link>
            <p className="font-obviously text-bone/55 lowercase text-[13px] mt-3">
              takes less than 5 minutes. no payment required.
            </p>
          </div>
          <p className="font-obviously font-medium text-bone lowercase text-[13px] mt-[40px]">
            founding member: $1,495/month → standard rate after april 20: $2,990/month · 6 spots available
          </p>
        </div>
      </section>

      {/* ── SECTION 4: Social Proof Bar ── */}
      <section className="bg-black border-t border-bone/10 py-[48px]">
        <div className="mx-auto max-w-full px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-full md:px-4">
            {[
              { number: "1.2B", label: "organic views generated" },
              { number: "1.4M", label: "followers across our platforms" },
              { number: "35K", label: "daily newsletter readers" },
              { number: "7 yrs", label: "zero paid ads" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`text-center md:text-left md:px-8 ${
                  i < 3 ? "md:border-r md:border-bone/15" : ""
                }`}
              >
                <p className="font-obviously-narrow font-black text-red text-[40px] md:text-stat leading-none lowercase">
                  {stat.number}
                </p>
                <p className="font-obviously text-bone/55 lowercase text-[14px] mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <p className="font-tiempos-text text-bone/70 text-[16px] text-center mt-8 max-w-standard mx-auto px-6">
            Every number above was earned organically. No paid media. No shortcuts. That&apos;s the
            system we teach.
          </p>
        </div>
      </section>

      {/* ── SECTION 5: Problem Section ── */}
      <section className="bg-black py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">
            sound familiar?
          </p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            you&apos;ve built something real.
            <br />
            and you&apos;re still the bottleneck.
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md max-w-[680px]">
            You&apos;re past the early years. Revenue is real. The team is real. But something
            isn&apos;t adding up. Every new client means more of you. Every expansion means more
            hours. The ceiling isn&apos;t the market. It&apos;s the way you&apos;ve built the thing.
          </p>
          <div className="mt-lg max-w-[680px] space-y-6">
            {[
              {
                statement: "Revenue has plateaued.",
                sub: "Not because the market is slow. Because growth requires more of you, and you've run out of you.",
              },
              {
                statement: "You're the rainmaker, the closer, and the fallback.",
                sub: "Your team is good. But nothing happens without you in the room.",
              },
              {
                statement: "You have no real peers.",
                sub: "The people around you are employees, clients, or friends who can't speak to this level. You're making big decisions alone.",
              },
              {
                statement: "You've tried the courses. You've read the books.",
                sub: "Generic advice for generic problems. You needed someone to look at your specific machine.",
              },
              {
                statement: "The business runs. But it doesn't run without you.",
                sub: "That's not scale. That's a well-paid job.",
              },
            ].map((item, i) => (
              <div key={i}>
                <p className="font-tiempos-headline font-medium text-bone text-[22px] leading-[1.3]">
                  {item.statement}
                </p>
                <p className="font-tiempos-text text-bone/55 text-[16px] leading-[1.5] mt-1">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-bone/10 my-xl" />
          <p className="font-tiempos-headline font-medium text-bone text-[26px] max-w-[600px]">
            This is not a motivation problem. It&apos;s an architecture problem.
          </p>
        </div>
      </section>

      {/* ── SECTION 6: Agitation Section ── */}
      <section className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">the real cost</p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            every year you wait
            <br />
            is a year you pay for it.
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md max-w-[680px]">
            Most service business owners at $800K spend three to five more years working at $800K
            before something fundamentally changes, or doesn&apos;t. Not because they lack ambition.
            Because they lack the right architecture, the right peers, and someone who has already
            solved the problem they&apos;re sitting in.
          </p>
          <div className="mt-xl bg-[#111111] border border-bone/10 p-10 rounded-card max-w-[620px]">
            <p className="font-obviously font-medium text-red lowercase text-[13px]">
              what the status quo actually costs
            </p>
            <p className="font-tiempos-headline font-medium text-bone text-[20px] leading-[1.5] mt-4">
              If you&apos;re at $800K today and a founding cohort member grows 40% in year one,
              you&apos;re leaving $320,000 on the table this year alone. Over three years, that&apos;s
              close to $1M.
            </p>
            <p className="font-tiempos-headline font-medium text-bone text-[20px] leading-[1.5] mt-4">
              The founding cohort costs $17,940 for the first year. The question is never whether you
              can afford it. It&apos;s whether you can afford not to.
            </p>
          </div>
          <div className="mt-[40px]">
            <Link
              href="#how-it-works"
              className="inline-block bg-red text-bone font-obviously font-medium lowercase text-[16px] px-8 py-4 rounded-button hover:bg-dark-red"
            >
              see the programme
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: Solution Bridge ── */}
      <section className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">
            the architecture that changes it
          </p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            what if the ceiling
            <br />
            wasn&apos;t the ceiling?
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md max-w-[680px]">
            The operators who cross $2M, $5M, $10M aren&apos;t smarter or more disciplined than you.
            They&apos;re running a fundamentally different version of the business: one where the
            system does the work, the team operates without them in every conversation, and the peer
            group gives them the visibility they&apos;d never get alone.
          </p>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-4 max-w-[680px]">
            We&apos;ve spent seven years building that system at attn:seeker. We&apos;ve done it for
            ourselves. We&apos;ve done it for the businesses we work with. Now we&apos;re building
            the room where 6 operators get to do it together.
          </p>
          <p className="font-tiempos-headline font-medium text-bone text-[26px] max-w-[560px] mt-xl">
            That&apos;s what we built the cohort for.
          </p>
        </div>
      </section>

      {/* ── SECTION 8: Programme Introduction (Red Section) ── */}
      <section className="bg-red py-[64px] md:py-3xl text-center">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <p className="font-obviously font-medium text-bone/70 lowercase text-[14px]">
            introducing
          </p>
          <h2
            className="font-obviously-wide font-bold lowercase text-bone leading-none mt-xs"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            the attn:seeker cohort programme
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] md:text-[22px] leading-[1.6] max-w-[640px] mx-auto mt-8">
            A 12-month peer group and coaching programme for 6 service business owners who are ready
            to build the version of their business that runs without them in every decision. Monthly
            group coaching with Stanley Henry, weekly implementation calls with the attn:seeker team,
            a private peer group, and the full ERC content system. Founding cohort. Founding pricing.
            Starting 20 April 2026.
          </p>
          <div className="mt-[40px]">
            <Link
              href={APPLY_PATH}
              className="inline-block bg-bone text-black font-obviously font-medium lowercase text-[16px] px-8 py-4 rounded-button hover:bg-white"
            >
              apply for founding cohort
            </Link>
          </div>
          <p className="font-obviously text-bone/70 lowercase text-[13px] mt-3">
            6 founding spots. 20 april 2026 start. pricing locked for life.
          </p>
        </div>
      </section>

      {/* ── SECTION 9: How It Works ── */}
      <section id="how-it-works" className="bg-black py-[64px] md:py-3xl">
        <div className="mx-auto max-w-wide px-6 md:px-8">
          <div className="max-w-[640px] mb-[64px]">
            <p className="font-obviously font-medium text-red lowercase text-[14px]">
              how the year works
            </p>
            <h2
              className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
              style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
            >
              a year of building, not a year of learning
            </h2>
            <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md">
              Most programmes teach. This one builds. Every month is structured around
              implementation: a strategic focus, a coaching session, a peer group working the same
              problem, and the accountability structure to actually execute.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "monthly",
                title: "group coaching with stanley",
                body: "120-minute live coaching session every month with Stanley Henry. Real businesses, real problems, real answers. Recorded. Two timezone sessions: 11am and 7am NZT. First Friday of each month.",
              },
              {
                label: "weekly",
                title: "implementation calls",
                body: "Every week, a focused 60-minute implementation session run by the attn:seeker team. Work through your actual business, not hypotheticals. APAC: Monday 1pm NZT. Americas and UK: Tuesday 7am NZT.",
              },
              {
                label: "always on",
                title: "your peer group",
                body: "A private WhatsApp community for the full cohort, plus a matched small core group. People at the same stage as you, working the same problems. Not a Facebook group. A real peer group.",
              },
              {
                label: "quarterly",
                title: "90-day sprint reviews",
                body: "Three goals per quarter. Weekly tracking. Monthly review in the group coaching call. A structured cadence that keeps you moving toward the year's objective, not just running on the treadmill.",
              },
              {
                label: "guest sessions",
                title: "expert access",
                body: "Live sessions with specialists in cashflow, HR, legal, AI, and sales systems. Practical experts, not motivational speakers. All recorded for the cohort library.",
              },
              {
                label: "annual",
                title: "in-person retreat",
                body: "One in-person retreat per year, included. The annual moment where the group gets in the same room. Strategy, reflection, and the conversations that only happen face to face. Location to be confirmed.",
              },
            ].map((card, i) => (
              <div key={i} className="bg-[#111111] border border-bone/10 rounded-card p-6">
                <p className="font-obviously font-medium text-red lowercase text-[13px]">
                  {card.label}
                </p>
                <h3 className="font-obviously-wide font-semibold lowercase text-bone text-[22px] leading-[1.2] mt-xs">
                  {card.title}
                </h3>
                <p className="font-tiempos-text text-bone/70 text-[16px] leading-[1.5] mt-3">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: What You Get ── */}
      <section id="whats-included" className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <div className="max-w-[560px] mb-[64px]">
            <p className="font-obviously font-medium text-red lowercase text-[14px]">
              everything included
            </p>
            <h2
              className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
              style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
            >
              the full picture
            </h2>
            <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md">
              Every component below is included in your monthly fee. Nothing is upsold. No add-on
              products. No tiers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {[
              [
                "monthly group coaching (2 hours)",
                "With Stanley Henry. Live, recorded, two timezone options. Every question answered, not deflected.",
              ],
              [
                "full erc content system",
                "The entire Easily Repeatable Content methodology — the same framework behind 1.2 billion organic views. Adapted for your business and audience.",
              ],
              [
                "weekly implementation calls",
                "60 minutes per week, facilitated by the attn:seeker team. For executing, not planning.",
              ],
              [
                "organic growth training",
                "Platform strategy, content format development, posting consistency systems. From the team that does it every day for agency clients.",
              ],
              [
                "private peer group access",
                "WhatsApp community. Full cohort plus a matched small core group. Async and always on.",
              ],
              [
                "ai automation playbooks",
                "Practical AI implementation guides built by the attn:seeker team. Applied to real business operations, not theory.",
              ],
              [
                "90-day sprint framework",
                "Three structured goals per quarter. Weekly tracking. Monthly review. The accountability layer most business owners are missing.",
              ],
              [
                "attn:seeker sops and templates",
                "Internal frameworks, hiring processes, operational templates from an 18-person agency. Yours to adapt.",
              ],
              [
                "annual in-person retreat",
                "One full cohort retreat per year. Location TBC. Flights and accommodation not included.",
              ],
              [
                "founding member pricing, locked for life",
                "$1,495/month. Half the standard rate. Locked for life while you remain continuously enrolled. This pricing does not return after the founding cohort.",
              ],
              [
                "guest expert sessions",
                "Specialists in cashflow, HR, legal, AI, and sales systems. Scheduled throughout the year. All recorded.",
              ],
              [
                "direct access to stanley",
                "Not filtered through a team. In the group calls, in the WhatsApp group, reviewing your 90-day sprints. Real access to the person who built the system.",
              ],
            ].map(([title, desc], i) => (
              <div key={i} className="py-5 border-b border-bone/10">
                <p className="font-obviously-wide font-semibold lowercase text-bone text-[18px]">
                  {title}
                </p>
                <p className="font-tiempos-text text-bone/55 text-[15px] leading-[1.5] mt-1">
                  {desc}
                </p>
              </div>
            ))}
          </div>
          {/* Value stack — white card for contrast at this key moment */}
          <div className="mt-xl bg-white rounded-card px-10 py-8 max-w-[640px]">
            <p className="font-obviously font-medium text-red lowercase text-[13px]">
              total programme value
            </p>
            <p className="font-tiempos-headline font-medium text-black text-[22px] leading-[1.5] mt-4">
              Weekly implementation support from a decent business consultant starts at $1,500 per
              month. Monthly group coaching at this calibre starts at $3,000. Stack the content
              system, templates, retreat, and peer group access, and you&apos;re looking at $8,000 to
              $12,000 per month if you tried to buy these separately.
            </p>
            <p className="font-tiempos-headline font-medium text-black text-[22px] leading-[1.5] mt-4">
              As a founding member: $1,495 per month.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 11: The Cohort — Peer Group ── */}
      <section className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">
            who you&apos;ll be in the room with
          </p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            6 operators.
            <br />
            one peer group.
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md max-w-[640px]">
            The founding cohort is limited to 6 members. That is not a marketing number. It is the
            actual size that makes peer learning work. Small enough for everyone to know
            everyone&apos;s business. Large enough for genuine diversity of perspective.
          </p>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-4 max-w-[640px]">
            Members are service business owners doing between $500,000 and $5,000,000 in annual
            revenue. Agency owners. Creative studio founders. Consultants. B2B service businesses.
            Different industries. Same stage. Same problem: they&apos;ve built something real, and
            they&apos;re ready to build something that doesn&apos;t depend entirely on them.
          </p>
          <div className="grid grid-cols-3 mt-[64px]">
            {[
              { number: "$500K", label: "minimum annual revenue" },
              { number: "6", label: "founding member spots" },
              { number: "12", label: "month minimum commitment" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`${i < 2 ? "md:border-r md:border-bone/15 pr-4 md:pr-8" : ""} ${
                  i > 0 ? "pl-4 md:pl-8" : ""
                }`}
              >
                <p className="font-obviously-narrow font-black text-red text-[36px] md:text-[48px] leading-none lowercase">
                  {stat.number}
                </p>
                <p className="font-obviously text-bone/55 lowercase text-[12px] md:text-[14px] mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-bone/10 mt-[64px] pt-[48px]">
            <h3 className="font-obviously-wide font-semibold lowercase text-bone text-[24px] md:text-[28px]">
              why we use an application
            </h3>
            <p className="font-tiempos-text text-bone text-[18px] leading-[1.6] mt-4 max-w-[640px]">
              The application is not a filter for us. It&apos;s a filter for you. The peer group only
              works when every member is at the right stage, with the right intention, and the right
              commitment. We review every application personally. If we don&apos;t think it&apos;s a
              mutual fit, we&apos;ll tell you why.
            </p>
            <p className="font-tiempos-text text-bone text-[18px] leading-[1.6] mt-4 max-w-[640px]">
              Applying takes five minutes and commits you to nothing financially. If you&apos;re
              accepted, you&apos;ll be invited to a 30-minute fit call before any payment is
              discussed.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 12: Stanley Section ── */}
      <section className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-wide px-6 md:px-8">
          <div className="flex flex-col md:flex-row gap-8 md:items-stretch">
            {/* Image */}
            <div className="md:w-[40%] relative min-h-[300px]">
              {!stanleyImgError ? (
                <Image
                  src="/images/cohort/stanley-portrait.jpg"
                  alt="Stanley Henry"
                  fill
                  className="object-cover object-center"
                  style={{ borderRadius: 0 }}
                  onError={() => setStanleyImgError(true)}
                />
              ) : (
                <div className="w-full h-full min-h-[400px] bg-[#111111] border border-bone/10 flex items-center justify-center">
                  <p className="font-obviously text-bone/30 lowercase text-[13px]">
                    photo coming soon
                  </p>
                </div>
              )}
            </div>
            {/* Content */}
            <div className="md:w-[60%]">
              <p className="font-obviously font-medium text-red lowercase text-[14px]">
                your facilitator
              </p>
              <h2
                className="font-obviously-wide font-semibold lowercase text-bone mt-xs"
                style={{ fontSize: "clamp(28px, 3.5vw, 40px)" }}
              >
                stanley henry
              </h2>
              <p className="font-tiempos-headline font-medium text-bone/55 text-[20px] mt-2">
                CEO, attn:seeker. 7 years building the machine.
              </p>
              <p className="font-tiempos-text text-bone text-[18px] leading-[1.6] mt-6">
                Stanley Henry started attn:seeker in October 2019 with Claire Henry, his co-founder
                and wife. In seven years, the agency grew to 18 people, 1.2 billion organic views for
                clients, and a personal following of 65,000 across his platforms. All organic. No paid
                ads. The YAP newsletter has 35,000 daily readers. The agency runs without Stanley in
                the weeds of every client account.
              </p>
              <p className="font-tiempos-text text-bone text-[18px] leading-[1.6] mt-4">
                He&apos;s also grown up publicly. Grew up in Manurewa, Auckland. One of four boys in
                a low-income family. Now documenting the journey to 40, building systems, and talking
                plainly about what actually moves a business. No borrowed credibility. No frameworks
                built on someone else&apos;s context. Just the thing he built and the system behind
                it.
              </p>
              <p className="font-tiempos-text text-bone text-[18px] leading-[1.6] mt-4">
                The cohort exists because the questions he gets every week are the same ones he had
                five years ago, and the right answer isn&apos;t a course. It&apos;s a peer group, a
                system, and someone who has already solved the problem. That&apos;s what this is.
              </p>
              {/* Credentials bar */}
              <div className="flex flex-wrap gap-6 mt-8">
                {[
                  { num: "18", label: "person team" },
                  { num: "1.2B", label: "organic views" },
                  { num: "65K+", label: "personal following" },
                  { num: "7", label: "years in business" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="font-obviously-narrow font-black text-red text-[36px] leading-none lowercase">
                      {s.num}
                    </p>
                    <p className="font-obviously text-bone/55 lowercase text-[13px] mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 13: Results (pre-launch: methodology) ── */}
      <section className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-wide px-6 md:px-8">
          <div className="max-w-[560px] mb-[64px]">
            <p className="font-obviously font-medium text-red lowercase text-[14px]">
              the methodology
            </p>
            <h2
              className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
              style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
            >
              built on a system that works
            </h2>
            <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md">
              The results below reflect the system, not the cohort — which launches April 2026. Member
              results will replace this section from June 2026 onwards.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111111] border border-bone/10 rounded-card p-6">
              <div className="w-[35px] h-[2px] bg-red mb-4" />
              <p className="font-tiempos-headline font-medium text-bone text-[20px] leading-[1.5]">
                The ERC system is one repeatable content format with a single changing variable,
                posted consistently. It creates massive scale without constant creative reinvention.
                That&apos;s the framework behind 1.2 billion organic views.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-red/10 flex-shrink-0 flex items-center justify-center">
                  <span className="font-obviously-wide font-bold text-red lowercase text-[11px]">
                    erc
                  </span>
                </div>
                <div>
                  <p className="font-obviously-wide font-semibold lowercase text-bone text-[14px]">
                    the erc system
                  </p>
                  <p className="font-obviously text-bone/55 lowercase text-[13px]">
                    attn:seeker methodology
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#111111] border border-bone/10 rounded-card p-6">
              <div className="w-[35px] h-[2px] bg-red mb-4" />
              <p className="font-tiempos-headline font-medium text-bone text-[20px] leading-[1.5]">
                Seven years. Zero paid ads. 18-person team. 1.2 billion organic views for clients.
                The system works at scale. The cohort brings it to your business.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-red/10 flex-shrink-0 flex items-center justify-center">
                  <span className="font-obviously-wide font-bold text-red lowercase text-[11px]">
                    as
                  </span>
                </div>
                <div>
                  <p className="font-obviously-wide font-semibold lowercase text-bone text-[14px]">
                    attn:seeker
                  </p>
                  <p className="font-obviously text-bone/55 lowercase text-[13px]">
                    organic social media agency, auckland nz
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="font-tiempos-fine text-bone/40 text-[13px] mt-8">
            Member results will be published from June 2026 as the founding cohort progresses.
          </p>
        </div>
      </section>

      {/* ── SECTION 14: Who This Is For / Not For ── */}
      <section className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">right fit</p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs mb-xl"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            not for everyone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[32px]">
            {/* For you */}
            <div>
              <h3 className="font-obviously-wide font-semibold lowercase text-bone text-[24px] mb-6">
                this is for you
              </h3>
              <div className="space-y-6">
                {[
                  "You're running a service business doing $500K to $5M and you've hit a ceiling.",
                  "You want to build systems and a team that operate without you in every decision.",
                  "You're ready to commit 3 to 5 hours per week to the programme and the peer group.",
                  "You want direct access to someone who has solved the problem you're in, not a curriculum manager.",
                  "You understand that results come from implementation, not attendance.",
                  "You want a peer group of operators at your level, not a community of beginners.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-[2px] h-4 bg-red mt-1 flex-shrink-0" />
                    <p className="font-tiempos-text text-bone text-[17px] leading-[1.5]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Not for you */}
            <div>
              <h3 className="font-obviously-wide font-semibold lowercase text-bone/40 text-[24px] mb-6">
                this is not for you
              </h3>
              <div className="space-y-6">
                {[
                  "You're pre-revenue or in the first year of your business.",
                  "You're looking for a done-for-you service, not a build-it-yourself system.",
                  "You can't commit to the 12-month minimum.",
                  "You're not willing to share honestly with a peer group what's working and what isn't.",
                  "You're expecting a course with a certificate at the end.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-5 h-[1px] bg-bone/30 mt-[11px] flex-shrink-0" />
                    <p className="font-tiempos-text text-bone/55 text-[17px] leading-[1.5]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="font-tiempos-headline font-medium text-bone text-[22px] text-center mt-xl">
            If the first list felt like a mirror, the application takes five minutes.
          </p>
        </div>
      </section>

      {/* ── SECTION 15: Application Process ── */}
      <section id="apply" className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">how to apply</p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            what happens next
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md max-w-[580px]">
            The application takes five minutes. No payment is required at this stage. We review every
            application personally and respond within 48 hours.
          </p>
          {/* Process steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-[64px] relative">
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-[1px] bg-bone/15" />
            {[
              {
                num: "01",
                title: "submit your application",
                desc: "A short form covering your business, your revenue, and what you want to build in the next 12 months. Takes five minutes.",
              },
              {
                num: "02",
                title: "we review your application",
                desc: "Every application is reviewed personally by the attn:seeker team. We'll contact you within 48 hours.",
              },
              {
                num: "03",
                title: "30-minute fit call",
                desc: "A conversation with Stanley or a member of the team. We're checking for mutual fit, not grilling you. No payment required at this stage.",
              },
              {
                num: "04",
                title: "secure your spot",
                desc: "If it's the right fit on both sides, you'll receive the Individual Member Agreement and your first payment link. Your spot is secured upon payment.",
              },
            ].map((step, i) => (
              <div key={i} className="relative z-10">
                <p className="font-obviously-narrow font-black text-red text-[48px] leading-none">
                  {step.num}
                </p>
                <h3 className="font-obviously-wide font-semibold lowercase text-bone text-[18px] leading-[1.2] mt-2">
                  {step.title}
                </h3>
                <p className="font-tiempos-text text-bone/70 text-[15px] leading-[1.5] mt-2">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-[64px]">
            <Link
              href={APPLY_PATH}
              className="inline-block bg-red text-bone font-obviously font-medium lowercase text-[16px] px-8 py-4 rounded-button hover:bg-dark-red"
            >
              apply for founding cohort
            </Link>
            <p className="font-obviously text-bone/55 lowercase text-[13px] mt-3">
              founding cohort. launching 20 april 2026. 6 spots available.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 16: Pricing ── */}
      <section id="pricing" className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">

          {/* Section intro */}
          <p className="font-obviously font-medium text-red lowercase text-[14px]">
            founding member pricing closes 20 april 2026
          </p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            act now or pay
            <br />
            double forever.
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md max-w-[640px]">
            The standard rate for the attn:seeker Cohort Programme is $2,990 per month. For the next
            6 weeks, or until 6 founding spots are sold, whichever comes first, founding members pay
            $1,495 per month. That rate is then locked for the lifetime of their continuous
            enrolment. It never goes up. It never comes back. When this window closes, it closes
            permanently.
          </p>

          {/* Urgency bar */}
          <div className="bg-[#111111] border border-bone/10 rounded-card px-8 py-6 mt-xl">
            <div className="flex flex-col md:flex-row gap-6 md:gap-0">
              <div className="md:w-1/2 md:pr-8 md:border-r md:border-bone/15">
                <p className="font-obviously font-medium text-red lowercase text-[13px]">
                  founding pricing closes
                </p>
                <p className="font-obviously-wide font-bold text-bone lowercase text-[28px] leading-tight mt-1">
                  20 april 2026
                </p>
                <p className="font-obviously text-bone/55 lowercase text-[13px] mt-1">
                  or when 6 spots are sold
                </p>
              </div>
              <div className="md:w-1/2 md:pl-8">
                <p className="font-obviously font-medium text-red lowercase text-[13px]">
                  founding spots remaining
                </p>
                {/* Update this number manually as spots fill */}
                <p className="font-obviously-narrow font-black text-red text-[48px] leading-none mt-1">
                  6
                </p>
                <p className="font-obviously text-bone/55 lowercase text-[13px] mt-1">
                  update manually as spots fill
                </p>
              </div>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-xl">

            {/* Card 1: Standard rate (anchor — intentionally subdued) */}
            <div className="bg-white rounded-card p-8">
              <p className="font-obviously font-medium text-black/40 lowercase text-[13px]">
                standard rate — after 20 april 2026
              </p>
              <p className="font-obviously-narrow font-black text-black/40 text-[64px] leading-none mt-2">
                $2,990
              </p>
              <p className="font-obviously text-black/40 lowercase text-[14px]">per month + gst</p>
              <p className="font-tiempos-fine text-black/40 text-[14px] mt-1">
                $29,900 per year (pay annually — 2 months free)
              </p>
              <div className="border-t border-black/10 my-6" />
              <ul className="space-y-3">
                {[
                  "All programme inclusions",
                  "Standard rate — not locked",
                  "12-month minimum commitment",
                  "Available after founding cohort closes",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="w-4 h-[1px] bg-black/25 mt-[11px] flex-shrink-0" />
                    <span className="font-tiempos-text text-black/40 text-[16px] leading-[1.5]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <button className="block w-full text-center bg-black/60 text-bone font-obviously font-medium lowercase text-[14px] py-4 rounded-button mt-6 cursor-default">
                this is what you&apos;ll pay if you wait
              </button>
            </div>

            {/* Card 2: Founding rate (the offer) */}
            <div>
              <div className="inline-block bg-red text-bone font-obviously font-medium lowercase text-[12px] px-4 py-[6px] rounded-pill mb-0 relative z-10">
                founding member — closes 20 april 2026
              </div>
              <div className="bg-white rounded-card p-8 border-2 border-red -mt-[1px]">
                <p className="font-obviously font-medium text-red lowercase text-[13px]">
                  founding member rate — locked for life
                </p>
                <p className="font-obviously-narrow font-black text-black text-[64px] leading-none mt-2">
                  $1,495
                </p>
                <p className="font-obviously text-black/55 lowercase text-[14px]">per month + gst</p>
                <p className="font-tiempos-fine text-black/55 text-[14px] mt-1">
                  $14,950 per year (pay annually — 2 months free)
                </p>
                <p className="font-tiempos-headline font-medium text-red text-[18px] mt-3">
                  $17,940 saved in year one. More every year after that.
                </p>
                <div className="border-t border-black/10 my-6" />
                <ul className="space-y-3">
                  {[
                    "All programme inclusions",
                    "Founding member rate locked for life while continuously enrolled",
                    "12-month minimum commitment",
                    "Billing on the 15th of each month",
                    "Rate never increases as long as you stay enrolled",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-[2px] h-4 bg-red mt-1 flex-shrink-0" />
                      <span className="font-tiempos-text text-black text-[16px] leading-[1.5]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={APPLY_PATH}
                  className="block w-full text-center bg-red text-bone font-obviously font-medium lowercase text-[16px] py-4 rounded-button hover:bg-dark-red mt-6"
                >
                  apply for founding cohort
                </Link>
                <p className="font-obviously text-black/55 lowercase text-[13px] mt-3 text-center">
                  takes less than 5 minutes. no payment required to apply.
                </p>
              </div>
            </div>
          </div>

          {/* Lifetime compounding block */}
          <div className="mt-xl max-w-[700px]">
            <p className="font-obviously font-medium text-red lowercase text-[14px]">
              what this decision is actually worth
            </p>
            <h3
              className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
              style={{ fontSize: "32px" }}
            >
              the gap compounds every single month.
            </h3>
            <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-4">
              The difference between founding member pricing and the standard rate is $1,495 per
              month. That&apos;s $17,940 in year one. In year two it&apos;s $35,880. In year three,
              $53,820. The founding rate is locked for the lifetime of your continuous enrolment,
              which means the longer you stay, the more the gap between what you pay and what
              everyone else pays keeps growing.
            </p>
            <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-4">
              This is not a sale. Sales end and the price resets. This is a permanent structural
              advantage for the first 6 people who decide.
            </p>
          </div>

          {/* Fine print */}
          <p className="font-tiempos-fine text-bone/40 text-[13px] mt-8 max-w-[700px]">
            All prices exclude GST. 12-month minimum commitment required. Founding member rate of
            $1,495/month is locked for continuous enrolment — any break in membership forfeits the
            founding rate permanently. Standard rate applies to all members who join after the
            founding cohort closes on 20 April 2026 or when 6 spots are sold. Full terms in the
            Individual Member Agreement and Standard Terms and Conditions.
          </p>

        </div>
      </section>

      {/* ── SECTION 17: FAQ ── */}
      <section id="faq" className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">
            common questions
          </p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs mb-xl"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            everything you need to know
          </h2>
          <div>
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-bone/10">
                <button
                  className="w-full flex justify-between items-center py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-obviously-wide font-semibold lowercase text-bone text-[16px] md:text-[18px] pr-8">
                    {faq.q}
                  </span>
                  <span className="text-red text-[24px] font-obviously flex-shrink-0 leading-none">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <p className="font-tiempos-text text-bone/70 text-[17px] leading-[1.6] pb-6">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 18: Final CTA ── */}
      <section className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-narrow px-6 md:px-8 text-center">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">
            founding cohort. 20 april 2026.
          </p>
          <h2
            className="font-obviously-wide font-bold lowercase text-bone leading-none mt-2"
            style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
          >
            6 spots.
            <br />
            one chance at
            <br />
            this price.
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-6">
            Founding member pricing is $1,495/month. The standard rate after April 20 is
            $2,990/month. That gap is permanent: the founding rate locks for life. Six spots. When
            they&apos;re gone, they&apos;re gone.
          </p>
          <div className="mt-8">
            <p className="font-obviously-narrow font-black text-red text-[48px] leading-none">6</p>
            <p className="font-obviously text-bone/55 lowercase text-[14px] mt-1">
              founding spots available
            </p>
          </div>
          <div className="mt-8">
            <Link
              href={APPLY_PATH}
              className="inline-block bg-red text-bone font-obviously font-medium lowercase text-[16px] px-8 py-4 rounded-button hover:bg-dark-red"
            >
              apply for founding cohort
            </Link>
          </div>
          <p className="font-obviously text-bone/55 lowercase text-[13px] mt-3">
            takes less than 5 minutes. no payment required at this stage.
          </p>
          <div className="mt-4">
            <a
              href="mailto:cohort@attnseeker.com"
              className="inline-block border border-red text-red font-obviously font-medium lowercase text-[16px] px-8 py-4 rounded-button hover:bg-red hover:text-bone"
            >
              have a question first?
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTION 19: Footer ── */}
      <footer className="bg-black border-t border-bone/10 pt-[64px] pb-[40px]">
        <div className="mx-auto max-w-wide px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div>
              <span className="font-obviously-wide font-bold text-red lowercase text-[22px]">
                attn:seeker
              </span>
              <p className="font-tiempos-text text-bone/55 text-[15px] leading-[1.6] mt-4">
                attn:seeker is an organic social media agency and education platform based in
                Auckland, New Zealand. Founded 2019.
              </p>
            </div>
            <div>
              <p className="font-obviously font-medium text-bone/55 lowercase text-[12px] mb-4">
                programme
              </p>
              <nav className="flex flex-col gap-3">
                {[
                  { label: "what's included", href: "#whats-included" },
                  { label: "how it works", href: "#how-it-works" },
                  { label: "apply now", href: APPLY_PATH },
                  { label: "faq", href: "#faq" },
                ].map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="font-obviously text-bone lowercase text-[14px] hover:text-red"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <p className="font-obviously font-medium text-bone/55 lowercase text-[12px] mb-4">
                get in touch
              </p>
              <a
                href="mailto:cohort@attnseeker.com"
                className="font-obviously text-bone lowercase text-[14px] hover:text-red"
              >
                cohort@attnseeker.com
              </a>
              <p className="font-tiempos-text text-bone/55 text-[14px] leading-[1.6] mt-2">
                Charlotte Ellis manages all inbound cohort enquiries and responds within one business
                day.
              </p>
            </div>
          </div>
          <div className="border-t border-bone/10 mt-[40px] pt-6 flex flex-col md:flex-row justify-between gap-3">
            <p className="font-obviously text-bone/40 lowercase text-[12px]">
              © 2026 attn:seeker ltd. all rights reserved.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <Link
                href="/privacy-policy"
                className="font-obviously text-bone/40 lowercase text-[12px] hover:text-bone/70"
              >
                privacy policy
              </Link>
              <span className="text-bone/40 text-[12px]">·</span>
              <Link
                href="/terms-and-conditions"
                className="font-obviously text-bone/40 lowercase text-[12px] hover:text-bone/70"
              >
                terms of service
              </Link>
              <span className="text-bone/40 text-[12px]">·</span>
              <Link
                href="#"
                className="font-obviously text-bone/40 lowercase text-[12px] hover:text-bone/70"
              >
                individual member agreement
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
