/**
 * MemberStack DOM client – init only in browser, singleton.
 * Dynamic import avoids loading @memberstack/dom on the server (it uses localStorage).
 * Uses NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY (from MemberStack dashboard: Settings → Application → Memberstack App ID).
 * For dev use Test Mode key (pk_sb_...) from Dev Tools; for production use Live key (pk_...).
 */

type MemberstackDOM = typeof import("@memberstack/dom").default;
export type MemberstackInstance = ReturnType<MemberstackDOM["init"]>;

let instance: MemberstackInstance | null = null;

export async function getMemberstack(): Promise<MemberstackInstance | null> {
  if (typeof window === "undefined") return null;
  const key = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
  if (!key || key === "") return null;
  if (!instance) {
    const memberstackDOM = (await import("@memberstack/dom")).default;
    instance = memberstackDOM.init({
      publicKey: key,
      useCookies: true,
      setCookieOnRootDomain: true,
    });
  }
  return instance;
}
