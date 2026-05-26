import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function loadEnvLocal(): void {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
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
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main(): Promise<void> {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const sqlPath = resolve(process.cwd(), "supabase/migrations/add_views_count.sql");
  const sql = readFileSync(sqlPath, "utf8");

  const { error: probeError } = await supabase
    .from("posts")
    .select("views_count")
    .limit(1);

  if (probeError?.message?.includes("views_count")) {
    console.log("Migration not applied yet.\n");
    console.log("Run in Supabase SQL Editor:");
    console.log(`${url.replace("/rest/v1", "")}/project/default/sql/new`);
    console.log("\n--- supabase/migrations/add_views_count.sql ---\n");
    console.log(sql);
    console.log("\n--- end ---\n");
    process.exit(1);
  }

  if (probeError) {
    console.error("Probe failed:", probeError.message);
    process.exit(1);
  }

  console.log("Column views_count exists.");

  const { error: rpcError } = await supabase.rpc("increment_post_views", {
    p_post_id: "00000000-0000-0000-0000-000000000000",
  });

  if (rpcError?.message?.includes("increment_post_views")) {
    console.error("RPC increment_post_views missing. Re-run migration SQL.");
    process.exit(1);
  }

  if (rpcError) {
    console.error("RPC check failed:", rpcError.message);
    process.exit(1);
  }

  console.log("RPC increment_post_views is available.");
  console.log("SUCCESS: views migration ready.");
}

main().catch((error: unknown) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
