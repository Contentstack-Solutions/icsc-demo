"use client";

const ICSCLogo = () => (
  <div className="flex items-center gap-1">
    <svg viewBox="0 0 54 54" width="40" height="40" aria-hidden="true">
      <path
        d="M42,8 A21,21 0 1,0 42,46"
        fill="none"
        stroke="#1e3177"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M39,17 A13,13 0 1,0 39,37"
        fill="none"
        stroke="#3b5bd6"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
    <span
      style={{
        fontFamily: '"Times New Roman", Times, Georgia, serif',
        fontWeight: '700',
        fontSize: '26px',
        letterSpacing: '1.5px',
        color: '#111827',
        lineHeight: 1,
      }}
    >
      icsc
    </span>
  </div>
);

const NavLink = ({ href, children, active }) => (
  <a
    href={href || '#'}
    className={`text-sm transition-colors ${
      active
        ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
        : 'text-gray-700 hover:text-blue-600'
    }`}
  >
    {children}
  </a>
);

export default function AuthHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      {/* Utility bar */}
      <div className="flex justify-end items-center px-8 py-2 border-b border-gray-100 gap-6 text-sm text-gray-600">
        <a href="#" className="hover:text-blue-600">Login</a>
        <a href="#" className="hover:text-blue-600">Contact Us</a>
        <a href="#" className="hover:text-blue-600">Media</a>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600">
          <span>My Cart</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex items-center px-8 py-4">
        <a href="/" className="mr-12">
          <ICSCLogo />
        </a>
        <nav className="flex items-center gap-8 ml-auto">
          <NavLink>Who We Are</NavLink>
          <NavLink>News &amp; Views</NavLink>
          <NavLink>Attend &amp; Learn</NavLink>
          <NavLink active>Marketplaces IQ</NavLink>
          <NavLink>Find &amp; Connect</NavLink>
          <NavLink>Join</NavLink>
          <button className="text-gray-700 hover:text-blue-600 ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
