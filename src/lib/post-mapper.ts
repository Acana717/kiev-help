import type { PostPublic } from "./types";

export interface PostRow {
  id?: string;
  post_type?: string;
  category?: string;
  district?: string | null;
  title?: string;
  description?: string;
  image_url?: string | null;
  bank_name?: string | null;
  status?: string;
  report_count?: number;
  views_count?: number;
  created_at?: string;
  expires_at?: string | null;
  phone_enc?: string | null;
  telegram_enc?: string | null;
  card_number_enc?: string | null;
  jar_link_enc?: string | null;
}

export type PublicPostListItem = PostPublic & {
  has_phone: boolean;
  has_telegram: boolean;
  has_card: boolean;
  has_jar: boolean;
};

export function mapPostRow(row: PostRow | null | undefined): PublicPostListItem | null {
  if (!row?.id || !row.title || !row.description) {
    return null;
  }

  const postType = row.post_type === "offer" ? "offer" : "need";

  return {
    id: row.id,
    post_type: postType,
    category: row.category ?? "Інше",
    district: row.district ?? null,
    title: row.title,
    description: row.description,
    image_url: row.image_url ?? null,
    bank_name: row.bank_name ?? null,
    status: row.status ?? "active",
    report_count: row.report_count ?? 0,
    views_count: row.views_count ?? 0,
    created_at: row.created_at ?? new Date().toISOString(),
    expires_at: row.expires_at ?? null,
    has_phone: !!row.phone_enc,
    has_telegram: !!row.telegram_enc,
    has_card: !!row.card_number_enc,
    has_jar: !!row.jar_link_enc,
  };
}

export function mapPostRows(rows: PostRow[] | null | undefined): PublicPostListItem[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) => mapPostRow(row))
    .filter((post): post is PublicPostListItem => post !== null);
}
