import { NextRequest } from "next/server";
import { safeApiHandler } from "@/lib/api-handler";
import { getClientFingerprint } from "@/lib/fingerprint";
import { isSupabaseConfigured, withServiceClient } from "@/lib/supabaseClient";
import { jsonBadRequest, jsonOk, jsonUnavailable } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  return safeApiHandler(async () => {
    let body: { post_id?: string; reason?: string; details?: string };
    try {
      body = await request.json();
    } catch {
      return jsonBadRequest("Невірний JSON");
    }

    if (!body.post_id) {
      return jsonBadRequest("post_id обов'язковий");
    }

    if (!isSupabaseConfigured()) {
      return jsonUnavailable();
    }

    const fingerprint = await getClientFingerprint();

    const { ok, result } = await withServiceClient(async (supabase) => {
      const { error } = await supabase.from("reports").insert({
        post_id: body.post_id,
        reason: body.reason || "other",
        details: body.details?.slice(0, 500) || null,
        reporter_fingerprint: fingerprint,
      });

      if (error) {
        if (error.code === "23505") {
          return { duplicate: true as const };
        }
        throw error;
      }
      return { duplicate: false as const };
    }, { duplicate: false });

    if (!ok) {
      return jsonUnavailable();
    }

    if (result?.duplicate) {
      return jsonBadRequest("Ви вже скаржились на це оголошення");
    }

    return jsonOk({ ok: true });
  });
}
