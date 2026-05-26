import { NextRequest, NextResponse } from "next/server";
import { safeApiHandler } from "@/lib/api-handler";
import { mapPostRow, type PostRow } from "@/lib/post-mapper";
import { isSupabaseConfigured, withServiceClient } from "@/lib/supabaseClient";
import { jsonBadRequest, jsonOk, jsonUnavailable } from "@/lib/api-response";
import { SERVER_UNAVAILABLE_MESSAGE } from "@/lib/messages";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const POST_SELECT =
  "id, post_type, category, district, title, description, image_url, bank_name, status, report_count, views_count, created_at, expires_at, phone_enc, telegram_enc, card_number_enc, jar_link_enc";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return safeApiHandler(async () => {
    const { id } = await context.params;

    if (!id || !UUID_RE.test(id)) {
      return jsonBadRequest("Невірний ID оголошення");
    }

    if (!isSupabaseConfigured()) {
      return jsonUnavailable();
    }

    const { result: post, ok } = await withServiceClient(async (supabase) => {
      const { data: row, error } = await supabase
        .from("posts")
        .select(POST_SELECT)
        .eq("id", id)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;
      if (!row) return null;

      const { data: newViews, error: rpcError } = await supabase.rpc(
        "increment_post_views",
        { p_post_id: id }
      );

      if (rpcError) throw rpcError;

      const viewsCount =
        typeof newViews === "number" ? newViews : (row.views_count ?? 0);

      return mapPostRow({ ...row, views_count: viewsCount } as PostRow);
    }, null);

    if (!ok) {
      return jsonUnavailable(SERVER_UNAVAILABLE_MESSAGE);
    }

    if (!post) {
      return NextResponse.json(
        { error: "Оголошення не знайдено" },
        { status: 404 }
      );
    }

    return jsonOk({ post });
  });
}
