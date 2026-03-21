import type { Metadata } from "next";
import Image from "next/image";
import { IMAGE_BASE } from "./constants";
import { CTA, ErcBlueprintFAQ } from "./erc-blueprint-client";

export const metadata: Metadata = {
  title: "The ERC Blueprint Session | The Attention Seeker",
  description:
    "A 60-minute strategy session where we build your Easily Repeatable Content Series from scratch. Includes pre-session research, custom blueprint, production plan, and 30 days of support. $697 NZD.",
  openGraph: {
    title: "The ERC Blueprint Session | The Attention Seeker",
    description:
      "A 60-minute strategy session where we build your Easily Repeatable Content Series from scratch. Includes pre-session research, custom blueprint, production plan, and 30 days of support. $697 NZD.",
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

const DELIVERABLES = [
  { title: "Custom Content Series Blueprint", desc: "Built around your specific business, audience, and expertise." },
  { title: "Pre-Session Research Brief", desc: "Competitive analysis, audience insights, and content gap opportunities." },
  { title: "90-Day Production Plan", desc: "Week-by-week schedule, content prompts, and distribution strategy." },
  { title: "Full call recording", desc: "Revisit the thinking behind every decision." },
  { title: "Written recap email", desc: "Key decisions, action items, and next steps." },
  { title: "30 days of email support", desc: "Questions answered as you start producing." },
];

export default function ErcBlueprintSessionPage() {
  return (
    <div className="min-h-screen">
      {/* Section 1: Hero — dark, text + hero-stanley image */}
      <section className="bg-black px-4 pt-[120px] pb-20 md:pt-[140px] md:pb-24">
        <div className="mx-auto w-full max-w-[900px]">
          <div className="md:grid md:grid-cols-[1fr,minmax(0,340px)] md:gap-10 md:items-start">
            <div className="min-w-0 max-w-full text-center md:text-left">
              <h1 className="font-obviously-wide text-[32px] font-black leading-tight text-white md:text-[56px]">
                the erc blueprint session
              </h1>
              <p className="mt-6 font-tiempos-text text-lg text-white/85 md:text-xl leading-relaxed">
                Stop guessing what to post. Walk away with a content series built around your business in 60 minutes.
              </p>
              <p className="mt-3 font-tiempos-text text-base text-white/75 md:text-lg">
                You learned the Easily Repeatable Content framework. Now let us build yours, with you, in a single focused session.
              </p>
              <div id="hero-cta" className="mt-8">
                <CTA fullWidthMobile={true} />
              </div>
            </div>
            <div className="relative mt-8 aspect-[3/4] w-full min-w-0 overflow-hidden rounded-lg md:mt-0 md:w-[340px] md:justify-self-end">
              <Image
                src={`${IMAGE_BASE}/hero-stanley.jpg`}
                alt="Stanley Henry"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, 340px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Problem — light */}
      <section className="bg-bone px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[720px]">
          <h2 className="font-obviously-wide text-[28px] font-black leading-tight text-black md:text-[40px]">
            you&apos;ve got the framework. but you&apos;re stuck on the &apos;now what.&apos;
          </h2>
          <div className="mt-8 space-y-6 font-tiempos-text text-base text-black/90 md:text-lg leading-[1.7]">
            <p>
              You came to the ERC webinar because you were tired of the content hamster wheel. Posting random stuff. Hoping something sticks. Watching competitors pump out content that seems effortless while you burn hours every week second-guessing yours.
            </p>
            <p>
              The webinar showed you there&apos;s a better way. A repeatable series. One concept. One format. Built once. Produced forever.
            </p>
            <p>
              But here&apos;s what happens for most people after the webinar: you open a blank doc, stare at it for 20 minutes, and realise that knowing the framework and applying it to YOUR specific business are two completely different things.
            </p>
            <p>
              What&apos;s your unique angle? What format fits your audience? What&apos;s the one insight that makes your series impossible to ignore?
            </p>
            <p>
              Those questions don&apos;t answer themselves. And every week you spend figuring it out alone is another week of random, draining content that doesn&apos;t compound.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Solution (How It Works) — dark, three cards */}
      <section className="bg-black px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[1000px]">
          <h2 className="font-obviously-wide text-center text-[28px] font-black leading-tight text-white md:text-[40px]">
            that&apos;s exactly what the erc blueprint session solves.
          </h2>
          <p className="mx-auto mt-6 max-w-[720px] text-center font-tiempos-text text-base text-white/85 md:text-lg leading-relaxed">
            A 60-minute working session where we sit down together and build your Easily Repeatable Content Series from the ground up. You don&apos;t need to come with the answers. You just need to show up.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
            <div className="relative border-t-4 border-red bg-white/5 p-6 md:pt-8">
              <span className="font-obviously text-sm font-semibold uppercase tracking-wide text-red">01 — before</span>
              <p className="mt-3 font-tiempos-text text-base text-white/90 leading-relaxed">
                Questionnaire, AI research, and pre-session brief so you come in ready to go.
              </p>
            </div>
            <div className="relative border-t-4 border-red bg-white/5 p-6 md:pt-8">
              <span className="font-obviously text-sm font-semibold uppercase tracking-wide text-red">02 — during</span>
              <p className="mt-3 font-tiempos-text text-base text-white/90 leading-relaxed">
                60-minute session: 15 min review, 30 min build your ERC, 15 min roadmap.
              </p>
            </div>
            <div className="relative border-t-4 border-red bg-white/5 p-6 md:pt-8">
              <span className="font-obviously text-sm font-semibold uppercase tracking-wide text-red">03 — after</span>
              <p className="mt-3 font-tiempos-text text-base text-white/90 leading-relaxed">
                Production plan, recording, recap, and 30-day email support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: What You Walk Away With — light, 2x3 grid */}
      <section className="bg-bone px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[900px]">
          <h2 className="font-obviously-wide text-[28px] font-black leading-tight text-black md:text-[40px]">
            what you walk away with
          </h2>
          <p className="mt-4 font-tiempos-text text-base text-black/85 md:text-lg">
            Everything you need to launch your content series, not just ideas.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {DELIVERABLES.map((d, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-red font-obviously text-lg font-bold">
                  ✓
                </span>
                <div>
                  <p className="font-obviously font-semibold text-black">{d.title}</p>
                  <p className="mt-1 font-tiempos-text text-sm text-black/80 md:text-base">{d.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 5: Social Proof — case studies (from /webinar/ERC) */}
      <section className="bg-black px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[900px]">
          <h2 className="font-obviously-wide text-h2-mobile font-black md:text-h2 text-white">
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
            <CTA label="Learn the System Behind These Results" fullWidthMobile={false} showMicro={false} />
          </div>
        </div>
      </section>

      {/* Section 6: FAQ — light, accordion */}
      <section className="bg-bone">
        <div className="mx-auto max-w-[800px] px-4">
          <h2 className="font-obviously-wide pt-16 text-[28px] font-black leading-tight text-black md:text-[40px]">
            frequently asked questions
          </h2>
        </div>
        <ErcBlueprintFAQ />
      </section>

      {/* Section 7: Final CTA — dark, bookend */}
      <section className="bg-black px-4 py-20 md:py-28">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="font-obviously-wide text-[28px] font-black leading-tight text-white md:text-[40px]">
            your content series is one session away.
          </h2>
          <p className="mt-6 font-tiempos-text text-base text-white/85 md:text-lg leading-relaxed">
            You already know the framework. You&apos;ve seen how it works. The only thing between you and a repeatable content engine is someone helping you build it for YOUR business.
          </p>
          <p className="mt-4 font-tiempos-text text-base text-white/85 md:text-lg leading-relaxed">
            That&apos;s what this session is. 60 minutes. One focused conversation. A complete blueprint you can start producing next week.
          </p>
          <div className="mt-10">
            <CTA fullWidthMobile={true} />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black py-8">
        <div className="mx-auto max-w-[800px] px-4 text-center">
          <Image
            src={`${IMAGE_BASE}/logo-attnseeker.png`}
            alt="The Attention Seeker"
            width={200}
            height={40}
            className="mx-auto h-8 w-auto object-contain opacity-80"
          />
          <p className="mt-4 font-tiempos-text text-sm text-white/60">
            © {new Date().getFullYear()} The Attention Seeker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
