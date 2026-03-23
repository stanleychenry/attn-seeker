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
    q: "what is the webinar attendee pricing?",
    a: "As a webinar attendee, you pay $10,000 flat for your first 12 months — compared to the standard rate of $2,990/month ($35,880/year). That's a saving of $25,880 in year one. This offer closes 8 April 2026. If the programme is right for you, this is the only time it exists at this price.",
  },
  {
    q: "what happens if i need to leave before 12 months?",
    a: "The 12-month minimum commitment is part of the Individual Member Agreement. Early termination terms are detailed in that document. We ask for a 12-month commitment because peer-based programmes don't work without committed members: it's a quality gate as much as a commercial one.",
  },
  {
    q: "is stanley actually accessible or is this one of those programmes where you never hear from the founder?",
    a: "Stanley is in the monthly group coaching calls, in the peer group WhatsApp, and reviewing 90-day sprints. This is a founding cohort of 12 people. He built it specifically because he wanted to stay close to the work. As the programme scales to future cohorts, the access model may change, but not for founding members.",
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

export function CohortWebinarOfferClient() {
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

      {/* ── Announcement Bar ── */}
      <div className="bg-red py-[10px] text-center">
        <p className="font-obviously text-bone lowercase text-[13px] px-4">
          webinar attendee exclusive: save $25,880 · $10,000 for 12 months · max 12 spots · offer closes 8 april 2026
        </p>
      </div>

      {/* ── Navigation ── */}
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
              claim this offer
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
            claim this offer
          </Link>
        </div>
      )}

      {/* ── Hero ── */}
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
            attn:founders · webinar attendee offer · strictly limited to 12 spots
          </p>
          <h1
            className="font-obviously-wide font-bold lowercase text-bone leading-none max-w-[640px]"
            style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.02em" }}
          >
            save $25,880.
            <br />
            join the founding
            <br />
            cohort today.
          </h1>
          <p
            className="font-obviously-wide font-semibold lowercase text-bone/60 leading-[1.2] mt-sm max-w-[500px]"
            style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
          >
            stop running the business.
            <br />
            start building it.
          </p>
          <p className="font-tiempos-text text-bone text-[18px] md:text-[20px] leading-[1.6] mt-md max-w-[500px]">
            The attn:seeker Cohort Programme is a 12-month peer group and coaching programme for
            service business owners doing $500K to $5M. This is where you build a business that
            operates on your standards without needing you in every room.
          </p>
          <div className="mt-lg">
            <Link
              href={APPLY_PATH}
              className="inline-block bg-red text-bone font-obviously font-medium lowercase text-[16px] px-8 py-4 rounded-button hover:bg-dark-red"
            >
              claim this offer
            </Link>
            <p className="font-obviously text-bone/55 lowercase text-[13px] mt-3">
              takes less than 5 minutes. no payment required.
            </p>
          </div>
          <p className="font-obviously font-medium text-bone lowercase text-[13px] mt-[40px]">
            webinar special: $10,000 for 12 months (save $25,880) · standard rate: $35,880/year · 12 spots max · closes 8 april 2026
          </p>
        </div>
      </section>

      {/* ── Social Proof Bar ── */}
      <section className="bg-black border-t border-bone/10 py-[48px]">
        <div className="mx-auto max-w-full px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-full md:px-4">
            {[
              { number: "7", label: "years in business" },
              { number: "18", label: "full-time staff" },
              { number: "1.4M", label: "followers across platforms" },
              { number: "1.2B", label: "organic views for clients" },
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
        </div>
      </section>

      {/* ── Problem Section ── */}
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
            but you&apos;re still the one
            <br />
            holding it together.
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md max-w-[680px]">
            You&apos;re past the early days. You&apos;ve got serious revenue. You even have a team.
            But the business still relies on your capacity to spin all the plates. Every new client,
            every milestone, demands more of you, not less. Your capacity is the ceiling. And
            it&apos;s costing you the business you actually want.
          </p>
          <p className="font-obviously font-medium text-red lowercase text-[14px] mt-lg">
            see if this sounds like you...
          </p>
          <div className="mt-4 max-w-[680px] space-y-6">
            {[
              {
                statement: "Revenue has plateaued.",
                sub: "Not because the market is slow. Because growth requires more of you, and you've got no more to give.",
              },
              {
                statement: "Your team is capable. But nothing happens without you.",
                sub: "You've become the bottleneck. And it's slowing everything down.",
              },
              {
                statement: "You have no real peers.",
                sub: "The people around you are employees, clients, or friends who can't speak to this level. You're making the biggest calls alone.",
              },
              {
                statement: "You've tried the courses. You've read the books.",
                sub: "You've gotten as far as you can on generic advice. Now, you need to learn from someone who can look at your business and help you hit that next level.",
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
            Your business runs, but only because you&apos;re in it. It&apos;s not scalable. At this
            stage, it&apos;s just a well-paying job.
          </p>
        </div>
      </section>

      {/* ── Agitation Section ── */}
      <section className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">the real cost</p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            every year you stay stuck
            <br />
            is another year of potential
            <br />
            growth—gone.
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md max-w-[680px]">
            Most service business owners at $800K spend three to five more years at $800K. Not
            because they lack ambition. But because, as long as nothing changes, their ceiling stays
            exactly where it is.
          </p>
          <div className="mt-xl bg-[#111111] border border-bone/10 p-10 rounded-card max-w-[620px]">
            <p className="font-obviously font-medium text-red lowercase text-[13px]">
              what staying here actually costs
            </p>
            <p className="font-tiempos-headline font-medium text-bone text-[20px] leading-[1.5] mt-4">
              Let&apos;s say you&apos;re at $800K today. Now let&apos;s say as a cohort member, you
              could grow 40% in year one. So by not joining now, you&apos;d be leaving $320,000 on
              the table this year alone. Over three years, that&apos;s close to $1M in foregone
              revenue.
            </p>
            <p className="font-tiempos-headline font-medium text-bone text-[20px] leading-[1.5] mt-4">
              Not because the opportunity wasn&apos;t there, but because you didn&apos;t have the
              right peers, the right architecture, to level up.
            </p>
            <p className="font-tiempos-headline font-medium text-bone text-[20px] leading-[1.5] mt-4">
              As a webinar attendee, your first year costs $10,000 flat. The question is never
              whether you can afford it. It&apos;s whether you can afford another year of sitting at
              this plateau.
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

      {/* ── Solution Bridge ── */}
      <section className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">
            the architecture that changes it
          </p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            what if that ceiling
            <br />
            disappeared this year?
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md max-w-[680px]">
            The operators who cross $2M, $5M, $10M aren&apos;t smarter or more disciplined than you.
            They&apos;ve just built something different: a business where their standards are baked
            into systems, the team operates from frameworks instead of their word, and the owner is
            working on the business instead of being the one holding it all together.
          </p>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-4 max-w-[680px]">
            Stanley Henry did that at attn:seeker. He&apos;s done the same for his clients. Now,
            he&apos;s building a room where operators get to do that together.
          </p>
          <p className="font-tiempos-headline font-medium text-bone text-[26px] max-w-[560px] mt-xl">
            The cohort exists to build that version of your business. You get the system, the peer
            group, and real access to someone who has already done what you&apos;re trying to do.
          </p>
        </div>
      </section>

      {/* ── Programme Introduction (Red Section) ── */}
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
            A 12-month peer group and coaching programme for service business owners who are ready to
            build the version of their business that runs on their standards, whether or not
            they&apos;re in the room. What you get: Monthly group coaching with Stanley Henry. Weekly
            implementation calls with the attn:seeker team. A real peer group of operators at your
            stage. And the full system behind 1.2 billion organic views, adapted for your business.
            Founding cohort. Starting 20 April 2026.
          </p>
          <div className="mt-[40px]">
            <Link
              href={APPLY_PATH}
              className="inline-block bg-bone text-black font-obviously font-medium lowercase text-[16px] px-8 py-4 rounded-button hover:bg-white"
            >
              claim this offer
            </Link>
          </div>
          <p className="font-obviously text-bone/70 lowercase text-[13px] mt-3">
            webinar attendees only. $10,000 for 12 months. offer closes 8 april 2026.
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
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
                body: "120-minute live session. An interactive call where you get real answers to what you're working through right now. Choose from APAC and US/UK time zone options. First Friday of each month. Recorded.",
              },
              {
                label: "weekly",
                title: "implementation calls",
                body: "60-minute sessions run by the attn:seeker team. This is where you get help executing on your goals for the month. Choose from APAC and US/UK time zone options.",
              },
              {
                label: "always on",
                title: "your peer group",
                body: "A private WhatsApp community for the full cohort, plus a small core group. Six operators at your stage, working the same problems. These are the peers you've always needed but never had—until now.",
              },
              {
                label: "quarterly",
                title: "90-day sprint reviews",
                body: "You'll set three goals per quarter and track your progress weekly. This is the accountability structure that keeps you building toward the year's objective instead of running on the treadmill.",
              },
              {
                label: "guest sessions",
                title: "expert access",
                body: "Live sessions with specialists in cashflow, HR, legal, AI, and sales systems throughout the year. Practical, specialised insights. All recorded.",
              },
              {
                label: "annual",
                title: "in-person retreat",
                body: "One cohort retreat per year. This is your chance to be in the same room with the other operators you're building alongside. Location TBC. The retreat is priced and invoiced separately — it is not included in your membership fee.",
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

      {/* ── What You Get ── */}
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
              Every component below is included in your membership. Nothing is upsold. No add-on
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
                "One full cohort retreat per year. Location TBC. The retreat is priced and invoiced separately — it is not included in your membership fee.",
              ],
              [
                "webinar attendee pricing — your first year",
                "$10,000 flat for 12 months. Save $25,880 on the standard rate ($35,880/year). Webinar attendee exclusive — offer closes 8 April 2026.",
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
          {/* Value stack */}
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
              As a webinar attendee: $10,000 flat for 12 months. That&apos;s $833 per month —
              less than a third of the standard rate.
            </p>
          </div>
        </div>
      </section>

      {/* ── Peer Group Section ── */}
      <section className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">
            who you&apos;ll be in the room with
          </p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            the group of true peers
            <br />
            you&apos;ve been looking for
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md max-w-[640px]">
            The founding cohort is strictly limited to 12 members. Small enough for everyone to know
            everyone&apos;s business. Large enough for genuine diversity of perspective.
          </p>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-4 max-w-[640px]">
            Members are service business owners doing $500K to $5M. Agency owners. Creative studio
            founders. Consultants. B2B service businesses. Different industries. Same stage. Same
            problem: they&apos;ve built something real, and they&apos;re ready to stop being the
            thing it depends on.
          </p>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-4 max-w-[640px]">
            If you&apos;re at this level, you already know what it&apos;s like to have nobody around
            you who gets it. Your team can&apos;t. Your clients won&apos;t. Your friends don&apos;t
            know the numbers. The peer group is the part of this programme that most members will
            say, looking back, they didn&apos;t know they needed as badly as they did.
          </p>
          <div className="grid grid-cols-3 mt-[64px]">
            {[
              { number: "$500K", label: "minimum annual revenue" },
              { number: "12", label: "founding member spots" },
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
              The application isn&apos;t for us. It&apos;s actually for you — and every future cohort
              member. The peer group only works when every member is at the right stage, with the
              right intention, and the right level of commitment. We review every application
              personally. If it&apos;s not a mutual fit, we&apos;ll tell you why.
            </p>
            <p className="font-tiempos-text text-bone text-[18px] leading-[1.6] mt-4 max-w-[640px]">
              Applying takes five minutes and commits you to nothing financially. If we think
              you&apos;re a fit, the next step is a 30-minute call with someone from the attn:seeker
              team.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stanley Section ── */}
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
                CEO, attn:seeker.
              </p>
              <p className="font-tiempos-text text-bone text-[18px] leading-[1.6] mt-6">
                Stanley Henry started attn:seeker in October 2019 with his co-founder and wife,
                Claire Henry. In seven years, it&apos;s grown to 18 people, 1.2 billion organic views
                for clients, 65,000 personal followers, 35,000 daily newsletter readers. The agency
                runs without Stanley in the weeds of every client account. That didn&apos;t happen by
                accident. It happened because he built the systems and people around him so the
                business can run whether he&apos;s in it or not. That&apos;s what he&apos;s teaching
                in the cohort.
              </p>
              <p className="font-tiempos-text text-bone text-[18px] leading-[1.6] mt-4">
                He&apos;s also built this publicly. Grew up in Manurewa, Auckland. One of four boys
                in a low-income household. Now documenting the journey to 40, talking plainly about
                what actually moves a business. No borrowed frameworks or generic advice. The actual
                system he built and the thinking behind it.
              </p>
              <p className="font-tiempos-text text-bone text-[18px] leading-[1.6] mt-4">
                The cohort exists because the questions he gets every week are the same ones he had
                five years ago. The right answer isn&apos;t a course. It&apos;s a peer group, a
                system, and someone who has already solved the problem you&apos;re in.
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

      {/* ── Testimonials / Social Proof ── */}
      <section className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-wide px-6 md:px-8">
          <div className="max-w-[560px] mb-[64px]">
            <p className="font-obviously font-medium text-red lowercase text-[14px]">
              results from the work
            </p>
            <h2
              className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
              style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
            >
              what working with
              <br />
              attn:seeker looks like
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                result: "15K to 110K followers. 50 million views. All in 20 days.",
                context:
                  "A buyers agent with a stagnant 15K following needed a strategy to break through. We built a single anchor content series. Twenty days later, they had 110K followers and 50M views — zero paid media.",
                client: "Fresh Start Advisory",
                category: "Buyers Agent · New Zealand",
              },
              {
                result: "The only region globally where Pizza Hut is growing.",
                context:
                  "A legacy brand dismissed by younger audiences. Three years of full-service social management later, Pizza Hut NZ averages 15–20M organic views per month and is the only major pizza brand gaining market share in NZ.",
                client: "Pizza Hut New Zealand",
                category: "Food & Beverage · 3-year partnership",
              },
              {
                result: "150,000 followers gained in 24 hours.",
                context:
                  "A fintech founder needed LinkedIn presence to support new business acquisition and investor confidence. We managed their personal brand and executed a targeted launch strategy that delivered 150K followers in a single day.",
                client: "Steven Zinsli",
                category: "Extraordinary · Fintech",
              },
            ].map((card, i) => (
              <div key={i} className="bg-[#111111] border border-bone/10 rounded-card p-6 flex flex-col">
                <div className="w-[35px] h-[2px] bg-red mb-4 flex-shrink-0" />
                <p className="font-tiempos-headline font-medium text-bone text-[20px] leading-[1.4]">
                  {card.result}
                </p>
                <p className="font-tiempos-text text-bone/55 text-[15px] leading-[1.5] mt-4 flex-grow">
                  {card.context}
                </p>
                <div className="mt-6 pt-5 border-t border-bone/10">
                  <p className="font-obviously-wide font-semibold lowercase text-bone text-[14px]">
                    {card.client}
                  </p>
                  <p className="font-obviously text-bone/40 lowercase text-[12px] mt-1">
                    {card.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="font-tiempos-fine text-bone/40 text-[13px] mt-8">
            These results are from attn:seeker&apos;s agency work. Cohort member results will be
            published from June 2026 as the founding cohort progresses.
          </p>
        </div>
      </section>

      {/* ── Methodology ── */}
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

      {/* ── Who This Is For / Not For ── */}
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
                  "You're running a service business doing $500K to $5M and you've hit a ceiling that more effort won't move.",
                  "You want to build systems and a team that operate without you in every decision.",
                  "You're ready to commit 3 to 5 hours per week to the programme and the peer group.",
                  "You want direct access to someone who has solved the problem you're in.",
                  "You understand that results come from implementation, not just attending the sessions.",
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
            If the first list felt like a mirror,{" "}
            <Link href={APPLY_PATH} className="text-red hover:underline">
              head here to claim this offer.
            </Link>
          </p>
        </div>
      </section>

      {/* ── Application Process ── */}
      <section id="apply" className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">how to apply</p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            i&apos;m interested.
            <br />
            what&apos;s next?
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md max-w-[580px]">
            If the Cohort sounds like the unlock you&apos;ve been looking for, here&apos;s how the
            application process works. No payment required at any stage until you&apos;ve had a
            30-minute fit call with the team.
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
              claim this offer
            </Link>
            <p className="font-obviously text-bone/55 lowercase text-[13px] mt-3">
              webinar attendee offer. closes 8 april 2026. 12 spots max.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-standard px-6 md:px-8">

          {/* Section intro */}
          <p className="font-obviously font-medium text-red lowercase text-[14px]">
            webinar attendee offer · closes 8 april 2026
          </p>
          <h2
            className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            act now
            <br />
            or pay $25,880 more later.
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-md max-w-[640px]">
            The standard rate for the attn:seeker Cohort Programme is $2,990 per month — $35,880 for
            a full year. As a webinar attendee, you pay $10,000 flat for your first 12 months.
            That&apos;s a saving of $25,880 in year one alone. This offer is available exclusively to
            webinar attendees and closes on 8 April 2026.
          </p>

          {/* Urgency bar */}
          <div className="bg-[#111111] border border-bone/10 rounded-card px-8 py-6 mt-xl">
            <div className="flex flex-col md:flex-row gap-6 md:gap-0">
              <div className="md:w-1/2 md:pr-8 md:border-r md:border-bone/15">
                <p className="font-obviously font-medium text-red lowercase text-[13px]">
                  offer closes
                </p>
                <p className="font-obviously-wide font-bold text-bone lowercase text-[28px] leading-tight mt-1">
                  8 april 2026
                </p>
                <p className="font-obviously text-bone/55 lowercase text-[13px] mt-1">
                  12 spots maximum
                </p>
              </div>
              <div className="md:w-1/2 md:pl-8">
                <p className="font-obviously font-medium text-red lowercase text-[13px]">
                  spots remaining
                </p>
                {/* Update this number manually as spots fill */}
                <p className="font-obviously-narrow font-black text-red text-[48px] leading-none mt-1">
                  12
                </p>
                <p className="font-obviously text-bone/55 lowercase text-[13px] mt-1">
                  update manually as spots fill
                </p>
              </div>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-xl">

            {/* Card 1: Standard rate (anchor) */}
            <div className="bg-white rounded-card p-8">
              <p className="font-obviously font-medium text-black/40 lowercase text-[13px]">
                standard rate — after 8 april 2026
              </p>
              <p className="font-obviously-narrow font-black text-black/40 text-[64px] leading-none mt-2">
                $35,880
              </p>
              <p className="font-obviously text-black/40 lowercase text-[14px]">per year + gst</p>
              <p className="font-tiempos-fine text-black/40 text-[14px] mt-1">
                $2,990 per month
              </p>
              <div className="border-t border-black/10 my-6" />
              <ul className="space-y-3">
                {[
                  "All programme inclusions",
                  "Standard monthly rate — not discounted",
                  "12-month minimum commitment",
                  "Available after offer closes",
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

            {/* Card 2: Webinar offer */}
            <div>
              <div className="inline-block bg-red text-bone font-obviously font-medium lowercase text-[12px] px-4 py-[6px] rounded-pill mb-0 relative z-10">
                webinar attendee only — closes 8 april 2026
              </div>
              <div className="bg-white rounded-card p-8 border-2 border-red -mt-[1px]">
                <p className="font-obviously font-medium text-red lowercase text-[13px]">
                  webinar attendee special — first 12 months
                </p>
                <p className="font-obviously-narrow font-black text-black text-[64px] leading-none mt-2">
                  $10,000
                </p>
                <p className="font-obviously text-black/55 lowercase text-[14px]">flat for 12 months + gst</p>
                <p className="font-tiempos-fine text-black/55 text-[14px] mt-1">
                  $833/month equivalent
                </p>
                <p className="font-tiempos-headline font-medium text-red text-[18px] mt-3">
                  $25,880 saved in year one vs. standard rate.
                </p>
                <div className="border-t border-black/10 my-6" />
                <ul className="space-y-3">
                  {[
                    "All programme inclusions",
                    "Flat $10,000 for your first 12 months",
                    "Standard rate ($2,990/month) applies from month 13",
                    "12-month minimum commitment",
                    "Exclusive to webinar attendees",
                    "Offer closes 8 April 2026",
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
                  claim this offer
                </Link>
                <p className="font-obviously text-black/55 lowercase text-[13px] mt-3 text-center">
                  takes less than 5 minutes. no payment required to apply.
                </p>
              </div>
            </div>
          </div>

          {/* What this decision is worth */}
          <div className="mt-xl max-w-[700px]">
            <p className="font-obviously font-medium text-red lowercase text-[14px]">
              what this decision is actually worth
            </p>
            <h3
              className="font-obviously-wide font-semibold lowercase text-bone leading-[1.1] mt-xs"
              style={{ fontSize: "32px" }}
            >
              $25,880 in year one. this offer does not return.
            </h3>
            <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-4">
              The standard rate is $2,990 per month — $35,880 for your first year. The webinar
              attendee offer is $10,000 flat. That&apos;s $25,880 you keep in year one. From month
              13, you&apos;re on the standard rate. There is no future version of this offer. When
              the 8 April deadline passes, it&apos;s gone.
            </p>
            <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-4">
              This is not a sale. It&apos;s an exclusive offer for people who attended the webinar
              and are serious about acting on what they heard.
            </p>
          </div>

          {/* Fine print */}
          <p className="font-tiempos-fine text-bone/40 text-[13px] mt-8 max-w-[700px]">
            All prices exclude GST. 12-month minimum commitment required. Webinar attendee special
            pricing of $10,000 is for the first 12 months only. Standard rate of $2,990/month applies
            from month 13 onwards. Offer available to webinar attendees only and closes 8 April 2026
            or when 12 spots are sold. Full terms in the Individual Member Agreement and Standard Terms
            and Conditions.
          </p>

        </div>
      </section>

      {/* ── FAQ ── */}
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

      {/* ── Final CTA ── */}
      <section className="bg-black border-t border-bone/10 py-[64px] md:py-3xl">
        <div className="mx-auto max-w-narrow px-6 md:px-8 text-center">
          <p className="font-obviously font-medium text-red lowercase text-[14px]">
            webinar attendee offer · closes 8 april 2026.
          </p>
          <h2
            className="font-obviously-wide font-bold lowercase text-bone leading-none mt-2"
            style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
          >
            save $25,880.
            <br />
            12 spots only.
            <br />
            one deadline.
          </h2>
          <p className="font-tiempos-text text-bone text-[20px] leading-[1.6] mt-6">
            The webinar attendee rate is $10,000 flat for 12 months. The standard rate is
            $2,990/month — $35,880 per year. That&apos;s a $25,880 saving, and this offer closes
            on 8 April 2026. Strictly 12 spots. When they&apos;re gone, they&apos;re gone.
          </p>
          <p className="font-tiempos-headline font-medium text-bone/70 text-[20px] leading-[1.5] mt-4">
            The business you actually want is on the other side of this decision.
          </p>
          <div className="mt-8">
            <p className="font-obviously-narrow font-black text-red text-[48px] leading-none">12</p>
            <p className="font-obviously text-bone/55 lowercase text-[14px] mt-1">
              spots available
            </p>
          </div>
          <div className="mt-8">
            <Link
              href={APPLY_PATH}
              className="inline-block bg-red text-bone font-obviously font-medium lowercase text-[16px] px-8 py-4 rounded-button hover:bg-dark-red"
            >
              claim this offer
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

      {/* ── Footer ── */}
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
                  { label: "claim this offer", href: APPLY_PATH },
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
              <nav className="flex flex-col gap-3">
                {[
                  { label: "cohort@attnseeker.com", href: "mailto:cohort@attnseeker.com" },
                  { label: "attnseeker.com", href: "https://attnseeker.com" },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="font-obviously text-bone lowercase text-[14px] hover:text-red"
                  >
                    {label}
                  </a>
                ))}
              </nav>
              <div className="mt-8">
                <p className="font-obviously font-medium text-bone/55 lowercase text-[12px] mb-3">
                  legal
                </p>
                <nav className="flex flex-col gap-2">
                  {[
                    { label: "privacy policy", href: "/privacy-policy" },
                    { label: "terms and conditions", href: "/terms-and-conditions" },
                  ].map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="font-obviously text-bone/55 lowercase text-[13px] hover:text-red"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          <div className="border-t border-bone/10 mt-[48px] pt-[32px] flex flex-col md:flex-row justify-between gap-4">
            <p className="font-obviously text-bone/30 lowercase text-[13px]">
              © {new Date().getFullYear()} wallace and henry house limited t/a attn:seeker. all rights reserved.
            </p>
            <p className="font-obviously text-bone/30 lowercase text-[13px]">
              auckland, new zealand
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
