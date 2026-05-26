export const KYIV_DISTRICTS = [
  "Увесь Київ",
  "Голосіївський",
  "Дарницький",
  "Деснянський",
  "Дніпровський",
  "Оболонський",
  "Печерський",
  "Подільський",
  "Святошинський",
  "Солом'янський",
  "Шевченківський",
] as const;

/** Категорії оголошень (зберігаються в posts.category як TEXT) */
export const LISTING_CATEGORIES = [
  "Пропоную допомогу",
  "Шукаю допомогу",
  "Волонтерство",
  "Інше",
] as const;

export const BANKS = [
  "Монобанк",
  "ПриватБанк",
  "ПУМБ",
  "Ощадбанк",
  "А-Банк",
  "Інший",
] as const;

export const WARNING_BANNER =
  "Перевіряйте інформацію перед переказом коштів. Платформа не несе відповідальності за транзакції. Ніколи не передавайте CVV-код та термін дії картки.";

export const MAX_POSTS_PER_HOUR = 3;
export const REVEAL_COOLDOWN_MS = 2000;

export const POST_IMAGES_BUCKET = "post-images";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

/** @deprecated use LISTING_CATEGORIES */
export const HELP_CATEGORIES = LISTING_CATEGORIES.map((label) => ({
  value: label,
  label,
}));

/** @deprecated derived from category on server */
export const POST_TYPES = [
  { value: "need", label: "Потрібна допомога" },
  { value: "offer", label: "Можу допомогти" },
] as const;
