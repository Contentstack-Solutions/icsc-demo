"use client";

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth.context';

export default function LoginPage({ params }) {
  const { locale } = use(params);
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email);
      if (typeof jstag !== 'undefined' && jstag) {
        jstag.send({
          name: user.name,
          email: user.email,
          organization: user.organization,
          title: user.title,
          customer_type: user.customer_type,
          address: user.address,
          phone: user.phone,
          location_of_interest: user.locations_of_interest,
          property_type: user.property_types,
          next_generation: user.next_generation,
        });
      }
      window.location.href =  `/${locale}`
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full border border-gray-300 rounded px-4 py-3 text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center py-16 px-4">
        <div className="w-full max-w-[500px]">
          <h1 className="text-[28px] font-bold text-center text-gray-900 mb-8">
            Log in to your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Email Address or Member ID# <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Email Address or Member ID#"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border border-gray-400 rounded-sm cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
                Remember Me
              </label>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded text-base font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 text-center space-y-2.5">
            <p className="text-gray-600 text-sm">Can&#39;t remember your password?</p>
            <a href="#" className="block text-blue-600 text-sm hover:underline">
              Log In Without a Password
            </a>
            <a href="#" className="block text-blue-600 text-sm hover:underline">
              Reset Your Password
            </a>
          </div>

          <hr className="my-8 border-gray-200" />

          <div className="text-center">
            <p className="text-gray-900 font-bold text-lg mb-2">Not a Member?</p>
            <Link href={`/${locale}/register`} className="text-blue-600 text-sm hover:underline">
              Become a Member Today
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
