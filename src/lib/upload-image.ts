import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  POST_IMAGES_BUCKET,
} from "./constants";
import { IMAGE_UPLOAD_UNAVAILABLE_MESSAGE } from "./messages";
import { getBrowserClient } from "./supabaseClient";

export async function uploadPostImage(
  file: File
): Promise<{ url?: string; error?: string }> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return { error: "Дозволені формати: JPEG, PNG, WebP, GIF" };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Максимальний розмір фото — 5 МБ" };
  }

  const supabase = getBrowserClient();
  if (!supabase) {
    return { error: IMAGE_UPLOAD_UNAVAILABLE_MESSAGE };
  }

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `uploads/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(POST_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data } = supabase.storage.from(POST_IMAGES_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
