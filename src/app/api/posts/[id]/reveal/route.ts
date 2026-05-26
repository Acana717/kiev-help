import { NextRequest } from "next/server";
import { safeApiHandler } from "@/lib/api-handler";
import { getClientFingerprint } from "@/lib/fingerprint";
import { isSupabaseConfigured, withServiceClient } from "@/lib/supabaseClient";
import { jsonBadRequest, jsonOk, jsonUnavailable } from "@/lib/api-response";

const revealLog = new Map<string, number>();
const REVEAL_COOLDOWN_MS = 2000;

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return safeApiHandler(async () => {
    const { id } = await context.params;

    if (!id?.trim()) {
      return jsonBadRequest("Невірний ідентифікатор оголошення");
    }

    const fingerprint = await getClientFingerprint();
    const key = `${fingerprint}:${id}`;
    const last = revealLog.get(key) ?? 0;

    if (Date.now() - last < REVEAL_COOLDOWN_MS) {
      return jsonBadRequest("Зачекайте кілька секунд перед повторним запитом");
    }
    revealLog.set(key, Date.now());

    if (!isSupabaseConfigured()) {
      return jsonUnavailable();
    }

    const { result: row, ok } = await withServiceClient(async (supabase) => {
      const { data, error } = await supabase
        .from("posts")
        .select("phone_enc, telegram_enc, card_number_enc, jar_link_enc, status")
        .eq("id", id)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;
      return data;
    }, null);

    if (!ok || !row) {
      return jsonUnavailable();
    }

    return jsonOk({
      phone: row.phone_enc ?? null,
      telegram: row.telegram_enc ?? null,
      card_number: row.card_number_enc ?? null,
      jar_link: row.jar_link_enc ?? null,
    });
  });
}
