"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export function SignupForm() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { sendSignupCode, confirmSignupCode } = useAuth();

  const hasMemberstack =
    typeof process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY === "string" &&
    process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY.length > 0;

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await sendSignupCode(email, name || undefined);
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "couldn't send signup code. try again.");
    } finally {
      setSending(false);
    }
  }

  async function handleConfirmCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await confirmSignupCode(email, code, name || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "invalid code. try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bone px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <Link href="/">
            <span className="font-obviously-wide text-[48px] font-bold leading-none text-black">
              a:
            </span>
          </Link>
        </div>

        <h2 className="text-center font-obviously-wide text-2xl font-bold">
          join the seekers
        </h2>
        <p className="mt-2 text-center font-obviously text-sm text-black/70">
          you&apos;re in the right place, this is for the seekers
        </p>

        {!hasMemberstack ? (
          <div className="mt-8 rounded-lg border border-black/20 bg-white p-4">
            <p className="font-obviously text-sm text-black/70">
              signup is not configured. set{" "}
              <code className="rounded bg-black/10 px-1">
                NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY
              </code>{" "}
              in .env.local (memberstack dashboard → settings → application).
            </p>
          </div>
        ) : step === "email" ? (
          <form className="mt-8 space-y-4" onSubmit={handleSendCode}>
            <p className="font-obviously text-sm font-medium text-red">
              create an account
            </p>
            <div>
              <label className="mb-1.5 block font-obviously text-xs text-black/55">
                name
              </label>
              <input
                type="text"
                placeholder="your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-tiempos-text text-sm placeholder:text-black/30 transition-colors focus:border-red focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-obviously text-xs text-black/55">
                email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-tiempos-text text-sm placeholder:text-black/30 transition-colors focus:border-red focus:outline-none"
                required
              />
            </div>
            {error && (
              <p className="font-obviously text-sm text-red">{error}</p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="mt-2 w-full rounded-full bg-red py-3 font-obviously text-sm font-medium text-bone transition-colors hover:bg-red/90 disabled:opacity-50"
            >
              {sending ? "sending..." : "send signup code"}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleConfirmCode}>
            <p className="font-obviously text-sm text-black/70">
              we just sent you a 6-digit code.
              <br />
              check your inbox and paste the code below.
            </p>
            <div>
              <label className="mb-1.5 block font-obviously text-xs text-black/55">
                code
              </label>
              <input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-tiempos-text text-sm placeholder:text-black/30 transition-colors focus:border-red focus:outline-none"
                required
              />
            </div>
            {error && (
              <p className="font-obviously text-sm text-red">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting || code.length !== 6}
              className="mt-2 w-full rounded-full bg-red py-3 font-obviously text-sm font-medium text-bone transition-colors hover:bg-red/90 disabled:opacity-50"
            >
              {submitting ? "creating account..." : "create account"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="mt-2 w-full font-obviously text-sm text-black/55 hover:text-red"
            >
              use a different email
            </button>
          </form>
        )}

        <div className="mt-8 space-y-2 text-center">
          <p>
            <Link
              href="/seekers/login"
              className="font-obviously text-xs text-black/40 transition-colors hover:text-red"
            >
              already have an account? login here
            </Link>
          </p>
          <p>
            <Link
              href="/"
              className="font-obviously text-xs text-black/40 transition-colors hover:text-red"
            >
              back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
