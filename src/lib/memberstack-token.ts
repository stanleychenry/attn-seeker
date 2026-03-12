/**
 * Get the current Memberstack JWT so we can send it to Xano for authentication.
 * Token is stored in localStorage ("_ms-mid") or cookie ("_ms-mid") by @memberstack/dom.
 * Only runs in the browser; returns null on the server.
 */
const TOKEN_KEY = "_ms-mid";

export function getMemberstackToken(): string | null {
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
