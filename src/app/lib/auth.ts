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
  const payload: Parameters<typeof supabase.auth.updateUser>[0] = {};
  const emailTrim = updates.email?.trim();
  const nameTrim = updates.name?.trim();
  if (emailTrim !== undefined && emailTrim !== '') payload.email = emailTrim;
  if (nameTrim !== undefined) payload.data = { name: nameTrim, full_name: nameTrim };
  if (Object.keys(payload).length === 0) return { data: null, error: undefined };
  return supabase.auth.updateUser(payload);
}

export async function updatePassword(newPassword: string) {
  if (!supabase) return { data: null, error: notConfigured() };
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
}
