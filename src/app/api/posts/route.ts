import { NextRequest } from "next/server";
import { safeApiHandler } from "@/lib/api-handler";
import { getClientFingerprint } from "@/lib/fingerprint";
import { MAX_POSTS_PER_HOUR } from "@/lib/constants";
import type { CreatePostPayload } from "@/lib/types";
import { verifyCaptchaToken } from "@/lib/captcha";
import { mapPostRows, type PostRow } from "@/lib/post-mapper";
import { validateCreatePostBody } from "@/lib/validators";
import {
  isSupabaseConfigured,
  withServiceClient,
} from "@/lib/supabaseClient";
import {
  jsonBadRequest,
  jsonOk,
  jsonPosts,
  jsonUnavailable,
} from "@/lib/api-response";
import { SERVER_UNAVAILABLE_MESSAGE } from "@/lib/messages";

export async function GET(request: NextRequest) {
  return safeApiHandler(async () => {
    if (!isSupabaseConfigured()) {
      return jsonPosts([], true);
    }

    const { searchParams } = request.nextUrl;
    const post_type = searchParams.get("post_type");
    const category = searchParams.get("category");
    const district = searchParams.get("district");
    const q = searchParams.get("q");

    const { result: rows, ok } = await withServiceClient<PostRow[]>(
      async (supabase) => {
        let query = supabase
          .from("posts")
          .select(
            "id, post_type, category, district, title, description, bank_name, status, report_count, views_count, created_at, expires_at, phone_enc, telegram_enc, card_number_enc, jar_link_enc"
          )
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(50);

        if (post_type) query = query.eq("post_type", post_type);
        if (category) query = query.eq("category", category);
        if (district) query = query.eq("district", district);
        if (q) {
          const safe = q.replace(/[%_]/g, "").slice(0, 80);
          if (safe) {
            query = query.or(`title.ilike.%${safe}%,description.ilike.%${safe}%`);
          }
        }

        const { data, error } = await query;
        if (error) throw error;
        return Array.isArray(data) ? data : [];
      },
      []
    );

    if (!ok) {
      return jsonPosts([], true);
    }

    return jsonPosts(mapPostRows(rows));
  });
}

async function checkRateLimit(fingerprint: string): Promise<boolean> {
  const { result: allowed, ok } = await withServiceClient(async (supabase) => {
    const windowMs = 60 * 60 * 1000;
    const now = new Date();

    const { data: row, error } = await supabase
      .from("publish_rate_limits")
      .select("*")
      .eq("fingerprint", fingerprint)
      .maybeSingle();

    if (error) throw error;

    if (!row) {
      await supabase.from("publish_rate_limits").insert({
        fingerprint,
        post_count: 1,
        window_start: now.toISOString(),
      });
      return true;
    }

    const windowStart = row.window_start
      ? new Date(row.window_start).getTime()
      : 0;
    const postCount = typeof row.post_count === "number" ? row.post_count : 0;

    if (!windowStart || now.getTime() - windowStart > windowMs) {
      await supabase
        .from("publish_rate_limits")
        .update({ post_count: 1, window_start: now.toISOString() })
        .eq("fingerprint", fingerprint);
      return true;
    }

    if (postCount >= MAX_POSTS_PER_HOUR) return false;

    await supabase
      .from("publish_rate_limits")
      .update({ post_count: postCount + 1 })
      .eq("fingerprint", fingerprint);

    return true;
  }, true);

  return ok ? allowed : true;
}

export async function POST(request: NextRequest) {
  return safeApiHandler(async () => {
    if (!isSupabaseConfigured()) {
      return jsonUnavailable();
    }

    let body: CreatePostPayload;
    try {
      body = await request.json();
    } catch {
      return jsonBadRequest("Невірний JSON");
    }

    const validationError = validateCreatePostBody(body);
    if (validationError) {
      return jsonBadRequest(validationError);
    }

    if (!verifyCaptchaToken(body.captcha_answer, body.captcha_token)) {
      return jsonBadRequest("Перевірка від ботів не пройдена");
    }

    const fingerprint = await getClientFingerprint();
    const allowed = await checkRateLimit(fingerprint);
    if (!allowed) {
      return jsonBadRequest(
        `Ліміт: не більше ${MAX_POSTS_PER_HOUR} оголошень на годину з одного пристрою`
      );
    }

    const { result: id, ok } = await withServiceClient(async (supabase) => {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          post_type: body.post_type,
          category: body.category,
          district: body.district.trim(),
          title: body.title.trim(),
          description: body.description.trim(),
          phone_enc: body.phone?.trim() || null,
          telegram_enc: body.telegram?.trim() || null,
          card_number_enc: body.card_number?.trim() || null,
          bank_name: body.bank_name || null,
          jar_link_enc: body.jar_link?.trim() || null,
          client_fingerprint: fingerprint,
        })
        .select("id")
        .single();

      if (error) throw error;
      return data?.id ?? null;
    }, null);

    if (!ok || !id) {
      return jsonUnavailable(SERVER_UNAVAILABLE_MESSAGE);
    }

    return jsonOk({ id });
  });
}
