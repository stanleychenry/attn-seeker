import { Linkedin } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok-icon";
import {
  Heading,
  Body,
  Button,
  Caption,
  Section,
  Container,
  SectionIntro,
  Stat,
} from "@/components/ui";

export const metadata = {
  title: "about | attn:seeker",
  description:
    "the story behind the attention seeker. how we built 2m+ followers and 1.2b+ organic views, and why we started helping brands do the same.",
};

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero */}
      <Section background="bone" padding="none" className="py-24 md:py-32">
        <Container width="standard">
          <Heading level={1}>we exist to do cool shit</Heading>
          <Body
            size="large"
            className="mt-6 max-w-[700px] text-black/70"
          >
            the attention seeker started with a simple idea: if you want to help
            brands grow on social, you should prove you can do it yourself first.
            so we did.
          </Body>
        </Container>
      </Section>

      {/* 2. The story */}
      <Section background="bone" padding="none" className="py-8 md:py-16">
        <Container width="content">
          <div className="space-y-6">
            <Body className="text-black/70">
              The name goes back to the 1920s, when ATTN: was the standard way
              to direct someone&apos;s attention in business correspondence. A
              century later, attention is the most valuable currency in
              marketing, and most brands are losing the battle for it.
            </Body>
            <Body className="text-black/70">
              We started by building our own audience. No clients, no pitch
              decks, just content. We grew to over two million followers across
              our own channels and generated more than a billion organic views.
              We figured if we could do it for ourselves, we could do it for
              anyone.
            </Body>
          </div>
          <div className="my-8 aspect-video w-full bg-black/5" />
          <div className="space-y-6">
            <Body className="text-black/70">
              Today we work with challenger brands across five countries,
              helping them win attention without paid ads. Every strategy we
              recommend is one we&apos;ve tested on our own channels first.
            </Body>
          </div>
        </Container>
      </Section>

      {/* 3. Stats bar */}
      <Section background="black" padding="none" className="py-16 md:py-24">
        <Container width="full">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            <Stat
              value="2m+"
              label="followers built"
              className="[&>span:first-child]:text-4xl [&>span:first-child]:text-red [&>span:first-child]:md:text-5xl [&>span:last-child]:mt-1 [&>span:last-child]:text-sm [&>span:last-child]:text-bone/70"
            />
            <Stat
              value="1.2b+"
              label="organic views"
              className="[&>span:first-child]:text-4xl [&>span:first-child]:text-red [&>span:first-child]:md:text-5xl [&>span:last-child]:mt-1 [&>span:last-child]:text-sm [&>span:last-child]:text-bone/70"
            />
            <Stat
              value="5"
              label="countries"
              className="[&>span:first-child]:text-4xl [&>span:first-child]:text-red [&>span:first-child]:md:text-5xl [&>span:last-child]:mt-1 [&>span:last-child]:text-sm [&>span:last-child]:text-bone/70"
            />
            <Stat
              value="0"
              label="paid ads"
              className="[&>span:first-child]:text-4xl [&>span:first-child]:text-red [&>span:first-child]:md:text-5xl [&>span:last-child]:mt-1 [&>span:last-child]:text-sm [&>span:last-child]:text-bone/70"
            />
          </div>
        </Container>
      </Section>

      {/* 4. The founder */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <div className="flex flex-col gap-8 md:flex-row md:gap-12">
            <div className="w-full shrink-0 md:w-[320px]">
              <div className="aspect-square w-full overflow-hidden bg-black/5 md:w-[320px]" />
            </div>
            <div className="flex-1">
              <Caption className="block text-red">founder</Caption>
              <Heading level={2} className="mt-2">
                stanley henry
              </Heading>
              <div className="mt-6 space-y-4">
                <Body className="text-black/70">
                  Stanley started The Attention Seeker because he believed the
                  best marketing doesn&apos;t feel like marketing. It feels like
                  content worth watching.
                </Body>
                <Body className="text-black/70">
                  Before TAS, he spent years studying what makes people stop
                  scrolling. The answer was always the same: originality,
                  authenticity, and a willingness to take creative risks.
                </Body>
                <Body className="text-black/70">
                  He now leads a team across five countries, working with brands
                  that want to challenge the status quo and win attention on
                  their own terms.
                </Body>
              </div>
              <div className="mt-4 flex gap-3">
                <a
                  href="#"
                  className="text-black/40 transition-colors hover:text-red"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="#"
                  className="text-black/40 transition-colors hover:text-red"
                  aria-label="TikTok"
                >
                  <TikTokIcon size={18} />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. Our values */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="wide">
          <SectionIntro
            eyebrow="values"
            heading="what we stand for"
          />
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <Heading level={3}>own it</Heading>
              <Body size="small" className="mt-2 text-black/70">
                we trust our people to take ownership. no micromanaging, no
                hand-holding. you run your work and we back you to deliver.
              </Body>
            </div>
            <div>
              <Heading level={3}>back each other</Heading>
              <Body size="small" className="mt-2 text-black/70">
                we&apos;re a team before anything else. we celebrate wins
                together and show up for each other when things get tough.
              </Body>
            </div>
            <div>
              <Heading level={3}>never settle</Heading>
              <Body size="small" className="mt-2 text-black/70">
                good enough isn&apos;t in our vocabulary. we push for better
                work, better thinking, and better results, every single day.
              </Body>
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. CTA */}
      <Section background="red" padding="none" className="py-16 md:py-24">
        <Container width="standard" className="text-center">
          <Heading level={2} className="text-bone">
            want to work with us?
          </Heading>
          <Body size="large" className="mt-4 text-bone/70">
            we partner with challenger brands ready to grow through organic
            social.
          </Body>
          <Button
            variant="secondary"
            href="/agency/contact"
            className="mt-6 bg-black text-bone hover:bg-black/90"
          >
            get in touch
          </Button>
        </Container>
      </Section>
    </>
  );
}
