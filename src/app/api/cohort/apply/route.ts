import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.COHORT_EMAIL ?? process.env.CONTACT_TO_EMAIL ?? "hello@attnseeker.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
const FROM_NAME = process.env.CONTACT_FROM_NAME ?? "attn:seeker cohort";

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

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const businessName = String(body.businessName ?? "").trim();
  const businessType = String(body.businessType ?? "").trim();
  const revenue = String(body.revenue ?? "").trim();
  const biggestChallenge = String(body.biggestChallenge ?? "").trim();
  const twelveMonthGoal = String(body.twelveMonthGoal ?? "").trim();
  const hearAbout = String(body.hearAbout ?? "").trim();

  if (!firstName || !lastName || !email || !businessName || !businessType || !revenue || !biggestChallenge || !twelveMonthGoal) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const text = [
    `New cohort application`,
    ``,
    `Name: ${firstName} ${lastName}`,
    `Email: ${email}`,
    `Business: ${businessName}`,
    `Business type: ${businessType}`,
    `Annual revenue: ${revenue}`,
    `How they heard: ${hearAbout || "(not specified)"}`,
    ``,
    `Biggest challenge holding business back:`,
    biggestChallenge,
    ``,
    `What they want to build in 12 months:`,
    twelveMonthGoal,
  ].join("\n");

  const resend = new Resend(RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [TO_EMAIL],
    replyTo: email,
    subject: `Cohort application: ${firstName} ${lastName} (${businessName})`,
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
