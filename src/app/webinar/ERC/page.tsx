import type { Metadata } from "next";
import Image from "next/image";
import { EVENT_DATE, EVENT_TIME, IMAGE_BASE } from "./constants";
import { ErcLandingClient, CTA } from "./erc-landing-client";

export const metadata: Metadata = {
  title: "The Easily Repeatable Content System | Live Workshop",
  description:
    "The exact framework behind 1 billion+ organic views, taught live in 90 minutes. $79 NZD. Join the workshop and learn how to build your own Easily Repeatable Content series.",
  openGraph: {
    title: "The Easily Repeatable Content System | Live Workshop",
    description:
      "The exact framework behind 1 billion+ organic views, taught live in 90 minutes. $79 NZD.",
    images: [{ url: `${IMAGE_BASE}/hero-stanley.jpg` }],
  },
};

const CASE_STUDIES = [
  {
    image: `${IMAGE_BASE}/case-freshstart.png`,
    alt: "Fresh Start Advisory content series",
    name: "Fresh Start Advisory",
    metric: "10,000 to 110,000 followers in 19 days",
    copy: "One content series. One variable. Posted daily. Tens of millions of views.",
    url: "https://www.instagram.com/reel/DQuv9RCk2yy",
  },
  {
    image: `${IMAGE_BASE}/case-harification.png`,
    alt: "Harification series",
    name: "Harification",
    metric: "16 to 170,000 followers in 30 days",
    copy: "The series? A girl wearing a pot on her head talking about not washing her hair. 78 million views. 5x their sales.",
    url: "https://www.tiktok.com/@hairification_haircare/video/7340830092773297415",
  },
  {
    image: `${IMAGE_BASE}/case-toughyarns.png`,
    alt: "Tough Yarns series",
    name: "Tough Yarns",
    metric: "0 to 100,000 followers in 100 days",
    copy: "A guy from Queenstown doing difficult things with strangers. Same format every day. The only variable was who he talked to. He didn't know how to edit. He just sped up the boring parts. 10 million views.",
    url: "https://www.instagram.com/reel/DM7IJ4ZTaq7",
  },
  {
    image: `${IMAGE_BASE}/case-sparkmedia.jpg`,
    alt: "Spark Media App series",
    name: "Spark Media App",
    metric: "0 to 25,000 followers in 2 weeks",
    copy: "No followers. No budget. No team. Just a founder and his retired dad doing simple videos in the same format every day.",
    url: "https://www.instagram.com/reel/DTtztiZAaoI/",
  },
  {
    image: `${IMAGE_BASE}/case-extraordinary.png`,
    alt: "Extraordinary series",
    name: "Extraordinary",
    metric: "0 to 120,000 followers in 24 hours",
    copy: "Not a fluke. A system. When you have one focused content series the algorithm can latch onto, these numbers aren't magic. They're expected.",
    url: "https://www.tiktok.com/@extraordinary_global/video/7370940304003779860",
  },
  {
    image: `${IMAGE_BASE}/case-ragebait.png`,
    alt: "RAGEBAIT series",
    name: "RAGEBAIT (our own series)",
    metric: "100 million views",
    copy: "Filmed in 20 minutes a day. Our agency had five content ideas last year. Five. We repeated them all year and generated hundreds of millions of views.",
    url: "https://www.instagram.com/reel/DNe5gMgJ2kp",
  },
];

const LEARN_ITEMS = [
  "How to find your one ERC idea, the single content series you can repeat every day without running out of things to say.",
  "The \"one variable\" rule that separates content that goes viral from content that gets ignored. If more than one thing changes between your videos, you haven't got it yet.",
  "How to film and post your ERC in 20 minutes a day, even if you have no team, no budget, and no editing skills.",
  "Why you don't need five content pillars, a content calendar, or a new idea every day, and what to do instead.",
  "The exact process we use to turn one ERC into hundreds of millions of views for our clients, from Auckland to the world.",
  "How to know when to keep going and when your series needs adjusting. Most people quit before the system kicks in. We'll show you when to push through and when to pivot.",
];

const INCLUDED_ITEMS = [
  "The full 90-minute live workshop where we teach the complete ERC system, step by step.",
  "Live Q&A at the end where you can ask about your specific business, niche, or content challenges. We answer as many questions as we can.",
  "The full recording sent to you after the event, so you can rewatch anytime.",
  "All the slides from the presentation, yours to keep and reference.",
  "A complete AI-generated summary of everything covered, including all Q&A answers, broken down into an easy reference guide you can use while creating your first ERC.",
];

const AUDIENCE_ITEMS = [
  {
    title: "Small business owners",
    body: "You're a small business owner and nobody's ever told you what to actually do on social media. You don't need a content team or a marketing budget. You need a system.",
  },
  {
    title: "Marketing managers",
    body: "You're a marketing manager expected to \"grow social\" on top of everything else. You don't need a content calendar with 47 post types. You need one series you can hand to anyone and say \"do this every day.\"",
  },
  {
    title: "Social media managers",
    body: "You're a social media manager whose actual job is graphic designer, copywriter, photographer, videographer, strategist, and therapist, all for one salary. This will simplify your entire job.",
  },
  {
    title: "Coaches and consultants",
    body: "You're a coach, consultant, or service provider posting motivational quotes and hoping someone books a discovery call. You need something that actually builds trust in your audience's feed every single day.",
  },
  {
    title: "Hospitality and local business",
    body: "You run a restaurant, cafe, bar, hotel, or any local business and your social media is just product photos that look like everyone else's.",
  },
  {
    title: "E-commerce and product brands",
    body: "You sell products online and your content strategy is product shots with a discount code in the caption.",
  },
  {
    title: "Real estate agents",
    body: "You're a real estate agent posting the same property walkthroughs with royalty-free music as every other agent in your market.",
  },
];

export default function ErcWebinarPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-20 text-white md:pb-0">
      {/* Section 1: Hero — text block first, portrait image (hero-stanley) beside on desktop, below on mobile */}
      <section className="px-4 pt-8 pb-12 md:pt-16 md:pb-20">
        <div className="mx-auto w-full max-w-[900px]">
          <div className="md:grid md:grid-cols-[1fr,minmax(0,340px)] md:gap-10 md:items-start">
            <div className="min-w-0 max-w-full">
              <h1 className="font-obviously-wide text-h1-mobile font-black leading-tight lowercase text-white md:text-h1">
                get your first 10K followers
              </h1>
              <p className="mt-4 font-tiempos-text text-body-lg-mobile text-white/90 md:text-body-lg">
                The exact framework behind 1 billion+ organic views, taught live
                in 90 minutes.
              </p>
              <p className="mt-2 font-obviously text-body-sm text-red md:text-body">
                Live Workshop | {EVENT_DATE}, {EVENT_TIME} | 90 Minutes | $79 NZD
              </p>
              <div id="hero-cta" className="mt-6">
                <CTA>Get Your Spot for $79 NZD</CTA>
              </div>
            </div>
            <div className="relative mt-8 aspect-[3/4] w-full min-w-0 overflow-hidden rounded-lg md:mt-0 md:w-[340px]">
              <Image
                src={`${IMAGE_BASE}/hero-stanley.jpg`}
                alt="Stanley Henry presenting"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, 340px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Problem */}
      <section className="border-t border-white/10 py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-4">
          <p className="font-obviously text-h5 text-red md:text-h5">
            Problem
          </p>
          <p className="mt-3 font-tiempos-text text-body-mobile text-white/90 md:text-body">
            You&apos;re posting every day and nothing&apos;s moving.
          </p>
          <p className="mt-4 font-tiempos-text text-body-mobile text-white/90 md:text-body">
            You&apos;re making reels, carousels, stories, TikToks. You&apos;re jumping on
            trending audio. You&apos;re trying five different content pillars. You&apos;re
            spending hours every week creating content that gets 200 views and
            zero leads.
          </p>
          <p className="mt-4 font-tiempos-text text-body-mobile text-white/90 md:text-body">
            It&apos;s not because you&apos;re bad at content. It&apos;s because you&apos;re making
            it too hard.
          </p>
        </div>
      </section>

      {/* Section 3: Agitation */}
      <section className="border-t border-white/10 py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-4">
          <p className="font-obviously text-h5 text-red md:text-h5">
            Agitation
          </p>
          <p className="mt-3 font-tiempos-text text-body-mobile text-white/90 md:text-body">
            Here&apos;s what nobody tells you about social media growth: the biggest
            creators and the fastest-growing brands don&apos;t create more content.
            They create less. Way less. They find one thing that works and they
            repeat it. Every single day.
          </p>
          <p className="mt-4 font-tiempos-text text-body-mobile text-white/90 md:text-body">
            The biggest creator on TikTok has done the same video format for six
            years straight. 162 million followers. Not from variety. From
            repetition.
          </p>
          <p className="mt-4 font-tiempos-text text-body-mobile text-white/90 md:text-body">
            Meanwhile, you&apos;re burning out trying to come up with something new
            every day. And the algorithm doesn&apos;t know what to do with you
            because you keep changing the recipe.
          </p>
        </div>
      </section>

      {/* Section 4: Solution Introduction */}
      <section className="border-t border-white/10 py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-4">
          <p className="font-obviously text-h5 text-red md:text-h5">
            Solution
          </p>
          <p className="mt-3 font-tiempos-text text-body-mobile text-white/90 md:text-body">
            There&apos;s a better way. We call it an Easily Repeatable Content series,
            or ERC.
          </p>
          <p className="mt-4 font-tiempos-text text-body-mobile text-white/90 md:text-body">
            One format. One variable. 20 minutes a day. Posted daily.
          </p>
          <p className="mt-4 font-tiempos-text text-body-mobile text-white/90 md:text-body">
            That&apos;s the entire system. And it&apos;s responsible for over a billion
            organic views across our agency and our clients in the last year
            alone.
          </p>
          <p className="mt-4 font-tiempos-text text-body-mobile text-white/90 md:text-body">
            On {EVENT_DATE}, we&apos;re teaching the full system in a live 90-minute
            workshop. No fluff. No &quot;content pillars&quot; lecture. Just the exact
            framework we use for every client, broken down step by step so you
            can build your own ERC and start posting it the next day.
          </p>
          <div className="mt-6">
            <CTA>Join the Live Workshop for $79 NZD</CTA>
          </div>
        </div>
      </section>

      {/* Section 5: Proof / Case Studies */}
      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-[900px] px-4">
          <h2 className="font-obviously-wide text-h2-mobile font-black md:text-h2">
            This system works. Here&apos;s what happened when our clients used it.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CASE_STUDIES.map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <div className="relative aspect-[9/16] w-full">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="font-obviously text-body-sm font-semibold text-red">
                    {c.metric}
                  </p>
                  <p className="mt-1 font-obviously text-body-sm font-semibold text-white">
                    {c.name}
                  </p>
                  <p className="mt-2 font-tiempos-text text-body-sm-mobile text-white/90">
                    {c.copy}
                  </p>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-10 text-center">
            <CTA>Learn the System Behind These Results</CTA>
          </div>
        </div>
      </section>

      {/* Section 6: What You'll Learn */}
      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-[600px] px-4">
          <h2 className="font-obviously-wide text-h2-mobile font-black md:text-h2">
            What we&apos;ll cover in 90 minutes
          </h2>
          <ol className="mt-8 space-y-6">
            {LEARN_ITEMS.map((text, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red font-obviously text-sm font-bold">
                  {i + 1}
                </span>
                <p className="font-tiempos-text text-body-mobile text-white/90 pt-0.5 md:text-body">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Section 7: What\u2019s Included */}
      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-[600px] px-4">
          <h2 className="font-obviously-wide text-h2-mobile font-black md:text-h2">
            Everything you get for $79 NZD
          </h2>
          <ul className="mt-8 space-y-4">
            {INCLUDED_ITEMS.map((text, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-red">✓</span>
                <p className="font-tiempos-text text-body-mobile text-white/90 md:text-body">
                  {text}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <CTA>Get Your Spot for $79 NZD</CTA>
          </div>
        </div>
      </section>

      {/* Section 8: Who This Is For */}
      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-[600px] px-4">
          <h2 className="font-obviously-wide text-h2-mobile font-black md:text-h2">
            This workshop is for you if...
          </h2>
          <div className="mt-8 space-y-6">
            {AUDIENCE_ITEMS.map((a) => (
              <div
                key={a.title}
                className="group rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-red hover:bg-red hover:shadow-lg"
              >
                <p className="font-obviously text-body font-semibold text-white transition-colors duration-200 group-hover:text-white">
                  {a.title}
                </p>
                <p className="mt-2 font-tiempos-text text-body-sm-mobile text-white/90 transition-colors duration-200 group-hover:text-white/95 md:text-body">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: About */}
      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-[600px] px-4 md:max-w-[800px]">
          <h2 className="font-obviously-wide text-h2-mobile font-black md:text-h2">
            Who&apos;s teaching this?
          </h2>
          <div className="mt-8 md:flex md:gap-10 md:items-start">
            <div className="relative aspect-[4/3] w-full max-w-[400px] overflow-hidden rounded-lg md:flex-shrink-0">
              <Image
                src={`${IMAGE_BASE}/about-stanley.jpg`}
                alt="Stanley Henry"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                loading="lazy"
              />
            </div>
            <div className="mt-6 flex flex-1 flex-col md:mt-0">
              <p className="font-tiempos-text text-body-mobile text-white/90 md:text-body">
                Stanley Henry, founder of a 20-person agency based in Auckland,
                New Zealand.
              </p>
              <p className="mt-4 font-tiempos-text text-body-mobile text-white/90 md:text-body">
                1.4 million followers across our social media profiles. Over 1
                billion organic views generated every year across our agency and
                our clients. No paid ads. No giveaways. No buying followers. All
                organic, all from little old Auckland.
              </p>
              <p className="mt-4 font-tiempos-text text-body-mobile text-white/90 md:text-body">
                We built a global agency by following one basic principle:
                Easily Repeatable Content. This workshop is the first time we&apos;re
                teaching the full system publicly, step by step.
              </p>
            </div>
          </div>
          <div className="mt-10 w-full">
            <Image
              src={`${IMAGE_BASE}/logo-attnseeker.png`}
              alt="The Attention Seeker"
              width={800}
              height={120}
              className="h-auto w-full object-contain object-left"
              loading="lazy"
            />
            <div className="mt-6 w-full">
              <CTA className="block w-full text-center">
                Get Your Spot for $79 NZD
              </CTA>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: FAQ (client component) */}
      <ErcLandingClient />

      {/* Section 11: Final CTA */}
      <section className="border-t border-white/10 bg-white/5 py-16 md:py-24">
        <div className="mx-auto max-w-[600px] px-4 text-center">
          <h2 className="font-obviously-wide text-h2-mobile font-black md:text-h2">
            One format. One variable. 20 minutes a day.
          </h2>
          <p className="mt-4 font-tiempos-text text-body-mobile text-white/90 md:text-body">
            Stop overcomplicating your content. Join us on {EVENT_DATE} and
            learn the exact system behind over 1 billion organic views.
          </p>
          <div className="mt-8">
            <CTA>Get Your Spot for $79 NZD</CTA>
          </div>
        </div>
      </section>

      {/* Section 12: Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-[600px] px-4 text-center">
          <p className="font-tiempos-text text-caption text-white/60">
            © 2026 The Attention Seeker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
