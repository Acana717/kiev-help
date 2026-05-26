import { LISTING_CATEGORIES } from "./constants";
import type { CreatePostPayload, PostType } from "./types";

const CATEGORIES = new Set<string>(LISTING_CATEGORIES);

export function postTypeFromCategory(category: string): PostType {
  if (category === "Пропоную допомогу" || category === "Волонтерство") {
    return "offer";
  }
  return "need";
}

export function validateCreatePostBody(
  body: Partial<CreatePostPayload> | null | undefined
): string | null {
  if (!body || typeof body !== "object") {
    return "Невірне тіло запиту";
  }

  if (!body.category || !CATEGORIES.has(body.category)) {
    return "Оберіть категорію оголошення";
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

  if (body.image_url?.trim()) {
    try {
      const url = new URL(body.image_url.trim());
      if (!url.protocol.startsWith("http")) {
        return "Невірне посилання на зображення";
      }
    } catch {
      return "Невірне посилання на зображення";
    }
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
