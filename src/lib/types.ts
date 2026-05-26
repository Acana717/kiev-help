export type PostType = "need" | "offer";

export type ListingCategory =
  | "Пропоную допомогу"
  | "Шукаю допомогу"
  | "Волонтерство"
  | "Інше";

/** @deprecated use ListingCategory */
export type HelpCategory = ListingCategory;

export interface PostPublic {
  id: string;
  post_type: PostType;
  category: ListingCategory | string;
  district: string | null;
  title: string;
  description: string;
  image_url: string | null;
  bank_name: string | null;
  status: string;
  report_count: number;
  views_count: number;
  created_at: string;
  expires_at: string | null;
}

export interface PostReveal {
  phone: string | null;
  telegram: string | null;
  card_number: string | null;
  jar_link: string | null;
}

export interface FeedFiltersState {
  category: string;
  district: string;
  q: string;
}

export interface CreatePostPayload {
  category: ListingCategory | string;
  district: string;
  title: string;
  description: string;
  image_url?: string;
  phone?: string;
  telegram?: string;
  card_number?: string;
  bank_name?: string;
  jar_link?: string;
  captcha_answer: number;
  captcha_token: string;
}

export interface AdminPostRow extends PostPublic {
  has_phone: boolean;
  has_telegram: boolean;
}
