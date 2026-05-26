"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const AUTH_PATHS = ["/login", "/register"];

export default function AppShell({ children, locale }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.endsWith(p));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
