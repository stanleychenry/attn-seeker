"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getMemberstack } from "@/lib/memberstack";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  /** Send 6-digit login code to email (passwordless). */
  sendLoginCode: (email: string) => Promise<void>;
  /** Complete login with the 6-digit code from email. */
  confirmLoginCode: (email: string, code: string) => Promise<void>;
  /** Send 6-digit signup code to email (passwordless). */
  sendSignupCode: (email: string, name?: string) => Promise<void>;
  /** Complete signup with the 6-digit code from email. */
  confirmSignupCode: (email: string, code: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function memberToUser(member: { id: string; auth?: { email?: string }; customFields?: Record<string, unknown> }): AuthUser {
  const email = member.auth?.email ?? "";
  const name = (member.customFields?.name as string) ?? (member.customFields?.firstName as string) ?? email.split("@")[0] ?? "user";
  return {
    id: member.id,
    name,
    email,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsub: { unsubscribe?: () => boolean } | undefined;
    getMemberstack().then((ms) => {
      if (!ms) {
        setIsLoading(false);
        return;
      }
      unsub = ms.onAuthChange((member: unknown) => {
        if (member && typeof member === "object" && "id" in member) {
          setUser(memberToUser(member as Parameters<typeof memberToUser>[0]));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
      ms.getCurrentMember()
        .then((res) => {
          const data = res?.data ?? res;
          const member = data?.member ?? data;
          if (member?.id) {
            setUser(memberToUser(member as Parameters<typeof memberToUser>[0]));
          }
        })
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
    });
    return () => {
      if (typeof unsub?.unsubscribe === "function") unsub.unsubscribe();
    };
  }, []);

  const sendLoginCode = useCallback(async (email: string) => {
    const ms = await getMemberstack();
    if (!ms) throw new Error("MemberStack is not configured");
    await ms.sendMemberLoginPasswordlessEmail({ email });
  }, []);

  const confirmLoginCode = useCallback(async (email: string, code: string) => {
    const ms = await getMemberstack();
    if (!ms) throw new Error("MemberStack is not configured");
    await ms.loginMemberPasswordless({ email, passwordlessToken: code.trim() });
    const res = await ms.getCurrentMember();
    const data = res?.data ?? res;
    const member = data?.member ?? data;
    if (member?.id) setUser(memberToUser(member as Parameters<typeof memberToUser>[0]));
  }, []);

  const sendSignupCode = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- optional param for API compatibility
    async (email: string, name?: string) => {
      const ms = await getMemberstack();
      if (!ms) throw new Error("MemberStack is not configured");
      await ms.sendMemberSignupPasswordlessEmail({ email });
    },
    []
  );

  const confirmSignupCode = useCallback(async (email: string, code: string, name?: string) => {
    const ms = await getMemberstack();
    if (!ms) throw new Error("MemberStack is not configured");
    await ms.signupMemberPasswordless({
      email,
      passwordlessToken: code.trim(),
      ...(name ? { customFields: { name } } : {}),
    });
    const res = await ms.getCurrentMember();
    const data = res?.data ?? res;
    const member = data?.member ?? data;
    if (member?.id) setUser(memberToUser(member as Parameters<typeof memberToUser>[0]));
  }, []);

  const logout = useCallback(async () => {
    const ms = await getMemberstack();
    if (ms) await ms.logout();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isLoggedIn: user != null,
    sendLoginCode,
    confirmLoginCode,
    sendSignupCode,
    confirmSignupCode,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx == null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
