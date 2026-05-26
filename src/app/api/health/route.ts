import { safeApiHandler } from "@/lib/api-handler";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { jsonOk } from "@/lib/api-response";

export async function GET() {
  return safeApiHandler(async () => {
    return jsonOk({
      status: "ok",
      supabase: isSupabaseConfigured(),
      data: [],
    });
  });
}
