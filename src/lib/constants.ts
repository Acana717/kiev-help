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

export const HELP_CATEGORIES = [
  { value: "housing", label: "Житло" },
  { value: "transport", label: "Транспорт" },
  { value: "debris", label: "Розбір завалів" },
  { value: "medicine", label: "Медикаменти" },
  { value: "finance", label: "Фінансова допомога" },
  { value: "other", label: "Інше" },
] as const;

export const POST_TYPES = [
  { value: "need", label: "Потрібна допомога" },
  { value: "offer", label: "Можу допомогти" },
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
