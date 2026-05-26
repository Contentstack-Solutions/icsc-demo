"use client";
import { useState, useEffect } from "react";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import LyticsExtension from "./lyticsExtension";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { ContentstackClient } from "@/lib/contentstack-client";

const NavLink = ({ href, children, active }) => (
  <a
    href={href || "#"}
    className={`text-sm transition-colors pb-[19px] ${
      active
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`}
  >
    <span>{children}</span>
  </a>
);

export default function Header({ locale }) {
  const [togglePanel, setTogglePanel] = useState(false);
  const [headerEntry, setHeaderEntry] = useState(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchHeader = async () => {
      const data = await ContentstackClient.getElementByType("header", locale ?? "en");
      if (Array.isArray(data) && data.length > 0) {
        setHeaderEntry(data[0]);
      }
    };
    fetchHeader();
    ContentstackClient.onEntryChange(fetchHeader);
  }, [locale]);

  const handleSignOut = () => {
    logout();
    router.push("/en/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  const logoUrl = headerEntry?.logo?.url ?? null;
  const navLinks = headerEntry?.nav_links ?? [];
  const utilityLinks = headerEntry?.utility_links ?? [];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center px-8 py-4 w-full pb-0">
        <a href="/" className="mr-8 xl:mr-12">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="ICSC Logo" className="h-12 w-auto min-w-[48px]" />
          ) : (
            <></>
            // eslint-disable-next-line @next/next/no-img-element
            // <img src="/ICSC-logo.svg" alt="ICSC Logo" className="h-12 w-auto min-w-[48px]" />
          )}
        </a>

        <div className="flex flex-col items-start gap-3 w-[90%]">
          {/* Utility bar */}
          <div className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
            <div className="flex justify-end items-center py-2 gap-6 text-sm text-gray-600">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="font-medium text-gray-800">My ICSC</span>
                </div>
              ) : (
                <a href="#" className="hover:text-blue-600">Login</a>
              )}
              {user && (
                <button onClick={handleSignOut} className="hover:text-blue-600 cursor-pointer">
                  Sign Out
                </button>
              )}
              {utilityLinks.map((link) => (
                <a key={link.label} href={link.href || "#"} className="hover:text-blue-600">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Main nav */}
          <nav className="gap-4 xl:gap-8 ml-auto flex items-center">
            {navLinks.map((link) => (
              <NavLink key={link.label} href={link.href}>
                {link.label}
              </NavLink>
            ))}
            <div className="pb-4">
              <button
                onClick={() => setTogglePanel(!togglePanel)}
                className="outline-none"
                aria-label="Toggle slide panel"
              >
                <Squares2X2Icon className="size-5" />
              </button>
              {togglePanel && <LyticsExtension onClose={() => setTogglePanel(false)} />}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
