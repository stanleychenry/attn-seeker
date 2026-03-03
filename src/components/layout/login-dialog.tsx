"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button, Input } from "@/components/ui";

export function LoginDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    sendLoginCode,
    confirmLoginCode,
    sendSignupCode,
    confirmSignupCode,
  } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  // Reset step when switching tabs or opening
  useEffect(() => {
    if (open) {
      setStep("email");
      setCode("");
      setError("");
    }
  }, [open, tab]);

  if (!open) return null;

  const hasMemberstack = typeof process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY === "string" &&
    process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY.length > 0;

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      if (tab === "login") {
        await sendLoginCode(email);
      } else {
        await sendSignupCode(email, name || undefined);
      }
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "couldn't send code. try again.");
    } finally {
      setSending(false);
    }
  }

  async function handleConfirmCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (tab === "login") {
        await confirmLoginCode(email, code);
      } else {
        await confirmSignupCode(email, code, name || undefined);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "invalid code. try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hasMemberstack) {
    return (
      <div
        ref={dropdownRef}
        className="absolute right-0 top-full z-50 mt-2 w-[340px] rounded-lg border border-black/10 bg-white p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
aria-label="log in or sign up"
    >
      <p className="font-obviously text-sm text-black/70">
          login is not configured. set <code className="rounded bg-black/10 px-1">NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY</code> in .env.local (memberstack dashboard → settings → application).
        </p>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full z-50 mt-2 w-[340px] rounded-lg border border-black/10 bg-white p-6 shadow-lg"
      role="dialog"
      aria-modal="true"
      aria-label="log in or sign up"
    >
      <div className="mb-6 flex gap-6 border-b border-black/10">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={cn(
            "font-obviously font-medium lowercase text-[16px] pb-2 -mb-px border-b-2 transition-colors",
            tab === "login"
              ? "border-red text-black"
              : "border-transparent text-black/55 hover:text-black"
          )}
        >
          log in
        </button>
        <button
          type="button"
          onClick={() => setTab("signup")}
          className={cn(
            "font-obviously font-medium lowercase text-[16px] pb-2 -mb-px border-b-2 transition-colors",
            tab === "signup"
              ? "border-red text-black"
              : "border-transparent text-black/55 hover:text-black"
          )}
        >
          sign up
        </button>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendCode} className="flex flex-col gap-4">
          {tab === "signup" && (
            <Input
              label="name"
              type="text"
              placeholder="your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <Input
            label="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="font-obviously text-sm text-red">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={sending}>
            {sending ? "sending..." : tab === "login" ? "send login code" : "send signup code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleConfirmCode} className="flex flex-col gap-4">
          <p className="font-obviously text-sm text-black/70">
            we just sent you a 6-digit code. check your inbox and paste the code below.
          </p>
          <Input
            label="code"
            type="text"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            required
          />
          {error && <p className="font-obviously text-sm text-red">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={submitting || code.length !== 6}>
            {submitting
              ? tab === "signup"
                ? "creating account..."
                : "logging in..."
              : tab === "signup"
                ? "create account"
                : "log in"}
          </Button>
          <button
            type="button"
            className="font-obviously text-sm text-black/55 hover:text-red"
            onClick={() => setStep("email")}
          >
            use a different email
          </button>
        </form>
      )}
    </div>
  );
}
