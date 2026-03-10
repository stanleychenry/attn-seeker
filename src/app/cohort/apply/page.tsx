"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  businessType: string;
  revenue: string;
  biggestChallenge: string;
  twelveMonthGoal: string;
  hearAbout: string;
};

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  businessName: "",
  businessType: "",
  revenue: "",
  biggestChallenge: "",
  twelveMonthGoal: "",
  hearAbout: "",
};

const inputClass =
  "w-full bg-white border border-black rounded-card px-4 py-3 font-tiempos-text text-black text-[16px] focus:outline-none focus:border-red placeholder:text-black/40";
const labelClass =
  "block font-obviously font-medium lowercase text-[14px] text-black mb-2";

export default function CohortApplyPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cohort/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong. Please try again or email cohort@attnseeker.com directly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bone min-h-screen">
      {/* Simple nav */}
      <nav className="bg-bone border-b border-black/10 py-5">
        <div className="mx-auto max-w-standard px-6 md:px-8 flex items-center justify-between">
          <Link href="/cohort">
            <span className="font-obviously-wide font-bold text-red lowercase text-[22px]">
              attn:seeker
            </span>
          </Link>
          <Link
            href="/cohort"
            className="font-obviously font-medium lowercase text-black text-[14px] hover:text-red"
          >
            back to programme
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-narrow px-6 md:px-8 py-[64px]">
        {submitted ? (
          <div className="bg-white rounded-card p-10 text-center">
            <h2 className="font-obviously-wide font-semibold lowercase text-black text-[32px] md:text-[36px]">
              application received
            </h2>
            <p className="font-tiempos-text text-black text-[18px] leading-[1.6] mt-4 max-w-[480px] mx-auto">
              Thank you for applying. We&apos;ll review your application and be in touch within 48
              hours. If it looks like a strong fit, we&apos;ll schedule a 30-minute call with Stanley
              or a member of the team.
            </p>
            <Link
              href="/cohort"
              className="inline-block mt-8 bg-red text-bone font-obviously font-medium lowercase text-[16px] px-8 py-4 rounded-button hover:bg-dark-red"
            >
              back to the programme
            </Link>
          </div>
        ) : (
          <>
            <h2 className="font-obviously-wide font-semibold lowercase text-black text-[28px] md:text-[36px] mb-2">
              apply for the founding cohort
            </h2>
            <p className="font-tiempos-text text-black/55 text-[18px] mb-10">
              We review every application personally. No payment required at this stage.
            </p>

            <form onSubmit={handleSubmit} className="bg-white rounded-card p-6 md:p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>first name *</label>
                  <input
                    type="text"
                    required
                    className={inputClass}
                    value={form.firstName}
                    onChange={set("firstName")}
                  />
                </div>
                <div>
                  <label className={labelClass}>last name *</label>
                  <input
                    type="text"
                    required
                    className={inputClass}
                    value={form.lastName}
                    onChange={set("lastName")}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>email address *</label>
                <input
                  type="email"
                  required
                  className={inputClass}
                  value={form.email}
                  onChange={set("email")}
                />
              </div>

              <div>
                <label className={labelClass}>business name *</label>
                <input
                  type="text"
                  required
                  placeholder="business name · website url"
                  className={inputClass}
                  value={form.businessName}
                  onChange={set("businessName")}
                />
              </div>

              <div>
                <label className={labelClass}>what type of business do you run? *</label>
                <select
                  required
                  className={inputClass}
                  value={form.businessType}
                  onChange={set("businessType")}
                >
                  <option value="" disabled>
                    select one
                  </option>
                  <option>Agency</option>
                  <option>Creative or digital studio</option>
                  <option>Coaching or consulting</option>
                  <option>Professional services</option>
                  <option>E-commerce or DTC</option>
                  <option>Other service business</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>current annual revenue (approximate) *</label>
                <select
                  required
                  className={inputClass}
                  value={form.revenue}
                  onChange={set("revenue")}
                >
                  <option value="" disabled>
                    select one
                  </option>
                  <option>Under $250K</option>
                  <option>$250K to $500K</option>
                  <option>$500K to $1M</option>
                  <option>$1M to $2.5M</option>
                  <option>$2.5M to $5M</option>
                  <option>Over $5M</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  what&apos;s the biggest thing holding your business back right now? *
                </label>
                <textarea
                  required
                  maxLength={500}
                  rows={5}
                  placeholder="Be specific. What's the actual problem?"
                  className={`${inputClass} resize-none`}
                  value={form.biggestChallenge}
                  onChange={set("biggestChallenge")}
                />
                <p className="font-obviously text-black/40 text-[12px] mt-1">
                  {form.biggestChallenge.length}/500
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  what do you want to have built in the next 12 months? *
                </label>
                <textarea
                  required
                  maxLength={500}
                  rows={5}
                  placeholder="What does success look like for you in April 2027?"
                  className={`${inputClass} resize-none`}
                  value={form.twelveMonthGoal}
                  onChange={set("twelveMonthGoal")}
                />
                <p className="font-obviously text-black/40 text-[12px] mt-1">
                  {form.twelveMonthGoal.length}/500
                </p>
              </div>

              <div>
                <label className={labelClass}>how did you hear about the cohort?</label>
                <select
                  className={inputClass}
                  value={form.hearAbout}
                  onChange={set("hearAbout")}
                >
                  <option value="">select one (optional)</option>
                  <option>Stanley&apos;s social media</option>
                  <option>YAP newsletter</option>
                  <option>Colleague or peer</option>
                  <option>Google search</option>
                  <option>attn:seeker website</option>
                  <option>Other</option>
                </select>
              </div>

              {error && (
                <p className="font-obviously text-red text-[14px]">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red text-bone font-obviously font-medium lowercase text-[16px] py-4 rounded-button hover:bg-dark-red disabled:opacity-50"
              >
                {loading ? "submitting..." : "submit my application"}
              </button>

              <p className="font-tiempos-fine text-black/40 text-[13px]">
                By submitting this form you agree to be contacted by attn:seeker about your
                application. No payment is required at this stage. We&apos;ll respond within 48
                hours.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
