"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PostPublic } from "@/lib/types";
import { fetchJson } from "@/lib/fetch-json";
import { categoryLabel, formatRelativeTime } from "@/lib/labels";
import { SERVER_UNAVAILABLE_MESSAGE } from "@/lib/messages";
import { PostViewsCounter } from "./PostViewsCounter";
import { DescriptionText } from "./DescriptionText";
import { RevealContacts } from "./RevealContacts";
import { ReportButton } from "./ReportButton";

type PostDetail = PostPublic & {
  has_phone?: boolean;
  has_telegram?: boolean;
  has_card?: boolean;
  has_jar?: boolean;
};

interface PostDetailViewProps {
  postId: string;
}

export function PostDetailView({ postId }: PostDetailViewProps) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { ok, data, error: err } = await fetchJson<{ post?: PostDetail }>(
        `/api/posts/${postId}`
      );

      if (cancelled) return;

      if (!ok || !data?.post) {
        setPost(null);
        setError(err ?? SERVER_UNAVAILABLE_MESSAGE);
        setLoading(false);
        return;
      }

      setPost(data.post);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  if (loading) {
    return (
      <div className="kh-card animate-pulse space-y-4">
        <div className="h-4 w-24 rounded bg-neutral-800" />
        <div className="h-8 w-3/4 rounded bg-neutral-800" />
        <div className="h-20 rounded bg-neutral-800" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="kh-card text-center">
        <p className="text-sm text-foreground">{error ?? "Оголошення не знайдено"}</p>
        <Link href="/" className="kh-link mt-4 inline-block text-sm">
          ← До стрічки
        </Link>
      </div>
    );
  }

  return (
    <article className="kh-detail-wrap space-y-6">
      <Link href="/" className="kh-link inline-flex items-center gap-1 text-sm">
        <span aria-hidden>←</span> До стрічки
      </Link>

      <div className="kh-card overflow-hidden p-0">
        {post.image_url && (
          <div className="relative aspect-[16/10] w-full bg-black md:aspect-video lg:max-h-[420px] lg:aspect-[21/9]">
            <Image
              src={post.image_url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="kh-badge">{categoryLabel(post.category)}</span>
              {post.district && (
                <span className="kh-badge border-neutral-700/80 text-neutral-400">
                  {post.district}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <PostViewsCounter postId={post.id} initialCount={post.views_count} />
              <time className="kh-meta" dateTime={post.created_at}>
                {formatRelativeTime(post.created_at)}
              </time>
            </div>
          </div>

          <header className="space-y-2">
            <h1 className="font-bebas text-3xl leading-tight tracking-wide text-foreground sm:text-4xl">
              {post.title}
            </h1>
          </header>

          <DescriptionText
            text={post.description}
            className="text-base text-neutral-300"
          />

          {post.bank_name && (
            <p className="text-sm text-neutral-500">Банк: {post.bank_name}</p>
          )}

          <RevealContacts
            postId={post.id}
            hasPhone={!!post.has_phone}
            hasTelegram={!!post.has_telegram}
            hasCard={!!post.has_card}
            hasJar={!!post.has_jar}
            bankName={post.bank_name}
          />

          <ReportButton postId={post.id} />
        </div>
      </div>
    </article>
  );
}
