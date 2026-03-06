"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/hooks/use-auth";
import { SearchProvider } from "@/hooks/use-search";
import { Nav } from "./nav";
import { Footer } from "./footer";

const AUTH_PATHS = ["/seekers/login", "/seekers/signup"];
const NO_NAV_FOOTER_PATHS = ["/webinar", "/coaching", "/workshop"];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isAuthPage = AUTH_PATHS.some((p) => pathname?.startsWith(p));
  const hideNavFooter = NO_NAV_FOOTER_PATHS.some((p) => pathname?.startsWith(p));

  return (
    <AuthProvider>
      <SearchProvider>
        {!isAuthPage && !hideNavFooter && <Nav />}
        <main className={isHomepage ? "" : "min-h-screen"}>{children}</main>
        {!isHomepage && !isAuthPage && !hideNavFooter && <Footer />}
      </SearchProvider>
    </AuthProvider>
  );
}
