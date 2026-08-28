import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the SERVICE ROLE key. Bypasses RLS — never
 * import this into a client component and never expose the key to the browser.
 */
export function getSupabaseServer(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase server client not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    );
  }
  client = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  return client;
}
