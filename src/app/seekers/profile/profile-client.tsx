"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { useSeekers } from "@/hooks/use-seekers";
import {
  getUserProfile,
  updateProfile,
  updateEmailFrequency,
  deleteAccount,
  type XanoUserProfile,
  type XanoUpdateProfilePayload,
} from "@/lib/xano";

type Tab = "profile" | "email" | "account";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "profile" },
  { id: "email", label: "email preferences" },
  { id: "account", label: "account" },
];

const EMAIL_FREQUENCIES = [
  {
    value: "daily",
    label: "daily",
    description: "every weekday morning. never miss an issue.",
  },
  {
    value: "3x_week",
    label: "3x per week",
    description: "monday, wednesday, and friday. the highlights.",
  },
  {
    value: "sunday_digest",
    label: "sunday digest",
    description: "one weekly roundup every sunday. short and sweet.",
  },
];

const INDUSTRIES = [
  "advertising & marketing",
  "arts & entertainment",
  "construction",
  "education",
  "finance & insurance",
  "food & beverage",
  "health & wellness",
  "hospitality & tourism",
  "legal",
  "manufacturing",
  "media & publishing",
  "non-profit",
  "professional services",
  "real estate",
  "retail",
  "technology",
  "transport & logistics",
  "other",
];

const TIER_DOT: Record<string, string> = {
  bronze: "bg-amber-600",
  silver: "bg-gray-400",
  gold: "bg-yellow-500",
  platinum: "bg-gray-300",
  black: "bg-black",
};

type FormData = Omit<XanoUpdateProfilePayload, "email">;

const EMPTY: FormData = {
  first_name: "",
  last_name: "",
  phone_number: "",
  birthday: "",
  pronouns: "",
  street_address: "",
  suburb_city: "",
  region_state: "",
  postcode: "",
  country: "",
  job_title: "",
  company_name: "",
  industry: "",
  social_instagram: "",
  social_tiktok: "",
  social_linkedin: "",
  social_youtube: "",
  social_x: "",
  social_facebook: "",
  social_threads: "",
  website: "",
  referral_source: "",
};

function profileToForm(d: XanoUserProfile): FormData {
  const birthday = d.birthday
    ? (() => {
        try {
          return new Date(d.birthday as string).toISOString().split("T")[0];
        } catch {
          return d.birthday as string;
        }
      })()
    : "";
  return {
    first_name: d.first_name ?? "",
    last_name: d.last_name ?? "",
    phone_number: d.phone_number ?? "",
    birthday,
    pronouns: d.pronouns ?? "",
    street_address: d.street_address ?? "",
    suburb_city: d.suburb_city ?? "",
    region_state: d.region_state ?? "",
    postcode: d.postcode ?? "",
    country: d.country ?? "",
    job_title: d.job_title ?? "",
    company_name: d.company_name ?? "",
    industry: d.industry ?? "",
    social_instagram: d.social_instagram ?? "",
    social_tiktok: d.social_tiktok ?? "",
    social_linkedin: d.social_linkedin ?? "",
    social_youtube: d.social_youtube ?? "",
    social_x: d.social_x ?? "",
    social_facebook: d.social_facebook ?? "",
    social_threads: d.social_threads ?? "",
    website: d.website ?? "",
    referral_source: d.referral_source ?? "",
  };
}

// ── Shared input styles ───────────────────────────────────────────────────────
const input =
  "w-full rounded-[8px] border border-black/20 bg-white px-4 py-2.5 font-tiempos-text text-sm text-black transition-colors focus:border-red focus:outline-none placeholder:text-black/40";
const inputReadonly =
  "w-full cursor-not-allowed rounded-[8px] border border-black/10 bg-black/[0.03] px-4 py-2.5 font-tiempos-text text-sm text-black/40";
const sectionLabel =
  "mb-5 font-obviously text-[10px] font-medium uppercase tracking-[0.1em] text-red";
const card = "rounded-[8px] bg-white p-6";

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-obviously text-xs lowercase text-black/55">
        {label}
      </label>
      {children}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProfilePageClient() {
  const router = useRouter();
  const { user: authUser, isLoggedIn, logout } = useAuth();
  const { user: seekersUser, isLoading: seekersLoading } = useSeekers();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<XanoUserProfile | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [emailFrequency, setEmailFrequency] = useState("daily");
  const [freqSaving, setFreqSaving] = useState(false);
  const [freqMsg, setFreqMsg] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!authUser?.email) return;
    try {
      const data = await getUserProfile(authUser.email);
      if (data.code) return;
      setProfile(data);
      setForm(profileToForm(data));
      setEmailFrequency(data.email_frequency ?? "daily");
    } catch {
      /* silent */
    }
  }, [authUser?.email]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaveMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser?.email) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const payload: XanoUpdateProfilePayload = { email: authUser.email };
      (Object.keys(form) as Array<keyof FormData>).forEach((k) => {
        const v = (form[k] ?? "").trim();
        if (v && v !== "select industry") {
          (payload as unknown as Record<string, string>)[k] = v;
        }
      });
      const result = await updateProfile(payload);
      setSaveMsg(
        result.message === "Profile updated successfully"
          ? "saved!"
          : result.message ?? "error saving"
      );
    } catch {
      setSaveMsg("error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFreq = async () => {
    if (!authUser?.email) return;
    setFreqSaving(true);
    setFreqMsg(null);
    try {
      const result = await updateEmailFrequency(authUser.email, emailFrequency);
      setFreqMsg(result.success ? "saved!" : result.message ?? "error saving");
    } catch {
      setFreqMsg("error saving");
    } finally {
      setFreqSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleDelete = async () => {
    if (!authUser?.email) return;
    setDeleting(true);
    setDeleteErr(null);
    try {
      const result = await deleteAccount(authUser.email);
      if (result.success) {
        await logout();
        router.push("/?account=deleted");
      } else {
        setDeleteErr(result.message ?? "error deleting");
        setDeleting(false);
      }
    } catch {
      setDeleteErr("error deleting");
      setDeleting(false);
    }
  };

  if (!isLoggedIn || !authUser) {
    return (
      <div className="min-h-screen bg-bone py-24">
        <Container width="standard">
          <p className="font-tiempos-text text-black/60">
            Sign in to view your profile.
          </p>
        </Container>
      </div>
    );
  }

  const displayName =
    [form.first_name, form.last_name].filter(Boolean).join(" ") ||
    authUser.name;
  const initials =
    ((form.first_name?.[0] ?? "") + (form.last_name?.[0] ?? "")).toUpperCase() ||
    authUser.name.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-bone">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="border-b border-black/10 py-12 md:py-16">
        <Container width="standard">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red">
              <span className="font-obviously-wide text-xl font-bold text-bone">
                {initials}
              </span>
            </div>
            <div>
              <h1 className="font-obviously-wide text-[clamp(1.25rem,3vw,2rem)] font-bold leading-[1.1] lowercase">
                {displayName.toLowerCase()}
              </h1>
              <p className="mt-1 font-obviously text-xs text-black/40">
                {authUser.email}
                {profile?.membership_number && (
                  <> · member #{profile.membership_number}</>
                )}
              </p>
              {seekersUser && !seekersLoading && (
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      TIER_DOT[seekersUser.tier] ?? "bg-black"
                    }`}
                  />
                  <span className="font-obviously text-xs lowercase text-black/55">
                    {seekersUser.tier} tier
                  </span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* ── Tab nav ────────────────────────────────────────────────── */}
      <div className="border-b border-black/10">
        <Container width="standard">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-5 py-4 font-obviously text-sm font-medium lowercase transition-colors ${
                  activeTab === tab.id
                    ? "border-red text-red"
                    : "border-transparent text-black/50 hover:text-black/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="py-10 md:py-14">
        <Container width="standard">
          {/* ════ PROFILE TAB ════ */}
          {activeTab === "profile" && (
            <form onSubmit={handleSave} className="space-y-10">
              {/* Personal */}
              <section>
                <p className={sectionLabel}>personal</p>
                <div className={`${card} space-y-5`}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="first name">
                      <input
                        type="text"
                        value={form.first_name ?? ""}
                        onChange={(e) => set("first_name", e.target.value)}
                        className={input}
                        placeholder="first name"
                      />
                    </Field>
                    <Field label="last name">
                      <input
                        type="text"
                        value={form.last_name ?? ""}
                        onChange={(e) => set("last_name", e.target.value)}
                        className={input}
                        placeholder="last name"
                      />
                    </Field>
                  </div>
                  <Field label="email">
                    <input
                      type="email"
                      value={authUser.email}
                      readOnly
                      disabled
                      className={inputReadonly}
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="phone number">
                      <input
                        type="tel"
                        value={form.phone_number ?? ""}
                        onChange={(e) => set("phone_number", e.target.value)}
                        className={input}
                        placeholder="+64 21 000 000"
                      />
                    </Field>
                    <Field label="birthday">
                      <input
                        type="date"
                        value={form.birthday ?? ""}
                        onChange={(e) => set("birthday", e.target.value)}
                        className={input}
                      />
                    </Field>
                  </div>
                  <Field label="pronouns">
                    <input
                      type="text"
                      value={form.pronouns ?? ""}
                      onChange={(e) => set("pronouns", e.target.value)}
                      className={input}
                      placeholder="e.g. they/them"
                    />
                  </Field>
                </div>
              </section>

              {/* Address */}
              <section>
                <p className={sectionLabel}>address</p>
                <div className={`${card} space-y-5`}>
                  <Field label="street address">
                    <input
                      type="text"
                      value={form.street_address ?? ""}
                      onChange={(e) => set("street_address", e.target.value)}
                      className={input}
                      placeholder="123 main street"
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="suburb / city">
                      <input
                        type="text"
                        value={form.suburb_city ?? ""}
                        onChange={(e) => set("suburb_city", e.target.value)}
                        className={input}
                        placeholder="auckland"
                      />
                    </Field>
                    <Field label="region / state">
                      <input
                        type="text"
                        value={form.region_state ?? ""}
                        onChange={(e) => set("region_state", e.target.value)}
                        className={input}
                        placeholder="auckland"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="postcode">
                      <input
                        type="text"
                        value={form.postcode ?? ""}
                        onChange={(e) => set("postcode", e.target.value)}
                        className={input}
                        placeholder="1010"
                      />
                    </Field>
                    <Field label="country">
                      <input
                        type="text"
                        value={form.country ?? ""}
                        onChange={(e) => set("country", e.target.value)}
                        className={input}
                        placeholder="new zealand"
                      />
                    </Field>
                  </div>
                </div>
              </section>

              {/* Work */}
              <section>
                <p className={sectionLabel}>work</p>
                <div className={`${card} space-y-5`}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="job title">
                      <input
                        type="text"
                        value={form.job_title ?? ""}
                        onChange={(e) => set("job_title", e.target.value)}
                        className={input}
                        placeholder="marketing manager"
                      />
                    </Field>
                    <Field label="company">
                      <input
                        type="text"
                        value={form.company_name ?? ""}
                        onChange={(e) => set("company_name", e.target.value)}
                        className={input}
                        placeholder="company name"
                      />
                    </Field>
                  </div>
                  <Field label="industry">
                    <select
                      value={form.industry ?? ""}
                      onChange={(e) => set("industry", e.target.value)}
                      className={input}
                    >
                      <option value="">select industry</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </section>

              {/* Social */}
              <section>
                <p className={sectionLabel}>social & web</p>
                <div className={`${card} space-y-5`}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="instagram">
                      <input
                        type="text"
                        value={form.social_instagram ?? ""}
                        onChange={(e) => set("social_instagram", e.target.value)}
                        className={input}
                        placeholder="@handle"
                      />
                    </Field>
                    <Field label="tiktok">
                      <input
                        type="text"
                        value={form.social_tiktok ?? ""}
                        onChange={(e) => set("social_tiktok", e.target.value)}
                        className={input}
                        placeholder="@handle"
                      />
                    </Field>
                    <Field label="linkedin">
                      <input
                        type="text"
                        value={form.social_linkedin ?? ""}
                        onChange={(e) => set("social_linkedin", e.target.value)}
                        className={input}
                        placeholder="linkedin.com/in/yourname"
                      />
                    </Field>
                    <Field label="youtube">
                      <input
                        type="text"
                        value={form.social_youtube ?? ""}
                        onChange={(e) => set("social_youtube", e.target.value)}
                        className={input}
                        placeholder="@channel"
                      />
                    </Field>
                    <Field label="x / twitter">
                      <input
                        type="text"
                        value={form.social_x ?? ""}
                        onChange={(e) => set("social_x", e.target.value)}
                        className={input}
                        placeholder="@handle"
                      />
                    </Field>
                    <Field label="facebook">
                      <input
                        type="text"
                        value={form.social_facebook ?? ""}
                        onChange={(e) => set("social_facebook", e.target.value)}
                        className={input}
                        placeholder="facebook.com/yourpage"
                      />
                    </Field>
                    <Field label="threads">
                      <input
                        type="text"
                        value={form.social_threads ?? ""}
                        onChange={(e) => set("social_threads", e.target.value)}
                        className={input}
                        placeholder="@handle"
                      />
                    </Field>
                    <Field label="website">
                      <input
                        type="url"
                        value={form.website ?? ""}
                        onChange={(e) => set("website", e.target.value)}
                        className={input}
                        placeholder="https://yoursite.com"
                      />
                    </Field>
                  </div>
                </div>
              </section>

              {/* Other */}
              <section>
                <p className={sectionLabel}>other</p>
                <div className={card}>
                  <Field label="how did you hear about us?">
                    <input
                      type="text"
                      value={form.referral_source ?? ""}
                      onChange={(e) => set("referral_source", e.target.value)}
                      className={input}
                      placeholder="instagram, a friend, google..."
                    />
                  </Field>
                </div>
              </section>

              {/* Save */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-[8px] bg-red px-8 py-3 font-obviously text-sm font-medium lowercase text-bone transition-colors hover:bg-[#CC0000] disabled:opacity-60"
                >
                  {saving ? "saving..." : "save changes"}
                </button>
                {saveMsg && (
                  <span className="font-obviously text-xs text-black/55">
                    {saveMsg}
                  </span>
                )}
              </div>
            </form>
          )}

          {/* ════ EMAIL PREFERENCES TAB ════ */}
          {activeTab === "email" && (
            <div className="max-w-[560px]">
              <div className="mb-8">
                <h2 className="font-obviously-wide text-2xl font-semibold lowercase">
                  email preferences
                </h2>
                <p className="mt-2 font-tiempos-text text-sm text-black/60">
                  Choose how often you receive the YAP newsletter. Changes may
                  take up to 24 hours to apply.
                </p>
              </div>

              <div className="space-y-3">
                {EMAIL_FREQUENCIES.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setEmailFrequency(opt.value);
                      setFreqMsg(null);
                    }}
                    className={`w-full rounded-[8px] p-5 text-left transition-all ${
                      emailFrequency === opt.value
                        ? "border-2 border-red bg-red/[0.04]"
                        : "border border-black/15 bg-white hover:border-black/30"
                    }`}
                  >
                    <p
                      className={`font-obviously text-sm font-medium lowercase ${
                        emailFrequency === opt.value ? "text-red" : "text-black"
                      }`}
                    >
                      {opt.label}
                    </p>
                    <p className="mt-1 font-tiempos-text text-sm text-black/55">
                      {opt.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleSaveFreq}
                  disabled={freqSaving}
                  className="rounded-[8px] bg-red px-8 py-3 font-obviously text-sm font-medium lowercase text-bone transition-colors hover:bg-[#CC0000] disabled:opacity-60"
                >
                  {freqSaving ? "saving..." : "save preferences"}
                </button>
                {freqMsg && (
                  <span className="font-obviously text-xs text-black/55">
                    {freqMsg}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ════ ACCOUNT TAB ════ */}
          {activeTab === "account" && (
            <div className="max-w-[560px] space-y-10">
              {/* Stats */}
              {seekersUser && !seekersLoading && (
                <section>
                  <p className={sectionLabel}>your stats</p>
                  <div className={card}>
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                      {[
                        {
                          label: "status points",
                          value: seekersUser.statusPoints.toLocaleString(),
                        },
                        {
                          label: "yap dollars",
                          value: `$${seekersUser.yapDollars}`,
                          accent: true,
                        },
                        {
                          label: "day streak",
                          value: String(seekersUser.currentStreak),
                        },
                        {
                          label: "articles read",
                          value: String(seekersUser.articlesRead),
                        },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <p className="font-obviously text-[10px] uppercase tracking-[0.08em] text-black/40">
                            {stat.label}
                          </p>
                          <p
                            className={`mt-1 font-obviously-narrow text-3xl font-black leading-none ${
                              stat.accent ? "text-red" : "text-black"
                            }`}
                          >
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Membership */}
              {profile?.membership_number && (
                <section>
                  <p className={sectionLabel}>membership</p>
                  <div className={card}>
                    <p className="font-obviously text-[10px] uppercase tracking-[0.08em] text-black/40">
                      member number
                    </p>
                    <p className="mt-1 font-obviously-wide text-xl font-semibold lowercase">
                      #{profile.membership_number}
                    </p>
                    {seekersUser && (
                      <div className="mt-4 flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            TIER_DOT[seekersUser.tier] ?? "bg-black"
                          }`}
                        />
                        <span className="font-obviously text-sm font-medium lowercase text-black/70">
                          {seekersUser.tier} tier
                        </span>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Actions */}
              <section>
                <p className={sectionLabel}>account actions</p>
                <div className="space-y-3">
                  <div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-[8px] border border-black/20 px-6 py-3 font-obviously text-sm font-medium lowercase text-black transition-colors hover:border-black/40 hover:bg-black/[0.03]"
                    >
                      log out
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteOpen(true);
                        setDeleteErr(null);
                      }}
                      className="rounded-[8px] border border-red/40 px-6 py-3 font-obviously text-sm font-medium lowercase text-red transition-colors hover:bg-red/[0.05]"
                    >
                      delete account
                    </button>
                    <p className="mt-2 font-obviously text-xs text-black/40">
                      removes your seekers data. does not delete your
                      memberstack login.
                    </p>
                  </div>
                </div>
              </section>

              <p className="font-obviously text-xs text-black/40">
                need help?{" "}
                <a
                  href="mailto:hello@attnseeker.com"
                  className="text-red hover:underline"
                >
                  hello@attnseeker.com
                </a>
              </p>
            </div>
          )}
        </Container>
      </div>

      {/* ── Delete modal ───────────────────────────────────────────── */}
      {deleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteOpen(false);
          }}
        >
          <div className="mx-4 w-full max-w-md rounded-[8px] bg-white p-8">
            <h3 className="font-obviously-wide text-lg font-semibold lowercase">
              delete account
            </h3>
            <p className="mt-3 font-tiempos-text text-sm text-black/70">
              This will remove your seekers account and all your data. You can
              sign up again at any time. This does not delete your Memberstack
              login.
            </p>
            {deleteErr && (
              <p className="mt-3 font-obviously text-xs text-red">
                {deleteErr}
              </p>
            )}
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
                className="rounded-[8px] border border-black/20 px-5 py-2.5 font-obviously text-sm lowercase"
              >
                cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-[8px] bg-red px-5 py-2.5 font-obviously text-sm font-medium lowercase text-bone transition-colors hover:bg-[#CC0000] disabled:opacity-60"
              >
                {deleting ? "deleting..." : "yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
