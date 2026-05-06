import { supabase } from './supabase';

const notConfigured = () =>
  new Error(
    'Supabase ist nicht konfiguriert. Trage NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local ein.'
  );

export async function signUp(email: string, password: string, name: string) {
  if (!supabase) return { data: null, error: notConfigured() };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  if (!supabase) return { data: null, error: notConfigured() };
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  if (!supabase) return { error: notConfigured() };
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function resetPassword(email: string) {
  if (!supabase) return { data: null, error: notConfigured() };
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
  });
  return { data, error };
}

export async function updateProfile(updates: { name?: string; email?: string }) {
  if (!supabase) return { data: null, error: notConfigured() };
  const { data, error } = await supabase.auth.updateUser({
    data: updates.name ? { name: updates.name } : undefined,
    email: updates.email,
  });
  return { data, error };
}

export async function updatePassword(newPassword: string) {
  if (!supabase) return { data: null, error: notConfigured() };
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
}
