"use client";

import { useCallback, useEffect, useState } from "react";
import type { FeedFiltersState, PostPublic } from "@/lib/types";
import { fetchJson } from "@/lib/fetch-json";
import { FeedFilters } from "./FeedFilters";
import { PostCard } from "./PostCard";

const initialFilters: FeedFiltersState = {
  post_type: "",
  category: "",
  district: "",
  q: "",
};

type FeedPost = PostPublic & {
  has_phone?: boolean;
  has_telegram?: boolean;
  has_card?: boolean;
  has_jar?: boolean;
};

type PostsResponse = {
  posts?: FeedPost[];
  degraded?: boolean;
};

function hasActiveFilters(filters: FeedFiltersState): boolean {
  return !!(
    filters.post_type ||
    filters.category ||
    filters.district ||
    filters.q.trim()
  );
}

function isFeedBackendUnavailable(
  ok: boolean,
  data: PostsResponse | null,
  serviceUnavailable?: boolean
): boolean {
  if (serviceUnavailable || !ok || data === null) return true;
  return data.degraded === true;
}

export function FeedList() {
  const [filters, setFilters] = useState<FeedFiltersState>(initialFilters);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedAvailable, setFeedAvailable] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (filters.post_type) params.set("post_type", filters.post_type);
    if (filters.category) params.set("category", filters.category);
    if (filters.district) params.set("district", filters.district);
    if (filters.q.trim()) params.set("q", filters.q.trim());

    const { ok, data, serviceUnavailable } = await fetchJson<PostsResponse>(
      `/api/posts?${params.toString()}`
    );

    if (isFeedBackendUnavailable(ok, data, serviceUnavailable)) {
      setFeedAvailable(false);
      setPosts([]);
      setLoading(false);
      return;
    }

    setFeedAvailable(true);
    setPosts(Array.isArray(data?.posts) ? data.posts : []);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  if (loading || !feedAvailable) {
    return null;
  }

  const empty = posts.length === 0;
  const filtered = hasActiveFilters(filters);

  return (
    <div className="space-y-6">
      <FeedFilters value={filters} onChange={setFilters} />
      {empty && (
        <div className="rounded-2xl border border-dashed border-neutral-800/90 bg-surface/50 px-6 py-14 text-center">
          <p className="text-base text-foreground">
            {filtered
              ? "За вашими фільтрами оголошень немає"
              : "Поки немає оголошень"}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            {filtered
              ? "Спробуйте змінити фільтри."
              : "Створіть перше оголошення вище."}
          </p>
        </div>
      )}
      <ul className="space-y-5">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
