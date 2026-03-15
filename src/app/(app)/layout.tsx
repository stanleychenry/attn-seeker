"use client";

import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

const CLIENT_PLAN_ID = process.env.NEXT_PUBLIC_MEMBERSTACK_CLIENT_PLAN_ID ?? "";
const STAFF_PLAN_ID = process.env.NEXT_PUBLIC_MEMBERSTACK_STAFF_PLAN_ID ?? "";
const MAIN_URL = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL.replace(/^https?:\/\/app\./, "https://")
  : "https://attnseeker.com";

function AppAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      window.location.href = `${MAIN_URL}/seekers/login`;
      return;
    }

    const hasAccess =
      user?.planIds.includes(CLIENT_PLAN_ID) ||
      user?.planIds.includes(STAFF_PLAN_ID);

    if (!hasAccess) {
      window.location.href = MAIN_URL;
    }
  }, [isLoading, isLoggedIn, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bone">
        <p className="font-obviously text-sm lowercase text-black/50">loading...</p>
      </div>
    );
  }

  const hasAccess =
    user?.planIds.includes(CLIENT_PLAN_ID) ||
    user?.planIds.includes(STAFF_PLAN_ID);

  if (!isLoggedIn || !hasAccess) return null;

  return <>{children}</>;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-bone font-tiempos-text text-black antialiased">
        <AppAuthGuard>{children}</AppAuthGuard>
      </div>
    </AuthProvider>
  );
}
