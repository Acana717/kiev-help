import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { SUPABASE_DEV_LOG } from "./messages";

let devWarned = false;

function warnOnce() {
  if (process.env.NODE_ENV === "development" && !devWarned) {
    console.warn(SUPABASE_DEV_LOG);
    devWarned = true;
  }
}

function isPlaceholder(value: string): boolean {
  const v = value.toLowerCase();
  return (
    v.includes("your_project") ||
    v.includes("your_anon") ||
    v.includes("your_service") ||
    v === ""
  );
}

/** Публічні ключі для браузера (Storage, Realtime). Без service role. */
export function isBrowserSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return !isPlaceholder(url) && !isPlaceholder(anonKey);
}

/** Повна конфігурація для API-роутів (потрібен service role на сервері). */
export function isSupabaseConfigured(): boolean {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return isBrowserSupabaseConfigured() && !isPlaceholder(serviceKey);
}

let browserClient: SupabaseClient | null = null;

const EMPTY_QUERY_RESULT = Promise.resolve({
  data: [] as unknown[],
  error: null,
  count: null,
  status: 200,
  statusText: "OK",
});

const EMPTY_SINGLE = Promise.resolve({
  data: null,
  error: null,
  count: null,
  status: 200,
  statusText: "OK",
});

type QueryChain = {
  (): QueryChain;
  select: () => QueryChain;
  insert: () => QueryChain;
  update: () => QueryChain;
  delete: () => QueryChain;
  upsert: () => QueryChain;
  eq: () => QueryChain;
  neq: () => QueryChain;
  or: () => QueryChain;
  order: () => QueryChain;
  limit: () => QueryChain;
  filter: () => QueryChain;
  match: () => QueryChain;
  single: () => typeof EMPTY_SINGLE;
  maybeSingle: () => typeof EMPTY_SINGLE;
  then: typeof EMPTY_QUERY_RESULT.then;
  catch: typeof EMPTY_QUERY_RESULT.catch;
  finally: typeof EMPTY_QUERY_RESULT.finally;
};

/** Безпечна заглушка: не кидає помилок, повертає порожні data. */
function createQueryChain(): QueryChain {
  const chain = (() => chain) as QueryChain;
  const methods = [
    "select",
    "insert",
    "update",
    "delete",
    "upsert",
    "eq",
    "neq",
    "or",
    "order",
    "limit",
    "filter",
    "match",
  ];
  for (const m of methods) {
    (chain as unknown as Record<string, () => QueryChain>)[m] = () => chain;
  }
  chain.single = () => EMPTY_SINGLE;
  chain.maybeSingle = () => EMPTY_SINGLE;
  chain.then = EMPTY_QUERY_RESULT.then.bind(EMPTY_QUERY_RESULT);
  chain.catch = EMPTY_QUERY_RESULT.catch.bind(EMPTY_QUERY_RESULT);
  chain.finally = EMPTY_QUERY_RESULT.finally.bind(EMPTY_QUERY_RESULT);
  return chain;
}

export function createUnavailableClient(): SupabaseClient {
  warnOnce();
  const stub = {
    from: () => createQueryChain(),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
  };
  return stub as unknown as SupabaseClient;
}

export function getServiceClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    warnOnce();
    return null;
  }
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch (e) {
    console.error("[kiev-help] Не вдалося створити service client:", e);
    return null;
  }
}

/** Реальний клієнт або заглушка — ніколи не throw при ініціалізації. */
export function getServiceClientSafe(): SupabaseClient {
  return getServiceClient() ?? createUnavailableClient();
}

export function getBrowserClient(): SupabaseClient | null {
  if (!isBrowserSupabaseConfigured()) {
    warnOnce();
    return null;
  }
  if (browserClient) return browserClient;

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    browserClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return browserClient;
  } catch (e) {
    console.error("[kiev-help] Не вдалося створити browser client:", e);
    return null;
  }
}

export function getBrowserClientSafe(): SupabaseClient {
  return getBrowserClient() ?? createUnavailableClient();
}

export async function withServiceClient<T>(
  fn: (client: SupabaseClient) => Promise<T>,
  fallback: T
): Promise<{ result: T; ok: boolean }> {
  const client = getServiceClient();
  if (!client) {
    warnOnce();
    return { result: fallback, ok: false };
  }
  try {
    const result = await fn(client);
    return { result, ok: true };
  } catch (e) {
    console.error("[kiev-help] Помилка запиту до Supabase:", e);
    return { result: fallback, ok: false };
  }
}
