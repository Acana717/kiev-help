"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchJson } from "@/lib/fetch-json";
import type { AdminPostRow } from "@/lib/types";
import { categoryLabel, formatRelativeTime, statusLabel } from "@/lib/labels";
import { SERVER_UNAVAILABLE_MESSAGE } from "@/lib/messages";

export function AdminPanel() {
  const [posts, setPosts] = useState<AdminPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { ok, data, error: err } = await fetchJson<{ posts?: AdminPostRow[] }>(
      "/api/admin/posts"
    );

    if (!ok || !data?.posts) {
      setError(err ?? SERVER_UNAVAILABLE_MESSAGE);
      setPosts([]);
      setLoading(false);
      return;
    }

    setPosts(data.posts);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Видалити оголошення «${title}»?`)) return;

    setDeletingId(id);
    const { ok, error: err } = await fetchJson<{ deleted?: boolean }>(
      `/api/admin/posts/${id}`,
      { method: "DELETE" }
    );
    setDeletingId(null);

    if (!ok) {
      alert(err ?? "Не вдалося видалити");
      return;
    }

    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return (
      <div className="kh-card animate-pulse space-y-3">
        <div className="h-6 w-40 rounded bg-neutral-800" />
        <div className="h-32 rounded bg-neutral-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="kh-card">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="kh-section-kicker">Admin</p>
          <h1 className="kh-section-title">Усі оголошення</h1>
        </div>
        <p className="kh-meta">{posts.length} записів</p>
      </div>

      <div className="kh-card overflow-x-auto p-0 sm:p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800/90 text-xs uppercase tracking-[0.1em] text-neutral-500">
              <th className="px-4 py-3 font-medium sm:px-6">Оголошення</th>
              <th className="px-4 py-3 font-medium">Категорія</th>
              <th className="px-4 py-3 font-medium">Район</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium">Перегляди</th>
              <th className="px-4 py-3 font-medium sm:px-6">Дії</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-neutral-800/60 transition-colors hover:bg-black/30"
              >
                <td className="px-4 py-4 sm:px-6">
                  <p className="font-medium text-foreground">{post.title}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {formatRelativeTime(post.created_at)}
                  </p>
                </td>
                <td className="px-4 py-4 text-neutral-400">
                  {categoryLabel(post.category)}
                </td>
                <td className="px-4 py-4 text-neutral-400">
                  {post.district ?? "—"}
                </td>
                <td className="px-4 py-4">
                  <span className="kh-badge">{statusLabel(post.status)}</span>
                </td>
                <td className="px-4 py-4 tabular-nums text-neutral-400">
                  {post.views_count}
                </td>
                <td className="px-4 py-4 sm:px-6">
                  <button
                    type="button"
                    disabled={deletingId === post.id}
                    onClick={() => handleDelete(post.id, post.title)}
                    className="rounded-lg border border-red-900/60 px-3 py-1.5 text-xs font-medium text-red-400 transition-all duration-200 hover:border-red-700 hover:bg-red-950/30 disabled:opacity-50"
                  >
                    {deletingId === post.id ? "…" : "Видалити"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-neutral-500">
            Оголошень немає
          </p>
        )}
      </div>

      <p className="text-xs leading-relaxed text-neutral-600">
        Базова адмін-панель без авторизації. Не публікуйте URL /admin у відкритому
        доступі до впровадження захисту.
      </p>
    </div>
  );
}
