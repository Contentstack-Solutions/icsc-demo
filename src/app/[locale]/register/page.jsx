"use client";

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth.context';
import AuthHeader from '@/components/AuthHeader';

const CUSTOMER_TYPES = ['Owner', 'Retailer', 'Next Generation'];
const PROPERTY_TYPES = ['Suburban Mall', 'Airport', 'Urban Locale'];

const INPUT_CLASS =
  'w-full border border-gray-300 rounded px-4 py-3 text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function RegisterPage({ params }) {
  const { locale } = use(params);
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    title: '',
    address: '',
    phone: '',
    customerType: '',
    locationsOfInterest: '',
    propertyTypes: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePropertyType = (type) => {
    setForm((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      register(form);
      router.push(`/${locale}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AuthHeader />

      <main className="flex-1 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-[500px]">
          <h1 className="text-[28px] font-bold text-center text-gray-900 mb-8">
            Create Your Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Name" required>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Email" required>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Create Password" required>
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Organization" required>
              <input
                type="text"
                name="organization"
                placeholder="Organization"
                value={form.organization}
                onChange={handleChange}
                required
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Title" required>
              <input
                type="text"
                name="title"
                placeholder="Job Title"
                value={form.title}
                onChange={handleChange}
                required
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Address" required>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Phone" required>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className={INPUT_CLASS}
              />
            </Field>

            {/* Type of Customer — single select */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Type of Customer <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2.5">
                {CUSTOMER_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="customerType"
                      value={type}
                      checked={form.customerType === type}
                      onChange={handleChange}
                      required
                      className="w-4 h-4 text-blue-600 accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <Field label="Locations Of Interest">
              <input
                type="text"
                name="locationsOfInterest"
                placeholder="e.g. New York, Los Angeles, Chicago"
                value={form.locationsOfInterest}
                onChange={handleChange}
                className={INPUT_CLASS}
              />
            </Field>

            {/* Property Type of Interest — multi-select */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Property Type Of Interest
              </label>
              <div className="space-y-2.5">
                {PROPERTY_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.propertyTypes.includes(type)}
                      onChange={() => togglePropertyType(type)}
                      className="w-4 h-4 border-gray-400 rounded accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded text-base font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href={`/${locale}/login`} className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
