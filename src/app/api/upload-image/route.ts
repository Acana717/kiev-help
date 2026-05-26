import { randomUUID } from "crypto";
import { safeApiHandler } from "@/lib/api-handler";
import { jsonBadRequest, jsonOk, jsonUnavailable } from "@/lib/api-response";
import { POST_IMAGES_BUCKET } from "@/lib/constants";
import {
  buildImageStoragePath,
  validateImageFileMeta,
} from "@/lib/image-upload-validation";
import { IMAGE_UPLOAD_UNAVAILABLE_MESSAGE } from "@/lib/messages";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  return safeApiHandler(async () => {
    if (!isSupabaseConfigured()) {
      return jsonUnavailable(IMAGE_UPLOAD_UNAVAILABLE_MESSAGE);
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return jsonBadRequest("Некоректні дані для завантаження");
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return jsonBadRequest("Оберіть файл зображення");
    }

    const validationError = validateImageFileMeta(file);
    if (validationError) {
      return jsonBadRequest(validationError);
    }

    const client = getServiceClient();
    if (!client) {
      return jsonUnavailable(IMAGE_UPLOAD_UNAVAILABLE_MESSAGE);
    }

    const path = buildImageStoragePath(file.name || `${randomUUID()}.jpg`);
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await client.storage
      .from(POST_IMAGES_BUCKET)
      .upload(path, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("[kiev-help] Storage upload failed:", uploadError);
      return jsonBadRequest("Не вдалося завантажити фото. Спробуйте ще раз.");
    }

    const { data } = client.storage.from(POST_IMAGES_BUCKET).getPublicUrl(path);
    return jsonOk({ url: data.publicUrl });
  });
}
