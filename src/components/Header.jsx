"use client";
import { useState } from "react";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import LyticsExtension from "./lyticsExtension";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";

const ICSCLogo = () => (
    <img src="/ICSC-logo.svg" alt="ICSC Logo" className="h-12 w-auto" />
);

const NavLink = ({ href, children, active }) => (
  <a
    href={href || '#'}
    className={`text-sm transition-colors pb-[19px] ${
      active
        ? 'text-blue-600 border-b-2 border-blue-600'
        : 'text-gray-700 hover:text-blue-600'
    }`}
  >
    <span>{children}</span>
  </a>
);

export default function Header() {
  const [togglePanel, setTogglePanel] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    router.push('/en/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Utility bar */}
     

      {/* Main nav */}
      <div className="max-w-6xl mx-auto flex items-center px-8 py-4 w-full pb-0">
        <a href="/" className="mr-12">
          <ICSCLogo />
        </a>
        <div className="flex flex-col items-start gap-3 w-[90%] ">
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
            <a href="#" className="hover:text-blue-600">Contact Us</a>
            <a href="#" className="hover:text-blue-600">Media</a>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600">
              <span>My Cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
          </div>
          </div>
          <nav className="gap-8 ml-auto flex items-center">
            <NavLink>Who We Are</NavLink>
            <NavLink>News &amp; Views</NavLink>
            <NavLink>Attend &amp; Learn</NavLink>
            <NavLink active>Marketplaces IQ</NavLink>
            <NavLink>Find &amp; Connect</NavLink>
            <NavLink>Join</NavLink>
            {/* <button className="text-gray-700 hover:text-blue-600 ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button> */}
          <div className="pb-4">
            <button
              onClick={() => (setTogglePanel(!togglePanel))}
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
