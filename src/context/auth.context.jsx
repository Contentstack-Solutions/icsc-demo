"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authCookie = document.cookie.split(';').find(c => c.trim().startsWith('icsc_auth='));
    const storedUser = localStorage.getItem('icsc_user');
    if (authCookie && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Login by email only — password ignored for demo purposes
  const login = async (email) => {
    const { data, error } = await supabase
      .from('icsc_users_profiles')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error) throw new Error('Error looking up account. Please try again.');
    if (!data) throw new Error('No account found for this email. Please register first.');

    setUser(data);
    localStorage.setItem('icsc_user', JSON.stringify(data));
    document.cookie = 'icsc_auth=true; path=/; max-age=86400; SameSite=Lax';
    return data;
  };

  const register = async (formData) => {
    const email = formData.email.toLowerCase().trim();

    // Check for existing account
    const { data: existing } = await supabase
      .from('icsc_users_profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) throw new Error('An account with this email already exists.');

    const profile = {
      name: formData.name,
      email,
      organization: formData.organization,
      title: formData.title,
      address: formData.address,
      phone: formData.phone,
      customer_type: formData.customerType,
      locations_of_interest: formData.locationsOfInterest,
      property_types: formData.propertyTypes,
    };

    const { data, error } = await supabase
      .from('icsc_users_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw new Error('Failed to create account. Please try again.');

    setUser(data);
    localStorage.setItem('icsc_user', JSON.stringify(data));
    document.cookie = 'icsc_auth=true; path=/; max-age=86400; SameSite=Lax';
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('icsc_user');
    document.cookie = 'icsc_auth=; path=/; max-age=0';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
