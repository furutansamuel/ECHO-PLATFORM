import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for ECHO.
 *
 * Reads publishable credentials from Vite env vars. If either is missing (e.g.
 * before the developer has connected Supabase) we fall back to a shallow mock
 * so the UI keeps rendering and demo mode still works — every call resolves
 * with `{ data: null, error: { message: "Supabase not configured" } }` instead
 * of throwing "Cannot read properties of null".
 */

// Publishable (anon) credentials — safe to expose to the browser.
// Falls back to env overrides if a developer wants to point at a different
// project locally.
const DEFAULT_URL = "https://mreipdzudahzsrakntxm.supabase.co";
const DEFAULT_PUBLISHABLE_KEY = "sb_publishable_LqP0QWJKXpOXoJRmzOwaiw_Of5HBVTI";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_URL;
const anonKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  DEFAULT_PUBLISHABLE_KEY) as string;

export const isSupabaseConfigured = Boolean(url && anonKey);

function createStubClient(): SupabaseClient {
  const notConfigured = { message: "Supabase not configured" };
  const asyncNull = async () => ({ data: null, error: notConfigured });
  const asyncEmpty = async () => ({ data: [], error: null });

  const queryBuilder: any = new Proxy(
    {},
    {
      get(_t, prop) {
        if (prop === "then") return undefined;
        if (prop === "single" || prop === "maybeSingle") return asyncNull;
        if (prop === "then" || prop === "catch" || prop === "finally") return undefined;
        return () => queryBuilder;
      },
    },
  );
  // Make `await supabase.from(...).select(...)` resolve.
  queryBuilder.then = (resolve: (v: any) => void) => resolve({ data: [], error: null });

  const channel = {
    on: () => channel,
    subscribe: () => channel,
    unsubscribe: async () => ({ error: null }),
  };

  const stub: any = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onAuthStateChange: (_cb: unknown) => ({
        data: { subscription: { unsubscribe: () => undefined } },
      }),
      signInWithPassword: asyncNull,
      signUp: asyncNull,
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
    },
    from: () => queryBuilder,
    rpc: async () => ({ data: null, error: null }),
    channel: () => channel,
    removeChannel: async () => ({ error: null }),
    removeAllChannels: async () => ({ error: null }),
    storage: {
      from: () => ({
        upload: asyncNull,
        download: asyncNull,
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        remove: asyncEmpty,
        list: asyncEmpty,
      }),
    },
  };
  return stub as SupabaseClient;
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "echo-auth",
      },
    })
  : createStubClient();

if (!isSupabaseConfigured && typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.warn(
    "[ECHO] Supabase env vars are not set. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env — demo/guest mode still works.",
  );
}
