import { fetchJson } from "./fetch-json";
import { validateImageFileMeta } from "./image-upload-validation";
import { IMAGE_UPLOAD_UNAVAILABLE_MESSAGE } from "./messages";

export async function uploadPostImage(
  file: File
): Promise<{ url?: string; error?: string }> {
  const validationError = validateImageFileMeta(file);
  if (validationError) {
    return { error: validationError };
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const { ok, data, error } = await fetchJson<{ url?: string }>(
      "/api/upload-image",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!ok || !data?.url) {
      console.error("[kiev-help] Image upload failed:", error ?? "empty response");
      return {
        error: error ?? IMAGE_UPLOAD_UNAVAILABLE_MESSAGE,
      };
    }

    return { url: data.url };
  } catch (err) {
    console.error("[kiev-help] Image upload request error:", err);
    return { error: IMAGE_UPLOAD_UNAVAILABLE_MESSAGE };
  }
}
