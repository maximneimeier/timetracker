'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import * as auth from './auth';
import { migrateLocalDataToSupabase } from './storage';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: Error }>;
  signOut: () => Promise<{ error?: Error }>;
  resetPassword: (email: string) => Promise<{ error?: Error }>;
  updateProfile: (updates: { name?: string; email?: string }) => Promise<{ error?: Error }>;
  updatePassword: (newPassword: string) => Promise<{ error?: Error }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        migrateLocalDataToSupabase(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn: async (email, password) => {
      const { error } = await auth.signIn(email, password);
      return { error: error || undefined };
    },
    signUp: async (email, password, name) => {
      const { error } = await auth.signUp(email, password, name);
      return { error: error || undefined };
    },
    signOut: async () => {
      const { error } = await auth.signOut();
      return { error: error || undefined };
    },
    resetPassword: async (email) => {
      const { error } = await auth.resetPassword(email);
      return { error: error || undefined };
    },
    updateProfile: async (updates) => {
      const { error } = await auth.updateProfile(updates);
      return { error: error || undefined };
    },
    updatePassword: async (newPassword) => {
      const { error } = await auth.updatePassword(newPassword);
      return { error: error || undefined };
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
