import type { CreatePostPayload } from "./types";

const POST_TYPES = new Set(["need", "offer"]);
const CATEGORIES = new Set([
  "housing",
  "transport",
  "debris",
  "medicine",
  "finance",
  "other",
]);

export function validateCreatePostBody(
  body: Partial<CreatePostPayload> | null | undefined
): string | null {
  if (!body || typeof body !== "object") {
    return "Невірне тіло запиту";
  }

  if (!body.post_type || !POST_TYPES.has(body.post_type)) {
    return "Невірний тип оголошення";
  }

  if (!body.category || !CATEGORIES.has(body.category)) {
    return "Невірна категорія";
  }

  if (!body.district?.trim()) {
    return "Вкажіть район";
  }

  const title = body.title?.trim() ?? "";
  if (title.length < 3 || title.length > 120) {
    return "Заголовок має бути від 3 до 120 символів";
  }

  const description = body.description?.trim() ?? "";
  if (description.length < 10 || description.length > 2000) {
    return "Опис має бути від 10 до 2000 символів";
  }

  if (!body.phone?.trim() && !body.telegram?.trim()) {
    return "Потрібен телефон або Telegram";
  }

  if (
    body.captcha_answer === undefined ||
    !Number.isFinite(body.captcha_answer) ||
    !body.captcha_token?.trim()
  ) {
    return "Перевірка від ботів не пройдена";
  }

  return null;
}
