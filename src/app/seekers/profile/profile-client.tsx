"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heading, Section, Container } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { useSeekers } from "@/hooks/use-seekers";
import {
  getUserProfile,
  updateProfile,
  updateEmailFrequency,
  deleteAccount,
  type XanoUserProfile,
} from "@/lib/xano";

const TIER_DOT_COLOR: Record<string, string> = {
  bronze: "bg-amber-600",
  silver: "bg-gray-400",
  gold: "bg-yellow-500",
  platinum: "bg-gray-300",
  black: "bg-black",
};

const EMAIL_FREQUENCIES = [
  { value: "daily", label: "daily" },
  { value: "weekly", label: "weekly" },
  { value: "monthly", label: "monthly" },
  { value: "none", label: "none" },
];

export default function ProfilePageClient() {
  const router = useRouter();
  const { user: authUser, isLoggedIn, logout } = useAuth();
  const { user: seekersUser, activity, isLoading: seekersLoading } = useSeekers();

  const [profile, setProfile] = useState<XanoUserProfile | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- setProfileLoading used for future loading UI
  const [profileLoading, setProfileLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [emailFrequency, setEmailFrequency] = useState("daily");
  const [frequencySaving, setFrequencySaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!authUser?.email) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    try {
      const data = await getUserProfile();
      if (data.code) {
        setProfile(null);
        return;
      }
      setProfile(data);
      setFirstName(data.first_name ?? authUser.name.split(/\s+/)[0] ?? "");
      setLastName(data.last_name ?? authUser.name.split(/\s+/).slice(1).join(" ") ?? "");
      setEmailFrequency(data.email_frequency ?? "daily");
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, [authUser?.email, authUser?.name]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser?.email) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      const result = await updateProfile({
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
      });
      if (result.message === "Profile updated successfully") {
        setSaveMessage("saved!");
      } else {
        setSaveMessage(result.message ?? "error saving");
      }
    } catch {
      setSaveMessage("error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFrequency = async () => {
    if (!authUser?.email) return;
    setFrequencySaving(true);
    try {
      const result = await updateEmailFrequency(emailFrequency);
      if (result.success) {
        setSaveMessage("email preference saved");
      } else {
        setSaveMessage(result.message ?? "error saving");
      }
    } catch {
      setSaveMessage("error saving");
    } finally {
      setFrequencySaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleConfirmDelete = async () => {
    if (!authUser?.email) return;
    setDeleting(true);
    try {
      const result = await deleteAccount();
      if (result.success) {
        await logout();
        router.push("/?account=deleted");
      } else {
        setSaveMessage(result.message ?? "error deleting");
        setDeleting(false);
      }
    } catch {
      setSaveMessage("error deleting");
      setDeleting(false);
    }
  };

  if (!isLoggedIn || !authUser) {
    return (
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <p className="font-tiempos-text text-black/60">
            sign in to view your profile.
          </p>
        </Container>
      </Section>
    );
  }

  const displayName =
    [firstName, lastName].filter(Boolean).join(" ") || authUser.name;
  const initials = (firstName[0] ?? "") + (lastName[0] ?? "") || authUser.name.slice(0, 2).toUpperCase();
  const stats = seekersUser
    ? [
        { label: "status points", value: seekersUser.statusPoints.toLocaleString() },
        { label: "yap dollars", value: `$${seekersUser.yapDollars}`, color: "text-red" },
        { label: "day streak", value: `${seekersUser.currentStreak} days` },
        { label: "articles read", value: String(seekersUser.articlesRead) },
      ]
    : [];

  return (
    <>
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red">
            <span className="font-obviously-wide text-2xl font-bold text-bone">
              {initials}
            </span>
          </div>
          <h1 className="mt-5 font-obviously-wide text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.1]">
            {displayName.toLowerCase()}
          </h1>
          <p className="mt-2 font-obviously text-xs text-black/40">
            {authUser.email}
            {profile?.membership_number && (
              <> · membership #{profile.membership_number}</>
            )}
          </p>
          {seekersUser && (
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  TIER_DOT_COLOR[seekersUser.tier] ?? "bg-black"
                }`}
              />
              <span className="font-obviously text-sm font-medium text-black/70">
                {seekersUser.tier} tier
              </span>
            </div>
          )}
        </Container>
      </Section>

      {stats.length > 0 && (
        <Section background="bone" padding="none" className="pt-0">
          <Container width="standard">
            <div className="rounded-lg bg-white p-6">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-obviously text-xs text-black/55">
                      {stat.label}
                    </p>
                    <p
                      className={`mt-1 font-obviously-narrow text-2xl font-black leading-none ${
                        (stat as { color?: string }).color ?? "text-black"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      <Section background="bone" padding="none" className="py-8 md:py-12">
        <Container width="standard">
          <Heading level={2} className="mb-6">
            edit profile
          </Heading>
          <form
            onSubmit={handleSaveProfile}
            className="space-y-5 rounded-lg bg-white p-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block font-obviously text-xs text-black/55">
                  first name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-black/20 bg-white px-4 py-2.5 font-tiempos-text text-sm transition-colors focus:border-red focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-obviously text-xs text-black/55">
                  last name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-black/20 bg-white px-4 py-2.5 font-tiempos-text text-sm transition-colors focus:border-red focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-obviously text-xs text-black/55">
                email
              </label>
              <input
                type="email"
                value={authUser.email}
                readOnly
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-black/10 bg-black/[0.03] px-4 py-2.5 font-tiempos-text text-sm text-black/40"
              />
            </div>

            <div className="border-t border-black/5 pt-2">
              <p className="mb-2 font-obviously text-xs text-black/55">
                email frequency
              </p>
              <div className="flex flex-wrap gap-2">
                {EMAIL_FREQUENCIES.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEmailFrequency(opt.value)}
                    className={`rounded-full px-4 py-2 font-obviously text-xs ${
                      emailFrequency === opt.value
                        ? "border-2 border-red bg-red/5 text-red"
                        : "border border-black/20 text-black/70"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleSaveFrequency}
                disabled={frequencySaving}
                className="mt-2 rounded-full border border-black/20 px-4 py-2 font-obviously text-xs text-black/60"
              >
                {frequencySaving ? "saving…" : "save email preference"}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-red px-8 py-2.5 font-obviously text-xs font-medium text-bone transition-colors hover:bg-red/90"
              >
                {saving ? "saving…" : "save changes"}
              </button>
              {saveMessage && (
                <span className="ml-3 font-obviously text-xs text-black/55">
                  {saveMessage}
                </span>
              )}
            </div>
          </form>
        </Container>
      </Section>

      {!seekersLoading && activity.length > 0 && (
        <Section
          background="bone"
          padding="none"
          className="border-t border-black/10 py-8 md:py-12"
        >
          <Container width="standard">
            <Heading level={2} className="mb-6">
              activity history
            </Heading>
            <div className="max-h-[500px] divide-y divide-black/5 overflow-y-auto rounded-lg bg-white">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="font-tiempos-text text-sm text-black/80">
                      {item.description}
                    </p>
                    <p className="mt-0.5 font-obviously text-[10px] text-black/40">
                      {new Date(item.timestamp).toLocaleDateString("en-NZ", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <span className="ml-4 shrink-0 font-obviously-narrow text-sm font-black text-red">
                    +{item.pointsEarned} pts
                  </span>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section
        background="bone"
        padding="none"
        className="border-t border-black/10 py-8 md:py-16"
      >
        <Container width="standard">
          <div className="flex flex-col items-start gap-4">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-black/20 px-6 py-2.5 font-obviously text-xs font-medium text-black/60 transition-colors hover:border-black/40"
            >
              log out
            </button>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="rounded-full border border-red/50 px-6 py-2.5 font-obviously text-xs font-medium text-red transition-colors hover:bg-red/10"
            >
              delete account
            </button>
            <p className="font-obviously text-xs text-black/40">
              need help? email{" "}
              <a
                href="mailto:hello@attnseeker.com"
                className="text-red hover:underline"
              >
                hello@attnseeker.com
              </a>
            </p>
          </div>
        </Container>
      </Section>

      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-4 max-w-md rounded-lg bg-white p-6">
            <h3 className="font-obviously-wide text-lg font-semibold">
              delete account
            </h3>
            <p className="mt-2 font-tiempos-text text-sm text-black/70">
              This will remove your seekers account and data. You can sign up
              again later. This does not delete your Memberstack login.
            </p>
            {saveMessage && (
              <p className="mt-2 font-obviously text-xs text-red">{saveMessage}</p>
            )}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="rounded-full border border-black/20 px-5 py-2.5 font-obviously text-xs"
              >
                cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="rounded-full bg-red px-5 py-2.5 font-obviously text-xs font-medium text-bone"
              >
                {deleting ? "deleting…" : "delete account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
