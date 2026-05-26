import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
} from "./constants";

export function validateImageFileMeta(
  file: Pick<File, "type" | "size">
): string | null {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
    )
  ) {
    return "Дозволені формати: JPEG, PNG, WebP, GIF";
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return "Максимальний розмір фото — 5 МБ";
  }

  return null;
}

export function buildImageStoragePath(fileName: string): string {
  const ext =
    fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  return `uploads/${crypto.randomUUID()}.${ext}`;
}
