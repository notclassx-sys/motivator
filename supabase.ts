
import { createClient } from '@supabase/supabase-js';

// Credentials updated with the correct project details to resolve authentication errors.
const supabaseUrl = 'https://yctylvbiapmqymlikfod.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdHlsdmJpYXBtcXltbGlrZm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MjA4NTUsImV4cCI6MjA4MjQ5Njg1NX0.Vfgth5fPAUuu0CBSs3ZhuAceSbY_3Okq0dwCuHc2OJk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signUpWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
};

export const resetPasswordForEmail = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};
