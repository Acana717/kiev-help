import { NextRequest } from "next/server";
import { safeApiHandler } from "@/lib/api-handler";
import { isSupabaseConfigured, withServiceClient } from "@/lib/supabaseClient";
import { jsonBadRequest, jsonOk, jsonUnavailable } from "@/lib/api-response";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return safeApiHandler(async () => {
    const { id } = await context.params;

    if (!id || !UUID_RE.test(id)) {
      return jsonBadRequest("Невірний ID");
    }

    if (!isSupabaseConfigured()) {
      return jsonUnavailable();
    }

    const { result: deleted, ok } = await withServiceClient(async (supabase) => {
      const { data, error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id)
        .select("id");

      if (error) throw error;
      return Array.isArray(data) && data.length > 0;
    }, false);

    if (!ok) {
      return jsonUnavailable();
    }

    if (!deleted) {
      return jsonBadRequest("Оголошення не знайдено");
    }

    return jsonOk({ deleted: true });
  });
}
