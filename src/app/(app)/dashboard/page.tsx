"use client";

import { useAuth } from "@/hooks/use-auth";

const CLIENT_PLAN_ID = process.env.NEXT_PUBLIC_MEMBERSTACK_CLIENT_PLAN_ID ?? "";
const STAFF_PLAN_ID = process.env.NEXT_PUBLIC_MEMBERSTACK_STAFF_PLAN_ID ?? "";

export default function DashboardPage() {
  const { user } = useAuth();

  const isStaff = user?.planIds.includes(STAFF_PLAN_ID);
  const isClient = user?.planIds.includes(CLIENT_PLAN_ID);

  const label = isStaff ? "staff dashboard" : isClient ? "client dashboard" : "dashboard";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="font-obviously-wide font-semibold text-2xl lowercase text-black">
        {label}
      </h1>
      <p className="font-obviously text-sm lowercase text-black/50">
        welcome, {user?.name}. this is where your dashboard will live.
      </p>
    </div>
  );
}
