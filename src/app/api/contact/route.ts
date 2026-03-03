import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "hello@attnseeker.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
const FROM_NAME = process.env.CONTACT_FROM_NAME ?? "attn:seeker contact form";

export async function POST(request: NextRequest) {
  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email is not configured. Add RESEND_API_KEY to your environment." },
      { status: 503 }
    );
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  const phone = String(body.phone ?? "").trim();
  const company = String(body.company ?? "").trim();
  const website = String(body.website ?? "").trim();
  const socialHandle = String(body.socialHandle ?? "").trim();
  const budget = String(body.budget ?? "").trim();
  const hearAbout = String(body.hearAbout ?? "").trim();
  const goals = String(body.goals ?? "").trim();

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "(not provided)"}`,
    `Company: ${company || "(not provided)"}`,
    `Website: ${website || "(not provided)"}`,
    `Best Social Handle: ${socialHandle || "(not provided)"}`,
    `Monthly Budget: ${budget || "(not selected)"}`,
    `How did you hear about us?: ${hearAbout || "(not provided)"}`,
    "",
    "Tell us about your goals:",
    goals || "(not provided)",
  ].join("\n");

  const resend = new Resend(RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [TO_EMAIL],
    replyTo: email,
    subject: `Contact form: ${name}`,
    text,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to send email" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
