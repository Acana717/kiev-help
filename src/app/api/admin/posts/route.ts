import { safeApiHandler } from "@/lib/api-handler";
import { mapPostRows, type PostRow } from "@/lib/post-mapper";
import { isSupabaseConfigured, withServiceClient } from "@/lib/supabaseClient";
import { jsonOk, jsonUnavailable } from "@/lib/api-response";

const ADMIN_SELECT =
  "id, post_type, category, district, title, description, image_url, bank_name, status, report_count, views_count, created_at, expires_at, phone_enc, telegram_enc";

export async function GET() {
  return safeApiHandler(async () => {
    if (!isSupabaseConfigured()) {
      return jsonUnavailable();
    }

    const { result: rows, ok } = await withServiceClient<PostRow[]>(
      async (supabase) => {
        const { data, error } = await supabase
          .from("posts")
          .select(ADMIN_SELECT)
          .order("created_at", { ascending: false })
          .limit(200);

        if (error) throw error;
        return Array.isArray(data) ? data : [];
      },
      []
    );

    if (!ok) {
      return jsonUnavailable();
    }

    return jsonOk({ posts: mapPostRows(rows) });
  });
}
