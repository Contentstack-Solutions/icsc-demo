"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const AUTH_PATHS = ["/login", "/register"];

export default function AppShell({ children, locale }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.endsWith(p));
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true); // cross-origin iframe throws on window.top access
    }
  }, []);

  if (isAuthPage || isInIframe) {
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
