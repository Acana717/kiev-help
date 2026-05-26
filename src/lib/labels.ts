import type { PostType } from "./types";

const TYPE_LABELS: Record<PostType, string> = {
  need: "Потрібна допомога",
  offer: "Можу допомогти",
};

export function categoryLabel(c: string): string {
  return c || "Інше";
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

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: "Активне",
    fulfilled: "Виконано",
    hidden: "Приховано",
    removed: "Видалено",
  };
  return map[status] ?? status;
}
