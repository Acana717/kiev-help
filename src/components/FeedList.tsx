"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FeedFiltersState, PostPublic } from "@/lib/types";
import { fetchJson } from "@/lib/fetch-json";
import { FeedFilters } from "./FeedFilters";
import { PostCard } from "./PostCard";

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

function filtersFromParams(params: URLSearchParams): FeedFiltersState {
  return {
    category: params.get("category") ?? "",
    district: params.get("district") ?? "",
    q: params.get("q") ?? "",
  };
}

function paramsFromFilters(filters: FeedFiltersState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.district) params.set("district", filters.district);
  if (filters.q.trim()) params.set("q", filters.q.trim());
  return params;
}

function hasActiveFilters(filters: FeedFiltersState): boolean {
  return !!(filters.category || filters.district || filters.q.trim());
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FeedFiltersState>(() =>
    filtersFromParams(searchParams)
  );
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedAvailable, setFeedAvailable] = useState(false);

  useEffect(() => {
    setFilters(filtersFromParams(searchParams));
  }, [searchParams]);

  const updateFilters = useCallback(
    (next: FeedFiltersState) => {
      setFilters(next);
      const qs = paramsFromFilters(next).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  const load = useCallback(async () => {
    setLoading(true);

    const params = paramsFromFilters(filters);
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
      <FeedFilters value={filters} onChange={updateFilters} />
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
