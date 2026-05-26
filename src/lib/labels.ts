import type { HelpCategory, PostType } from "./types";

const CATEGORY_LABELS: Record<HelpCategory, string> = {
  housing: "Житло",
  transport: "Транспорт",
  debris: "Розбір завалів",
  medicine: "Медикаменти",
  finance: "Фінанси",
  other: "Інше",
};

const TYPE_LABELS: Record<PostType, string> = {
  need: "Потрібна допомога",
  offer: "Можу допомогти",
};

export function categoryLabel(c: HelpCategory): string {
  return CATEGORY_LABELS[c] ?? c;
}

export function postTypeLabel(t: PostType): string {
  return TYPE_LABELS[t] ?? t;
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "щойно";
  if (mins < 60) return `${mins} хв тому`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} год тому`;
  const days = Math.floor(hours / 24);
  return `${days} дн тому`;
}
