/**
 * Get the current Memberstack access token so we can send it to Xano for authentication.
 * Uses the Memberstack SDK's getCurrentMember() to retrieve tokens.accessToken.
 * Falls back to reading _ms-mid from localStorage/cookie if the SDK call fails.
 * Only runs in the browser; returns null on the server.
 */
import { getMemberstack } from "@/lib/memberstack";

const TOKEN_KEY = "_ms-mid";

function getMemberstackTokenSync(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const fromStorage = localStorage.getItem(TOKEN_KEY);
    if (fromStorage) return fromStorage;
    const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_KEY}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export async function getMemberstackToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const ms = await getMemberstack();
    if (!ms) return getMemberstackTokenSync();
    const res = await ms.getCurrentMember();
    const data = (res as { data?: unknown })?.data ?? res;
    const token = (data as { tokens?: { accessToken?: string } })?.tokens?.accessToken;
    return token ?? getMemberstackTokenSync();
  } catch {
    return getMemberstackTokenSync();
  }
}
