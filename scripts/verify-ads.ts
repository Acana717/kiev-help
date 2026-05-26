import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const TABLE = "test_posts";

function loadEnvLocal(): void {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing ${name} in .env.local`);
    process.exit(1);
  }
  return value;
}

async function main(): Promise<void> {
  loadEnvLocal();

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const testRow = {
    post_type: "need" as const,
    category: "other" as const,
    district: "Печersk",
    title: "Verify test post",
    description: "Automated verify-ads.ts INSERT SELECT DELETE cycle.",
    client_fingerprint: "verify-ads-script",
  };

  console.log(`[1/3] INSERT into ${TABLE}...`);
  const { data: inserted, error: insertError } = await supabase
    .from(TABLE)
    .insert(testRow)
    .select("id, title, district, status")
    .single();

  if (insertError || !inserted?.id) {
    console.error("INSERT failed:", insertError?.message ?? "no row returned");
    console.error("Hint: run supabase/test_posts.sql in Supabase SQL Editor first.");
    process.exit(1);
  }

  const id = inserted.id;
  console.log("INSERT ok:", id);

  console.log(`[2/3] SELECT from ${TABLE}...`);
  const { data: selected, error: selectError } = await supabase
    .from(TABLE)
    .select("id, title, district, status")
    .eq("id", id)
    .single();

  if (selectError || !selected) {
    console.error("SELECT failed:", selectError?.message ?? "row not found");
    await supabase.from(TABLE).delete().eq("id", id);
    process.exit(1);
  }

  if (selected.title !== testRow.title || selected.district !== testRow.district) {
    console.error("SELECT mismatch:", selected);
    await supabase.from(TABLE).delete().eq("id", id);
    process.exit(1);
  }

  console.log("SELECT ok:", selected);

  console.log(`[3/3] DELETE from ${TABLE}...`);
  const { error: deleteError } = await supabase.from(TABLE).delete().eq("id", id);

  if (deleteError) {
    console.error("DELETE failed:", deleteError.message);
    process.exit(1);
  }

  const { data: ghost, error: ghostError } = await supabase
    .from(TABLE)
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (ghostError) {
    console.error("Post-delete check failed:", ghostError.message);
    process.exit(1);
  }

  if (ghost) {
    console.error("DELETE incomplete: row still exists");
    process.exit(1);
  }

  console.log("DELETE ok");
  console.log(`SUCCESS: ${TABLE} INSERT -> SELECT -> DELETE passed.`);
}

main().catch((error: unknown) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
