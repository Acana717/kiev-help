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
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const sqlPath = resolve(
    process.cwd(),
    "supabase/migrations/add_media_and_categories.sql"
  );
  const sql = readFileSync(sqlPath, "utf8");

  const { error: imageError } = await supabase
    .from("posts")
    .select("image_url")
    .limit(1);

  if (imageError?.message?.includes("image_url")) {
    console.log("Migration not applied.\n");
    console.log("Run in Supabase SQL Editor:\n");
    console.log(sql);
    console.log("\nAlso create bucket post-images as Public in Storage UI if SQL fails.");
    process.exit(1);
  }

  if (imageError) {
    console.error("Probe failed:", imageError.message);
    process.exit(1);
  }

  const { data: bucket } = await supabase.storage.getBucket("post-images");
  if (!bucket) {
    console.warn("WARN: bucket post-images not found — check Storage dashboard.");
  } else {
    console.log("Bucket post-images:", bucket.public ? "public" : "private");
  }

  console.log("Column image_url exists.");
  console.log("SUCCESS: media migration ready.");
}

main().catch((error: unknown) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
