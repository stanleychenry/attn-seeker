"use client";

import { useState } from "react";
import {
  Heading,
  Body,
  Button,
  Card,
  Caption,
  Section,
  Container,
  SectionIntro,
} from "@/components/ui";

const BUDGET_OPTIONS = [
  "under $5K",
  "$5-$10K",
  "$10-$20K",
  "$20-50K",
  "$50K+",
];

const CONTACT_EMAIL = "hello@attnseeker.com";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    socialHandle: "",
    budget: "",
    hearAbout: "",
    goals: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          website: form.website,
          socialHandle: form.socialHandle,
          budget: form.budget,
          hearAbout: form.hearAbout,
          goals: form.goals,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data?.error ?? "Something went wrong. Please try again or email us directly.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* 1. Hero */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <Caption className="block text-red">contact</Caption>
          <Heading level={1} className="mt-4">
            let&apos;s talk
          </Heading>
          <Body
            size="large"
            className="mt-6 max-w-[700px] text-black/70"
          >
            for agency enquiries, fill out the form below. for everything else,
            email us directly.
          </Body>
        </Container>
      </Section>

      {/* 2. Contact form */}
      <Section background="bone" padding="none" className="pb-16 pt-0">
        <Container width="narrow">
          <Card className="rounded-lg p-8">
            {submitted ? (
              <div className="py-12 text-center">
                <Heading level={2}>thanks for reaching out</Heading>
                <Body className="mt-4 text-black/70">
                  we&apos;ve received your message and will get back to you within 24 hours.
                </Body>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block font-obviously text-sm font-medium text-red">
                    your name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-tiempos-text text-base text-black placeholder:text-black/30 transition-colors focus:border-red focus:outline-none focus:ring-1 focus:ring-red"
                    placeholder="kevan hedwig"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-obviously text-sm font-medium text-red">
                    email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-tiempos-text text-base text-black placeholder:text-black/30 transition-colors focus:border-red focus:outline-none focus:ring-1 focus:ring-red"
                    placeholder="hello@attnseeker.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-obviously text-sm font-medium text-red">
                    phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-tiempos-text text-base text-black placeholder:text-black/30 transition-colors focus:border-red focus:outline-none focus:ring-1 focus:ring-red"
                    placeholder="555-5555"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-obviously text-sm font-medium text-red">
                    company name
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-tiempos-text text-base text-black placeholder:text-black/30 transition-colors focus:border-red focus:outline-none focus:ring-1 focus:ring-red"
                    placeholder="attn:seeker"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-obviously text-sm font-medium text-red">
                    website
                  </label>
                  <input
                    type="text"
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                    className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-tiempos-text text-base text-black placeholder:text-black/30 transition-colors focus:border-red focus:outline-none focus:ring-1 focus:ring-red"
                    placeholder="www.attnseeker.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-obviously text-sm font-medium text-red">
                    best social handle to see your brand
                  </label>
                  <input
                    type="text"
                    value={form.socialHandle}
                    onChange={(e) =>
                      setForm({ ...form, socialHandle: e.target.value })
                    }
                    className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-tiempos-text text-base text-black placeholder:text-black/30 transition-colors focus:border-red focus:outline-none focus:ring-1 focus:ring-red"
                    placeholder="www.instagram.com/theattnseek"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-obviously text-sm font-medium text-red">
                    monthly budget
                  </label>
                  <select
                    value={form.budget}
                    onChange={(e) =>
                      setForm({ ...form, budget: e.target.value })
                    }
                    className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-tiempos-text text-base text-black transition-colors focus:border-red focus:outline-none focus:ring-1 focus:ring-red"
                  >
                    <option value="">Select budget</option>
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block font-obviously text-sm font-medium text-red">
                    how did you hear about us?
                  </label>
                  <input
                    type="text"
                    value={form.hearAbout}
                    onChange={(e) =>
                      setForm({ ...form, hearAbout: e.target.value })
                    }
                    className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-tiempos-text text-base text-black placeholder:text-black/30 transition-colors focus:border-red focus:outline-none focus:ring-1 focus:ring-red"
                    placeholder="from your socials"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-obviously text-sm font-medium text-red">
                    tell us about your goals
                  </label>
                  <input
                    type="text"
                    value={form.goals}
                    onChange={(e) =>
                      setForm({ ...form, goals: e.target.value })
                    }
                    className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-tiempos-text text-base text-black placeholder:text-black/30 transition-colors focus:border-red focus:outline-none focus:ring-1 focus:ring-red"
                    placeholder="go viral"
                  />
                </div>
                {submitError && (
                  <p className="font-obviously text-sm text-red">{submitError}</p>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  className="mt-6 w-full"
                  disabled={sending}
                >
                  {sending ? "sending…" : "submit"}
                </Button>
                <p className="mt-4 text-center font-obviously text-sm font-medium text-red">
                  prefer email?{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="underline hover:no-underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </form>
            )}
          </Card>
          <p className="mt-6 text-center font-tiempos-text text-base text-black/50">
            Or email us directly at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-red hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </Container>
      </Section>

      {/* 3. Other ways to connect */}
      <Section background="bone" padding="none" className="py-16">
        <Container width="wide">
          <SectionIntro heading="other ways to connect" align="center" />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="flex h-full flex-col p-6">
              <Heading level={3}>newsletter</Heading>
              <Body size="small" className="mt-2 text-black/70">
                join 35,000+ readers getting weekly insights on organic social.
              </Body>
              <Button
                variant="ghost"
                href="/join-the-seekers"
                className="mt-auto pt-4"
              >
                subscribe
              </Button>
            </Card>
            <Card className="flex h-full flex-col p-6">
              <Heading level={3}>events</Heading>
              <Body size="small" className="mt-2 text-black/70">
                workshops, talks, and gatherings for brands and creators.
              </Body>
              <Button
                variant="ghost"
                href="/events"
                className="mt-auto pt-4"
              >
                see events
              </Button>
            </Card>
            <Card className="flex h-full flex-col p-6">
              <Heading level={3}>careers</Heading>
              <Body size="small" className="mt-2 text-black/70">
                want to join the team? see what roles are open.
              </Body>
              <Button
                variant="ghost"
                href="/agency/careers"
                className="mt-auto pt-4"
              >
                open roles
              </Button>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
