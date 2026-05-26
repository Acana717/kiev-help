export type PostType = "need" | "offer";
export type HelpCategory =
  | "housing"
  | "transport"
  | "debris"
  | "medicine"
  | "finance"
  | "other";

export interface PostPublic {
  id: string;
  post_type: PostType;
  category: HelpCategory;
  district: string;
  title: string;
  description: string;
  bank_name: string | null;
  status: string;
  report_count: number;
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
  post_type: string;
  category: string;
  district: string;
  q: string;
}

export interface CreatePostPayload {
  post_type: PostType;
  category: HelpCategory;
  district: string;
  title: string;
  description: string;
  phone?: string;
  telegram?: string;
  card_number?: string;
  bank_name?: string;
  jar_link?: string;
  captcha_answer: number;
  captcha_token: string;
}
